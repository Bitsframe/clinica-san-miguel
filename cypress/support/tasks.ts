// Supabase Tasks for Cypress - Config-time safe (no Cypress global dependency)
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client using process.env (available at config time)
const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn(
      "⚠️ Supabase credentials not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
};

// ===== SUPABASE TASK DEFINITIONS FOR DATA INTEGRITY TESTS =====
export const supabaseTasks = {
  /**
   * Verify appointment exists in Appoinments table
   */
  async verifyAppointmentInDB({ email_address, first_name, last_name }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      const { data, error } = await supabase
        .from("Appoinments")
        .select("*")
        .eq("email_address", email_address)
        .single();

      if (error || !data) {
        throw new Error(
          `Appointment not found for ${email_address}: ${error?.message}`,
        );
      }

      if (first_name && data.first_name !== first_name) {
        throw new Error(
          `First name mismatch: expected "${first_name}", got "${data.first_name}"`,
        );
      }
      if (last_name && data.last_name !== last_name) {
        throw new Error(
          `Last name mismatch: expected "${last_name}", got "${data.last_name}"`,
        );
      }

      return { success: true, data };
    } catch (err: any) {
      console.error("❌ verifyAppointmentInDB error:", err);
      throw err;
    }
  },

  /**
   * Verify all appointment fields match expected values
   */
  async verifyAppointmentFields({ email_address, expectedFields }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      const { data, error } = await supabase
        .from("Appoinments")
        .select("*")
        .eq("email_address", email_address)
        .single();

      if (error || !data) {
        throw new Error(`Appointment not found: ${error?.message}`);
      }

      Object.keys(expectedFields).forEach((key) => {
        if (data[key] !== expectedFields[key]) {
          throw new Error(
            `Field ${key} mismatch: expected "${expectedFields[key]}", got "${data[key]}"`,
          );
        }
      });

      return { success: true, data };
    } catch (err: any) {
      console.error("❌ verifyAppointmentFields error:", err);
      throw err;
    }
  },

  /**
   * Verify patient flags (in_office_patient, new_patient)
   */
  async verifyPatientFlags({ email_address, expectedInOfficePatient }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      const { data, error } = await supabase
        .from("Appoinments")
        .select("in_office_patient, new_patient, email_address")
        .eq("email_address", email_address)
        .single();

      if (error || !data) {
        throw new Error(`Appointment not found: ${error?.message}`);
      }

      if (
        expectedInOfficePatient !== undefined &&
        data.in_office_patient !== expectedInOfficePatient
      ) {
        throw new Error(
          `in_office_patient mismatch: expected ${expectedInOfficePatient}, got ${data.in_office_patient}`,
        );
      }

      return { success: true, data };
    } catch (err: any) {
      console.error("❌ verifyPatientFlags error:", err);
      throw err;
    }
  },

  /**
   * Verify location_id is stored
   */
  async verifyLocationId({ email_address }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      const { data, error } = await supabase
        .from("Appoinments")
        .select("location_id, email_address")
        .eq("email_address", email_address)
        .single();

      if (error || !data) {
        throw new Error(`Appointment not found: ${error?.message}`);
      }

      if (!data.location_id) {
        console.warn("⚠️ location_id is null");
      }

      return { success: true, data };
    } catch (err: any) {
      console.error("❌ verifyLocationId error:", err);
      throw err;
    }
  },

  /**
   * Verify medical form data in intake_form table
   */
  async verifyMedicalData({
    email_address,
    expectedChiefComplaint,
    expectedSymptoms,
  }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      const { data: appointment, error: apptError } = await supabase
        .from("Appoinments")
        .select("id")
        .eq("email_address", email_address)
        .single();

      if (apptError || !appointment) {
        throw new Error(`Appointment not found: ${apptError?.message}`);
      }

      const { data, error } = await supabase
        .from("intake_form")
        .select("*")
        .eq("appointment_id", appointment.id)
        .single();

      if (error || !data) {
        throw new Error(`Medical data not found: ${error?.message}`);
      }

      if (
        expectedChiefComplaint &&
        !data.chief_complaint?.includes(expectedChiefComplaint)
      ) {
        throw new Error(
          `Chief complaint mismatch: expected to include "${expectedChiefComplaint}"`,
        );
      }
      if (
        expectedSymptoms &&
        !data.symptoms_description?.includes(expectedSymptoms)
      ) {
        throw new Error(
          `Symptoms mismatch: expected to include "${expectedSymptoms}"`,
        );
      }

      return { success: true, data };
    } catch (err: any) {
      console.error("❌ verifyMedicalData error:", err);
      throw err;
    }
  },

  /**
   * Verify intake form is linked to appointment via foreign key
   */
  async verifyIntakeFormLinking({ email_address }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      const { data: appointment, error: apptError } = await supabase
        .from("Appoinments")
        .select("id")
        .eq("email_address", email_address)
        .single();

      if (apptError || !appointment) {
        throw new Error(`Appointment not found: ${apptError?.message}`);
      }

      const { data, error } = await supabase
        .from("intake_form")
        .select("appointment_id")
        .eq("appointment_id", appointment.id)
        .single();

      if (error || !data) {
        throw new Error(
          `Intake form not found for appointment: ${error?.message}`,
        );
      }

      if (data.appointment_id !== appointment.id) {
        throw new Error(
          `Intake form linking mismatch: expected ${appointment.id}, got ${data.appointment_id}`,
        );
      }

      return { success: true, data };
    } catch (err: any) {
      console.error("❌ verifyIntakeFormLinking error:", err);
      throw err;
    }
  },

  /**
   * Verify service is stored correctly
   */
  async verifyServiceStorage({ email_address, expectedService }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      const { data, error } = await supabase
        .from("Appoinments")
        .select("service")
        .eq("email_address", email_address)
        .single();

      if (error || !data) {
        throw new Error(`Appointment not found: ${error?.message}`);
      }

      if (expectedService && data.service !== expectedService) {
        throw new Error(
          `Service mismatch: expected "${expectedService}", got "${data.service}"`,
        );
      }

      return { success: true, data };
    } catch (err: any) {
      console.error("❌ verifyServiceStorage error:", err);
      throw err;
    }
  },

  /**
   * Verify each appointment has unique ID
   */
  async verifyUniqueAppointmentIds({ emails }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      const { data, error } = await supabase
        .from("Appoinments")
        .select("id, email_address")
        .in("email_address", emails);

      if (error || !data || data.length !== emails.length) {
        throw new Error(
          `Not all appointments found. Expected ${emails.length}, got ${data?.length || 0}`,
        );
      }

      const ids = data.map((d: any) => d.id);
      const uniqueIds = new Set(ids);

      if (uniqueIds.size !== ids.length) {
        throw new Error("Appointment IDs are not unique!");
      }

      return { success: true, count: ids.length, data };
    } catch (err: any) {
      console.error("❌ verifyUniqueAppointmentIds error:", err);
      throw err;
    }
  },

  /**
   * Verify data type of a field
   */
  async verifyDataType({ email_address, field, expectedType }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      const { data, error } = await supabase
        .from("Appoinments")
        .select(field)
        .eq("email_address", email_address)
        .single();

      if (error || !data) {
        throw new Error(`Appointment not found: ${error?.message}`);
      }

      const actualType = typeof data[field];
      if (actualType !== expectedType) {
        throw new Error(
          `Field ${field} type mismatch: expected ${expectedType}, got ${actualType}`,
        );
      }

      return { success: true, value: data[field], type: actualType };
    } catch (err: any) {
      console.error("❌ verifyDataType error:", err);
      throw err;
    }
  },

  /**
   * Verify intake form appointment linkage
   */
  async verifyIntakeLinkage({ email_address }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      const { data, error } = await supabase
        .from("Appoinments")
        .select("id")
        .eq("email_address", email_address)
        .single();

      if (error || !data) {
        throw new Error(`Appointment not found: ${error?.message}`);
      }

      return { success: true, appointmentId: data.id };
    } catch (err: any) {
      console.error("❌ verifyIntakeLinkage error:", err);
      throw err;
    }
  },

  /**
   * Verify data is stored (basic check)
   */
  async verifySpecialCharacters({ email_address }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      const { data, error } = await supabase
        .from("Appoinments")
        .select("first_name, last_name, email_address")
        .eq("email_address", email_address)
        .single();

      if (error || !data) {
        throw new Error(`Appointment not found: ${error?.message}`);
      }

      if (!data.first_name || data.first_name.trim() === "") {
        throw new Error("First name is empty");
      }

      return { success: true, data };
    } catch (err: any) {
      console.error("❌ verifySpecialCharacters error:", err);
      throw err;
    }
  },

  /**
   * Cleanup test data - delete test appointments
   */
  async cleanupTestData({ emailPattern }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, deleted: 0 };

    try {
      const { data: toDelete } = await supabase
        .from("Appoinments")
        .select("id")
        .like("email_address", emailPattern);

      if (!toDelete || toDelete.length === 0) {
        return { success: true, deleted: 0 };
      }

      const ids = toDelete.map((t: any) => t.id);
      await supabase.from("intake_form").delete().in("appointment_id", ids);
      await supabase.from("Appoinments").delete().in("id", ids);

      return { success: true, deleted: ids.length };
    } catch (err: any) {
      console.error("⚠️ cleanupTestData error:", err);
      return { success: false, deleted: 0 };
    }
  },

  /**
   * Get appointment data
   */
  async getAppointmentData({ email_address }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      const { data, error } = await supabase
        .from("Appoinments")
        .select("*")
        .eq("email_address", email_address)
        .single();

      if (error || !data) {
        throw new Error(`Appointment not found: ${error?.message}`);
      }

      return { success: true, data };
    } catch (err: any) {
      console.error("❌ getAppointmentData error:", err);
      throw err;
    }
  },

  /**
   * Verify complete appointment flow
   */
  async verifyCompleteAppointmentFlow({ email_address }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      const { data: appointment, error: apptError } = await supabase
        .from("Appoinments")
        .select("*")
        .eq("email_address", email_address)
        .single();

      if (apptError || !appointment) {
        throw new Error(`Appointment not found: ${apptError?.message}`);
      }

      // Verify required fields
      const requiredFields = [
        "first_name",
        "last_name",
        "email_address",
        "location_id",
      ];
      const missingFields = requiredFields.filter((f) => !appointment[f]);

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      let intakeData = null;
      if (appointment.id) {
        const { data: intake } = await supabase
          .from("intake_form")
          .select("*")
          .eq("appointment_id", appointment.id)
          .single();

        if (intake) intakeData = intake;
      }

      return {
        success: true,
        appointment,
        hasIntakeForm: !!intakeData,
        intakeData,
      };
    } catch (err: any) {
      console.error("❌ verifyCompleteAppointmentFlow error:", err);
      throw err;
    }
  },

  /**
   * Verify consent flags (email_opt and text_opt)
   */
  async verifyConsentFlags({
    email_address,
    expectedEmailConsent,
    expectedTextConsent,
  }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      const { data, error } = await supabase
        .from("Appoinments")
        .select("email_opt, text_opt, email_address")
        .eq("email_address", email_address)
        .single();

      if (error || !data) {
        throw new Error(`Appointment not found: ${error?.message}`);
      }

      if (
        expectedEmailConsent !== undefined &&
        data.email_opt !== expectedEmailConsent
      ) {
        throw new Error(
          `email_opt mismatch: expected ${expectedEmailConsent}, got ${data.email_opt}`,
        );
      }
      if (
        expectedTextConsent !== undefined &&
        data.text_opt !== expectedTextConsent
      ) {
        throw new Error(
          `text_opt mismatch: expected ${expectedTextConsent}, got ${data.text_opt}`,
        );
      }

      return { success: true, data };
    } catch (err: any) {
      console.error("❌ verifyConsentFlags error:", err);
      throw err;
    }
  },

  /**
   * Verify address is stored correctly
   */
  async verifyAddressStorage({ email_address, expectedAddress }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      const { data, error } = await supabase
        .from("Appoinments")
        .select("address, email_address")
        .eq("email_address", email_address)
        .single();

      if (error || !data) {
        throw new Error(`Appointment not found: ${error?.message}`);
      }

      if (expectedAddress && !data.address?.includes(expectedAddress)) {
        throw new Error(
          `Address mismatch: expected to include "${expectedAddress}", got "${data.address}"`,
        );
      } else if (!expectedAddress && (!data.address || data.address === "")) {
        throw new Error("Address is empty");
      }

      return { success: true, data };
    } catch (err: any) {
      console.error("❌ verifyAddressStorage error:", err);
      throw err;
    }
  },

  /**
   * Verify date_and_time field format
   */
  async verifyDateFormat({ email_address }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      const { data, error } = await supabase
        .from("Appoinments")
        .select("date_and_time, email_address")
        .eq("email_address", email_address)
        .single();

      if (error || !data) {
        throw new Error(`Appointment not found: ${error?.message}`);
      }

      if (data.date_and_time && data.date_and_time !== "NULL") {
        // Expected format: "locationID|DD-MM-YYYY - HH:MM AM/PM"
        const formatRegex = /\d+\|\d{2}-\d{2}-\d{4}/;
        if (!formatRegex.test(data.date_and_time)) {
          throw new Error(
            `date_and_time format invalid: "${data.date_and_time}"`,
          );
        }
      }

      return { success: true, data };
    } catch (err: any) {
      console.error("❌ verifyDateFormat error:", err);
      throw err;
    }
  },

  /**
   * Verify state extraction and storage
   */
  async verifyStateExtraction({ email_address, expectedState }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      const { data, error } = await supabase
        .from("Appoinments")
        .select("states, email_address")
        .eq("email_address", email_address)
        .single();

      if (error || !data) {
        throw new Error(`Appointment not found: ${error?.message}`);
      }

      if (expectedState && data.states !== expectedState) {
        throw new Error(
          `State mismatch: expected "${expectedState}", got "${data.states}"`,
        );
      }

      return { success: true, data };
    } catch (err: any) {
      console.error("❌ verifyStateExtraction error:", err);
      throw err;
    }
  },

  /**
   * Verify zipcode is stored
   */
  async verifyZipcodeStorage({ email_address, expectedZipcode }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      const { data, error } = await supabase
        .from("Appoinments")
        .select("address, email_address")
        .eq("email_address", email_address)
        .single();

      if (error || !data) {
        throw new Error(`Appointment not found: ${error?.message}`);
      }

      if (expectedZipcode && data.address) {
        if (!data.address.includes(expectedZipcode)) {
          throw new Error(
            `Zipcode "${expectedZipcode}" not found in address "${data.address}"`,
          );
        }
      }

      return { success: true, data };
    } catch (err: any) {
      console.error("❌ verifyZipcodeStorage error:", err);
      throw err;
    }
  },

  // Dummy task for test purposes
  logMessage(message: string) {
    console.log(message);
    return null;
  },
};
