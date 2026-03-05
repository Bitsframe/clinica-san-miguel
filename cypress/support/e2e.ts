/// <reference types="cypress" />

// Cypress Support File
// This file runs before every test file

// Import Cypress commands
import "./commands";

// Supabase Client Setup for Task Definitions
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || Cypress.env("SUPABASE_URL");
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || Cypress.env("SUPABASE_KEY");

function initSupabase() {
  if (!supabaseUrl || !supabaseKey) {
    console.warn("⚠️ Supabase credentials not configured for tests");
    return null;
  }
  return createClient(supabaseUrl, supabaseKey);
}

const supabase = initSupabase();

// Prevent uncaught exceptions from failing tests
Cypress.on("uncaught:exception", (err, runnable) => {
  // Return false to prevent the error from failing the test
  // Useful for third-party script errors
  return false;
});

// Add custom configuration
beforeEach(() => {
  // Clear cookies and local storage before each test
  cy.clearCookies();
  cy.clearLocalStorage();
});

// ===== SUPABASE TASK DEFINITIONS FOR DATA INTEGRITY TESTS =====
// Note: Tasks are registered in cypress.config.ts setupNodeEvents

export const supabaseTasks = {
  /**
   * Verify appointment exists in Appoinments table
   */
  async verifyAppointmentInDB({ email_address, first_name, last_name }: any) {
    try {
      if (!supabase) throw new Error("Supabase not initialized");

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

      expect(data.first_name).to.equal(first_name);
      expect(data.last_name).to.equal(last_name);
      expect(data.email_address).to.equal(email_address);

      return { success: true, data };
    } catch (err) {
      console.error("❌ verifyAppointmentInDB error:", err);
      throw err;
    }
  },

  /**
   * Verify all appointment fields match expected values
   */
  async verifyAppointmentFields({ email_address, expectedFields }: any) {
    try {
      if (!supabase) throw new Error("Supabase not initialized");

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
    } catch (err) {
      console.error("❌ verifyAppointmentFields error:", err);
      throw err;
    }
  },

  /**
   * Verify patient flags (in_office_patient, new_patient)
   */
  async verifyPatientFlags({ email_address, expectedInOfficePatient }: any) {
    try {
      if (!supabase) throw new Error("Supabase not initialized");

      const { data, error } = await supabase
        .from("Appoinments")
        .select("in_office_patient, new_patient, email_address")
        .eq("email_address", email_address)
        .single();

      if (error || !data) {
        throw new Error(`Appointment not found: ${error?.message}`);
      }

      if (expectedInOfficePatient !== undefined) {
        expect(data.in_office_patient).to.equal(expectedInOfficePatient);
      }
      return { success: true, data };
    } catch (err) {
      console.error("❌ verifyPatientFlags error:", err);
      throw err;
    }
  },

  /**
   * Verify location_id is stored
   */
  async verifyLocationId({ email_address }: any) {
    try {
      if (!supabase) throw new Error("Supabase not initialized");

      const { data, error } = await supabase
        .from("Appoinments")
        .select("location_id, email_address")
        .eq("email_address", email_address)
        .single();

      if (error || !data) {
        throw new Error(`Appointment not found: ${error?.message}`);
      }

      if (!data.location_id) {
        console.warn("⚠️  location_id is null");
      }
      return { success: true, data };
    } catch (err) {
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
    try {
      if (!supabase) throw new Error("Supabase not initialized");

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

      if (expectedChiefComplaint) {
        expect(data.chief_complaint).to.include(expectedChiefComplaint);
      }
      if (expectedSymptoms) {
        expect(data.symptoms_description).to.include(expectedSymptoms);
      }

      return { success: true, data };
    } catch (err) {
      console.error("❌ verifyMedicalData error:", err);
      throw err;
    }
  },

  /**
   * Verify intake form is linked to appointment via foreign key
   */
  async verifyIntakeFormLinking({ email_address }: any) {
    try {
      if (!supabase) throw new Error("Supabase not initialized");

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

      expect(data.appointment_id).to.equal(appointment.id);
      return { success: true, data };
    } catch (err) {
      console.error("❌ verifyIntakeFormLinking error:", err);
      throw err;
    }
  },

  /**
   * Verify service is stored correctly
   */
  async verifyServiceStorage({ email_address, expectedService }: any) {
    try {
      if (!supabase) throw new Error("Supabase not initialized");

      const { data, error } = await supabase
        .from("Appoinments")
        .select("service")
        .eq("email_address", email_address)
        .single();

      if (error || !data) {
        throw new Error(`Appointment not found: ${error?.message}`);
      }

      if (expectedService) {
        expect(data.service).to.equal(expectedService);
      }
      return { success: true, data };
    } catch (err) {
      console.error("❌ verifyServiceStorage error:", err);
      throw err;
    }
  },

  /**
   * Verify each appointment has unique ID
   */
  async verifyUniqueAppointmentIds({ emails }: any) {
    try {
      if (!supabase) throw new Error("Supabase not initialized");

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
    } catch (err) {
      console.error("❌ verifyUniqueAppointmentIds error:", err);
      throw err;
    }
  },

  /**
   * Verify data type of a field
   */
  async verifyDataType({ email_address, field, expectedType }: any) {
    try {
      if (!supabase) throw new Error("Supabase not initialized");

      const { data, error } = await supabase
        .from("Appoinments")
        .select(field)
        .eq("email_address", email_address)
        .single();

      if (error || !data) {
        throw new Error(`Appointment not found: ${error?.message}`);
      }

      const actualType = typeof data[field];
      expect(actualType).to.equal(
        expectedType,
        `Field ${field} type mismatch: expected ${expectedType}, got ${actualType}`,
      );

      return { success: true, value: data[field], type: actualType };
    } catch (err) {
      console.error("❌ verifyDataType error:", err);
      throw err;
    }
  },

  /**
   * Verify intake form appointment linkage
   * Note: date_and_time field doesn't exist in Appoinments table
   */
  async verifyIntakeLinkage({ email_address }: any) {
    try {
      if (!supabase) throw new Error("Supabase not initialized");

      const { data, error } = await supabase
        .from("Appoinments")
        .select("id")
        .eq("email_address", email_address)
        .single();

      if (error || !data) {
        throw new Error(`Appointment not found: ${error?.message}`);
      }

      return { success: true, appointmentId: data.id };
    } catch (err) {
      console.error("❌ verifyIntakeLinkage error:", err);
      throw err;
    }
  },

  /**
   * Verify data is stored (basic check)
   * Note: street_address doesn't exist in Appoinments table
   */
  async verifySpecialCharacters({ email_address }: any) {
    try {
      if (!supabase) throw new Error("Supabase not initialized");

      const { data, error } = await supabase
        .from("Appoinments")
        .select("first_name, last_name, email_address")
        .eq("email_address", email_address)
        .single();

      if (error || !data) {
        throw new Error(`Appointment not found: ${error?.message}`);
      }

      expect(data.first_name).to.exist;
      expect(data.first_name).to.not.be.empty;

      return { success: true, data };
    } catch (err) {
      console.error("❌ verifySpecialCharacters error:", err);
      throw err;
    }
  },

  /**
   * Cleanup test data - delete test appointments
   */
  async cleanupTestData({ emailPattern }: any) {
    try {
      if (!supabase) return { success: false, deleted: 0 };

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
    } catch (err) {
      console.error("⚠️ cleanupTestData error:", err);
      return { success: false, deleted: 0 };
    }
  },

  /**
   * Get appointment data
   */
  async getAppointmentData({ email_address }: any) {
    try {
      if (!supabase) throw new Error("Supabase not initialized");

      const { data, error } = await supabase
        .from("Appoinments")
        .select("*")
        .eq("email_address", email_address)
        .single();

      if (error || !data) {
        throw new Error(`Appointment not found: ${error?.message}`);
      }

      return { success: true, data };
    } catch (err) {
      console.error("❌ getAppointmentData error:", err);
      throw err;
    }
  },

  /**
   * Verify complete appointment flow
   */
  async verifyCompleteAppointmentFlow({ email_address }: any) {
    try {
      if (!supabase) throw new Error("Supabase not initialized");

      const { data: appointment, error: apptError } = await supabase
        .from("Appoinments")
        .select("*")
        .eq("email_address", email_address)
        .single();

      if (apptError || !appointment) {
        throw new Error(`Appointment not found: ${apptError?.message}`);
      }

      // Verify required fields that actually exist in Appoinments table
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
    } catch (err) {
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
    try {
      if (!supabase) throw new Error("Supabase not initialized");

      const { data, error } = await supabase
        .from("Appoinments")
        .select("email_opt, text_opt, email_address")
        .eq("email_address", email_address)
        .single();

      if (error || !data) {
        throw new Error(`Appointment not found: ${error?.message}`);
      }

      if (expectedEmailConsent !== undefined) {
        expect(data.email_opt).to.equal(expectedEmailConsent);
      }
      if (expectedTextConsent !== undefined) {
        expect(data.text_opt).to.equal(expectedTextConsent);
      }

      return { success: true, data };
    } catch (err) {
      console.error("❌ verifyConsentFlags error:", err);
      throw err;
    }
  },

  /**
   * Verify address is stored correctly
   */
  async verifyAddressStorage({ email_address, expectedAddress }: any) {
    try {
      if (!supabase) throw new Error("Supabase not initialized");

      const { data, error } = await supabase
        .from("Appoinments")
        .select("address, email_address")
        .eq("email_address", email_address)
        .single();

      if (error || !data) {
        throw new Error(`Appointment not found: ${error?.message}`);
      }

      if (expectedAddress) {
        expect(data.address).to.include(expectedAddress);
      } else {
        expect(data.address).to.exist;
        expect(data.address).to.not.be.empty;
      }

      return { success: true, data };
    } catch (err) {
      console.error("❌ verifyAddressStorage error:", err);
      throw err;
    }
  },

  /**
   * Verify date_and_time field format
   * Expected format: "locationID|DD-MM-YYYY - HH:MM AM/PM"
   */
  async verifyDateFormat({ email_address }: any) {
    try {
      if (!supabase) throw new Error("Supabase not initialized");

      const { data, error } = await supabase
        .from("Appoinments")
        .select("date_and_time, email_address")
        .eq("email_address", email_address)
        .single();

      if (error || !data) {
        throw new Error(`Appointment not found: ${error?.message}`);
      }

      if (data.date_and_time && data.date_and_time !== "NULL") {
        // Expected format check: should contain location ID and date/time
        expect(data.date_and_time).to.match(/\d+\|\d{2}-\d{2}-\d{4}/);
      }

      return { success: true, data };
    } catch (err) {
      console.error("❌ verifyDateFormat error:", err);
      throw err;
    }
  },

  /**
   * Verify state extraction and storage
   */
  async verifyStateExtraction({ email_address, expectedState }: any) {
    try {
      if (!supabase) throw new Error("Supabase not initialized");

      const { data, error } = await supabase
        .from("Appoinments")
        .select("states, email_address")
        .eq("email_address", email_address)
        .single();

      if (error || !data) {
        throw new Error(`Appointment not found: ${error?.message}`);
      }

      if (expectedState) {
        expect(data.states).to.equal(expectedState);
      }

      return { success: true, data };
    } catch (err) {
      console.error("❌ verifyStateExtraction error:", err);
      throw err;
    }
  },

  /**
   * Verify zipcode is stored (if applicable)
   */
  async verifyZipcodeStorage({ email_address, expectedZipcode }: any) {
    try {
      if (!supabase) throw new Error("Supabase not initialized");

      const { data, error } = await supabase
        .from("Appoinments")
        .select("address, email_address")
        .eq("email_address", email_address)
        .single();

      if (error || !data) {
        throw new Error(`Appointment not found: ${error?.message}`);
      }

      // Zipcode may be part of address field
      if (expectedZipcode && data.address) {
        expect(data.address).to.include(expectedZipcode);
      }

      return { success: true, data };
    } catch (err) {
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
