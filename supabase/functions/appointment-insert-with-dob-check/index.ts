import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

/**
 * supabase-js hands back PostgREST failures as plain objects, not Error
 * instances, so `err instanceof Error` is false for every database problem and
 * the old catch reported all of them as "Unknown error". Keep the real text.
 */
function describe(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === "object") {
    const e = err as Record<string, unknown>;
    return [e.message, e.details, e.hint, e.code]
      .filter((part) => typeof part === "string" && part.length > 0)
      .join(" — ") || JSON.stringify(err);
  }
  return String(err);
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return json({ status: "error", message: "Method not allowed" }, 405);
    }

    const body = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const {
      firstname,
      lastname,
      email,
      phone,
      gender,
      dob,
      locationid,
      onsite,
      text_opt,
      email_opt,
      address,
      service,
      date_and_time,
    } = body;

    // Appoinments.location_id and the Locations foreign key are both NOT NULL,
    // so a missing or non-numeric location can only fail deep in the insert.
    // Reject it here, where the message can say what is actually wrong.
    const locationId = Number(locationid);
    if (!Number.isInteger(locationId) || locationId <= 0) {
      return json(
        {
          status: "error",
          message: `Invalid location id: ${JSON.stringify(locationid)}`,
        },
        400,
      );
    }
    if (!phone) {
      return json({ status: "error", message: "Phone is required" }, 400);
    }

    // The portal stores this column as "<location id>|DD-MM-YYYY - h:mm AM",
    // which is not a parseable Date. Passing it through Date() turned every
    // booked slot into null, so keep the string the caller sent.
    const slot = typeof date_and_time === "string" && date_and_time.trim() !== ""
      ? date_and_time.trim()
      : null;

    let patientId: number | null = null;

    // Match on phone, narrowing by dob only when we were given one — most rows
    // in allpatients have no dob, so requiring it sent returning patients down
    // the insert path.
    let lookup = supabase
      .from("allpatients")
      .select("id")
      .eq("phone", phone)
      .is("deleted_at", null)
      .order("id", { ascending: false })
      .limit(1);
    if (dob) lookup = lookup.eq("dob", dob);

    const { data: existing, error: existingError } = await lookup.maybeSingle();
    if (existingError) throw existingError;

    if (existing) {
      patientId = existing.id;
    } else {
      const { data: newPatient, error: insertError } = await supabase
        .from("allpatients")
        .insert({
          firstname,
          lastname,
          email,
          phone,
          gender,
          dob,
          locationid: locationId,
          onsite,
          text_opt: text_opt ?? false,
          email_opt: email_opt ?? false,
          address,
        })
        .select("id")
        .maybeSingle();

      if (insertError) throw insertError;

      if (newPatient) {
        patientId = newPatient.id;
      } else {
        // handle_allpatients_before_insert is a BEFORE INSERT trigger that
        // RETURNs NULL when the same email+phone already exists, which cancels
        // the row silently. Nothing came back, so resolve the patient it
        // deliberately kept instead of treating the empty result as a failure.
        const { data: deduped, error: dedupedError } = await supabase
          .from("allpatients")
          .select("id")
          .eq("phone", phone)
          .order("id", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (dedupedError) throw dedupedError;
        if (!deduped) {
          throw new Error(
            "Patient row was rejected by the database and no existing match was found",
          );
        }
        patientId = deduped.id;
      }
    }

    // trg_assign_patient_id re-resolves patient_id from the appointment's own
    // email_address/phone and creates a blank patient when they are empty, so
    // these columns have to carry the booking's details too.
    const { data: appointment, error: aptError } = await supabase
      .from("Appoinments")
      .insert({
        location_id: locationId,
        patient_id: patientId,
        first_name: firstname,
        last_name: lastname,
        email_address: email,
        phone,
        dob,
        sex: gender,
        address,
        service,
        date_and_time: slot,
        in_office_patient: onsite ?? false,
        text_opt: text_opt ?? false,
        email_opt: email_opt ?? false,
        isApproved: false,
      })
      .select("id")
      .single();

    if (aptError) throw aptError;

    return json(
      {
        status: "success",
        patient_id: patientId,
        appointment_id: appointment.id,
      },
      201,
    );
  } catch (err) {
    console.error("appointment-insert-with-dob-check failed:", err);
    return json({ status: "error", message: describe(err) }, 500);
  }
});
