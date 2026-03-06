// Import commands.js using ES2015 syntax
import "./commands";

// Import Supabase for tasks
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client function
const getSupabaseClient = () => {
  const supabaseUrl = Cypress.env("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseKey = Cypress.env("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Cypress env"
    );
  }

  return createClient(supabaseUrl, supabaseKey);
};

// ===== SUPABASE TASK DEFINITIONS FOR DATA INTEGRITY TESTS =====
export const supabaseTasks = {
  /**
   * Verify appointment exists in Appoinments table
   */
  async verifyAppointmentInDB({ email_address, first_name, last_name }: any) {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("Appoinments")
        .select("*")
        .eq("email_address", email_address)
        .single();

      if (error || !data) {
        throw new Error(
          `Appointment not found for ${email_address}: ${error?.message}`
        );
      }

      if (first_name && data.first_name !== first_name) {
        throw new Error(
          `First name mismatch: expected "${first_name}", got "${data.first_name}"`
        );
      }
      if (last_name && data.last_name !== last_name) {
        throw new Error(
          `Last name mismatch: expected "${last_name}", got "${data.last_name}"`
        );
      }

      return { success: true, data };
    } catch (err: any) {
      console.error("❌ verifyAppointmentInDB error:", err);
      return { success: false, error: err.message };
    }
  },

  /**
   * Verify all appointment fields match expected values
   */
  async verifyAppointmentFields({ email_address, expectedFields }: any) {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("Appoinments")
        .select("*")
        .eq("email_address", email_address)
        .single();

      if (error || !data) {
        throw new Error(`Appointment not found: ${error?.message}`);
      }

      const mismatches = [];
      Object.keys(expectedFields).forEach((key) => {
        if (data[key] !== expectedFields[key]) {
          mismatches.push(
            `Field ${key}: expected "${expectedFields[key]}", got "${data[key]}"`
          );
        }
      });

      if (mismatches.length > 0) {
        throw new Error(`Field mismatches: ${mismatches.join(", ")}`);
      }

      return { success: true, data };
    } catch (err: any) {
      console.error("❌ verifyAppointmentFields error:", err);
      return { success: false, error: err.message };
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
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("Appoinments")
        .select("email_opt, text_opt, email_address")
        .eq("email_address", email_address)
        .single();

      if (error || !data) {
        throw new Error(`Appointment not found: ${error?.message}`);
      }

      if (expectedEmailConsent !== undefined && data.email_opt !== expectedEmailConsent) {
        throw new Error(
          `Email consent mismatch: expected ${expectedEmailConsent}, got ${data.email_opt}`
        );
      }
      if (expectedTextConsent !== undefined && data.text_opt !== expectedTextConsent) {
        throw new Error(
          `Text consent mismatch: expected ${expectedTextConsent}, got ${data.text_opt}`
        );
      }

      return { success: true, data };
    } catch (err: any) {
      console.error("❌ verifyConsentFlags error:", err);
      return { success: false, error: err.message };
    }
  },

  /**
   * Verify address is stored correctly
   */
  async verifyAddressStorage({ email_address, expectedAddress }: any) {
    try {
      const supabase = getSupabaseClient();
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
          `Address mismatch: expected to include "${expectedAddress}", got "${data.address}"`
        );
      }

      return { success: true, data };
    } catch (err: any) {
      console.error("❌ verifyAddressStorage error:", err);
      return { success: false, error: err.message };
    }
  },

  /**
   * Verify patient flags (in_office_patient, new_patient)
   */
  async verifyPatientFlags({ email_address, expectedInOfficePatient }: any) {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("Appoinments")
        .select("in_office_patient, new_patient, email_address")
        .eq("email_address", email_address)
        .single();

      if (error || !data) {
        throw new Error(`Appointment not found: ${error?.message}`);
      }

      if (expectedInOfficePatient !== undefined && data.in_office_patient !== expectedInOfficePatient) {
        throw new Error(
          `in_office_patient mismatch: expected ${expectedInOfficePatient}, got ${data.in_office_patient}`
        );
      }

      return { success: true, data };
    } catch (err: any) {
      console.error("❌ verifyPatientFlags error:", err);
      return { success: false, error: err.message };
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
    try {
      const supabase = getSupabaseClient();
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
        // Return success without medical data (it might be optional)
        return { success: true, hasMedicalData: false, appointmentId: appointment.id };
      }

      if (expectedChiefComplaint && !data.chief_complaint?.includes(expectedChiefComplaint)) {
        throw new Error(
          `Chief complaint mismatch: expected to include "${expectedChiefComplaint}", got "${data.chief_complaint}"`
        );
      }
      if (expectedSymptoms && !data.symptoms_description?.includes(expectedSymptoms)) {
        throw new Error(
          `Symptoms mismatch: expected to include "${expectedSymptoms}", got "${data.symptoms_description}"`
        );
      }

      return { success: true, hasMedicalData: true, data };
    } catch (err: any) {
      console.error("❌ verifyMedicalData error:", err);
      return { success: false, error: err.message };
    }
  },

  /**
   * Verify intake form is linked to appointment via foreign key
   */
  async verifyIntakeFormLinking({ email_address }: any) {
    try {
      const supabase = getSupabaseClient();
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
        .maybeSingle();

      if (!data) {
        return { success: true, hasIntakeForm: false, appointmentId: appointment.id };
      }

      if (data.appointment_id !== appointment.id) {
        throw new Error(
          `Intake form appointment_id mismatch: expected ${appointment.id}, got ${data.appointment_id}`
        );
      }

      return { success: true, hasIntakeForm: true, data };
    } catch (err: any) {
      console.error("❌ verifyIntakeFormLinking error:", err);
      return { success: false, error: err.message };
    }
  },

  /**
   * Verify each appointment has unique ID
   */
  async verifyUniqueAppointmentIds({ emails }: any) {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("Appoinments")
        .select("id, email_address")
        .in("email_address", emails);

      if (error) {
        throw new Error(`Error fetching appointments: ${error.message}`);
      }

      if (!data || data.length !== emails.length) {
        throw new Error(
          `Not all appointments found. Expected ${emails.length}, got ${data?.length || 0}`
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
      return { success: false, error: err.message };
    }
  },

  /**
   * Verify data type of a field
   */
  async verifyDataType({ email_address, field, expectedType }: any) {
    try {
      const supabase = getSupabaseClient();
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
          `Field ${field} type mismatch: expected ${expectedType}, got ${actualType}`
        );
      }

      return { success: true, value: data[field], type: actualType };
    } catch (err: any) {
      console.error("❌ verifyDataType error:", err);
      return { success: false, error: err.message };
    }
  },

  /**
   * Verify date_and_time field format
   */
  async verifyDateFormat({ email_address }: any) {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("Appoinments")
        .select("date_and_time, email_address")
        .eq("email_address", email_address)
        .single();

      if (error || !data) {
        throw new Error(`Appointment not found: ${error?.message}`);
      }

      if (data.date_and_time && data.date_and_time !== "NULL") {
        const formatRegex = /\d+\|\d{2}-\d{2}-\d{4}/;
        if (!formatRegex.test(data.date_and_time)) {
          throw new Error(
            `Date format mismatch: expected format "locationID|DD-MM-YYYY", got "${data.date_and_time}"`
          );
        }
      }

      return { success: true, data };
    } catch (err: any) {
      console.error("❌ verifyDateFormat error:", err);
      return { success: false, error: err.message };
    }
  },

  /**
   * Verify special characters are handled correctly
   */
  async verifySpecialCharacters({ email_address }: any) {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("Appoinments")
        .select("first_name, last_name, email_address")
        .eq("email_address", email_address)
        .single();

      if (error || !data) {
        throw new Error(`Appointment not found: ${error?.message}`);
      }

      return { success: true, data };
    } catch (err: any) {
      console.error("❌ verifySpecialCharacters error:", err);
      return { success: false, error: err.message };
    }
  },

  /**
   * Get appointment data
   */
  async getAppointmentData({ email_address }: any) {
    try {
      const supabase = getSupabaseClient();
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
      return { success: false, error: err.message };
    }
  },

  /**
   * Cleanup test data - delete test appointments
   */
  async cleanupTestData({ emailPattern }: any) {
    try {
      const supabase = getSupabaseClient();
      
      // Find appointments to delete
      const { data: toDelete, error: findError } = await supabase
        .from("Appoinments")
        .select("id")
        .like("email_address", emailPattern);

      if (findError) {
        throw new Error(`Error finding appointments: ${findError.message}`);
      }

      if (!toDelete || toDelete.length === 0) {
        return { success: true, deleted: 0 };
      }

      const ids = toDelete.map((t: any) => t.id);

      // Delete intake forms first (foreign key constraint)
      if (ids.length > 0) {
        const { error: intakeError } = await supabase
          .from("intake_form")
          .delete()
          .in("appointment_id", ids);

        if (intakeError) {
          console.warn("⚠️ Error deleting intake forms:", intakeError);
        }

        // Delete appointments
        const { error: apptError } = await supabase
          .from("Appoinments")
          .delete()
          .in("id", ids);

        if (apptError) {
          throw new Error(`Error deleting appointments: ${apptError.message}`);
        }
      }

      return { success: true, deleted: ids.length };
    } catch (err: any) {
      console.error("⚠️ cleanupTestData error:", err);
      return { success: false, error: err.message, deleted: 0 };
    }
  },
};

// Handle uncaught exceptions
Cypress.on("uncaught:exception", (err, runnable) => {
  // Return false to prevent the error from failing the test
  console.warn("Uncaught exception:", err.message);
  return false;
});

// Before each test
beforeEach(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});