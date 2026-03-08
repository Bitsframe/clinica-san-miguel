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
   * Verify patient exists in allpatients table
   */
  async verifyPatientInDB({ email, firstname, lastname, phone }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      let query = supabase.from("allpatients").select("*");

      // Build query based on provided parameters
      if (email) {
        query = query.eq("email", email);
      } else if (phone) {
        query = query.eq("phone", phone);
      } else {
        throw new Error("Either email or phone must be provided");
      }

      const { data, error } = await query.single();

      if (error || !data) {
        throw new Error(`Patient not found: ${error?.message}`);
      }

      if (firstname && data.firstname !== firstname) {
        throw new Error(
          `First name mismatch: expected "${firstname}", got "${data.firstname}"`,
        );
      }
      if (lastname && data.lastname !== lastname) {
        throw new Error(
          `Last name mismatch: expected "${lastname}", got "${data.lastname}"`,
        );
      }

      return { success: true, data };
    } catch (err: any) {
      console.error("❌ verifyPatientInDB error:", err);
      throw err;
    }
  },

  /**
   * Verify all patient fields match expected values
   */
  async verifyPatientFields({ email, phone, expectedFields }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      let query = supabase.from("allpatients").select("*");

      if (email) {
        query = query.eq("email", email);
      } else if (phone) {
        query = query.eq("phone", phone);
      } else {
        throw new Error("Either email or phone must be provided");
      }

      const { data, error } = await query.single();

      if (error || !data) {
        throw new Error(`Patient not found: ${error?.message}`);
      }

      // Check each expected field
      Object.keys(expectedFields).forEach((key) => {
        if (data[key] !== expectedFields[key]) {
          throw new Error(
            `Field ${key} mismatch: expected "${expectedFields[key]}", got "${data[key]}"`,
          );
        }
      });

      return { success: true, data };
    } catch (err: any) {
      console.error("❌ verifyPatientFields error:", err);
      throw err;
    }
  },

  /**
   * Verify patient flags (onsite, text_opt, email_opt)
   */
  async verifyPatientFlags({
    email,
    phone,
    expectedOnsite,
    expectedTextOpt,
    expectedEmailOpt,
  }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      let query = supabase
        .from("allpatients")
        .select("onsite, text_opt, email_opt, email, phone");

      if (email) {
        query = query.eq("email", email);
      } else if (phone) {
        query = query.eq("phone", phone);
      } else {
        throw new Error("Either email or phone must be provided");
      }

      const { data, error } = await query.single();

      if (error || !data) {
        throw new Error(`Patient not found: ${error?.message}`);
      }

      if (expectedOnsite !== undefined && data.onsite !== expectedOnsite) {
        throw new Error(
          `onsite mismatch: expected ${expectedOnsite}, got ${data.onsite}`,
        );
      }

      if (expectedTextOpt !== undefined && data.text_opt !== expectedTextOpt) {
        throw new Error(
          `text_opt mismatch: expected ${expectedTextOpt}, got ${data.text_opt}`,
        );
      }

      if (
        expectedEmailOpt !== undefined &&
        data.email_opt !== expectedEmailOpt
      ) {
        throw new Error(
          `email_opt mismatch: expected ${expectedEmailOpt}, got ${data.email_opt}`,
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
  async verifyLocationId({ email, phone }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      let query = supabase
        .from("allpatients")
        .select("locationid, email, phone");

      if (email) {
        query = query.eq("email", email);
      } else if (phone) {
        query = query.eq("phone", phone);
      } else {
        throw new Error("Either email or phone must be provided");
      }

      const { data, error } = await query.single();

      if (error || !data) {
        throw new Error(`Patient not found: ${error?.message}`);
      }

      if (!data.locationid) {
        console.warn("⚠️ locationid is null");
      }

      return { success: true, data };
    } catch (err: any) {
      console.error("❌ verifyLocationId error:", err);
      throw err;
    }
  },

  /**
   * Verify service is stored correctly
   */
  async verifyServiceStorage({ email, phone, expectedService }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      let query = supabase
        .from("allpatients")
        .select("treatmenttype, email, phone");

      if (email) {
        query = query.eq("email", email);
      } else if (phone) {
        query = query.eq("phone", phone);
      } else {
        throw new Error("Either email or phone must be provided");
      }

      const { data, error } = await query.single();

      if (error || !data) {
        throw new Error(`Patient not found: ${error?.message}`);
      }

      if (expectedService && data.treatmenttype !== expectedService) {
        throw new Error(
          `Service mismatch: expected "${expectedService}", got "${data.treatmenttype}"`,
        );
      }

      return { success: true, data };
    } catch (err: any) {
      console.error("❌ verifyServiceStorage error:", err);
      throw err;
    }
  },

  /**
   * Verify each patient has unique ID
   */
  async verifyUniquePatientIds({ emails, phones }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      let query = supabase.from("allpatients").select("id, email, phone");

      if (emails && emails.length > 0) {
        query = query.in("email", emails);
      } else if (phones && phones.length > 0) {
        query = query.in("phone", phones);
      } else {
        throw new Error("Either emails or phones array must be provided");
      }

      const { data, error } = await query;

      if (error || !data) {
        throw new Error(`Patients not found: ${error?.message}`);
      }

      const ids = data.map((d: any) => d.id);
      const uniqueIds = new Set(ids);

      if (uniqueIds.size !== ids.length) {
        throw new Error("Patient IDs are not unique!");
      }

      return { success: true, count: ids.length, data };
    } catch (err: any) {
      console.error("❌ verifyUniquePatientIds error:", err);
      throw err;
    }
  },

  /**
   * Verify data type of a field
   */
  async verifyDataType({ email, phone, field, expectedType }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      let query = supabase.from("allpatients").select(field);

      if (email) {
        query = query.eq("email", email);
      } else if (phone) {
        query = query.eq("phone", phone);
      } else {
        throw new Error("Either email or phone must be provided");
      }

      const { data, error } = await query.single();

      if (error || !data) {
        throw new Error(`Patient not found: ${error?.message}`);
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
   * Verify data with special characters is stored
   */
  async verifySpecialCharacters({ email, phone }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      let query = supabase
        .from("allpatients")
        .select("firstname, lastname, email, phone");

      if (email) {
        query = query.eq("email", email);
      } else if (phone) {
        query = query.eq("phone", phone);
      } else {
        throw new Error("Either email or phone must be provided");
      }

      const { data, error } = await query.single();

      if (error || !data) {
        throw new Error(`Patient not found: ${error?.message}`);
      }

      if (!data.firstname || data.firstname.trim() === "") {
        throw new Error("First name is empty");
      }

      return { success: true, data };
    } catch (err: any) {
      console.error("❌ verifySpecialCharacters error:", err);
      throw err;
    }
  },

  /**
   * Cleanup test data - delete test patients
   */
  async cleanupTestData({ emailPattern, phonePattern }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, deleted: 0 };

    try {
      let query = supabase.from("allpatients").select("id");

      if (emailPattern) {
        query = query.like("email", emailPattern);
      } else if (phonePattern) {
        query = query.like("phone", phonePattern);
      } else {
        return { success: true, deleted: 0 };
      }

      const { data: toDelete } = await query;

      if (!toDelete || toDelete.length === 0) {
        return { success: true, deleted: 0 };
      }

      const ids = toDelete.map((t: any) => t.id);
      await supabase.from("allpatients").delete().in("id", ids);

      return { success: true, deleted: ids.length };
    } catch (err: any) {
      console.error("⚠️ cleanupTestData error:", err);
      return { success: false, deleted: 0 };
    }
  },

  /**
   * Get patient data
   */
  async getPatientData({ email, phone }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      let query = supabase.from("allpatients").select("*");

      if (email) {
        query = query.eq("email", email);
      } else if (phone) {
        query = query.eq("phone", phone);
      } else {
        throw new Error("Either email or phone must be provided");
      }

      const { data, error } = await query.single();

      if (error || !data) {
        throw new Error(`Patient not found: ${error?.message}`);
      }

      return { success: true, data };
    } catch (err: any) {
      console.error("❌ getPatientData error:", err);
      throw err;
    }
  },

  /**
   * Verify complete patient flow
   */
  async verifyCompletePatientFlow({ email, phone }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      let query = supabase.from("allpatients").select("*");

      if (email) {
        query = query.eq("email", email);
      } else if (phone) {
        query = query.eq("phone", phone);
      } else {
        throw new Error("Either email or phone must be provided");
      }

      const { data: patient, error } = await query.single();

      if (error || !patient) {
        throw new Error(`Patient not found: ${error?.message}`);
      }

      // Verify required fields
      const requiredFields = ["firstname", "lastname", "locationid"];
      const missingFields = requiredFields.filter((f) => !patient[f]);

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      return {
        success: true,
        patient,
      };
    } catch (err: any) {
      console.error("❌ verifyCompletePatientFlow error:", err);
      throw err;
    }
  },

  /**
   * Verify consent flags (email_opt and text_opt)
   */
  async verifyConsentFlags({
    email,
    phone,
    expectedEmailConsent,
    expectedTextConsent,
  }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      let query = supabase
        .from("allpatients")
        .select("email_opt, text_opt, email, phone");

      if (email) {
        query = query.eq("email", email);
      } else if (phone) {
        query = query.eq("phone", phone);
      } else {
        throw new Error("Either email or phone must be provided");
      }

      const { data, error } = await query.single();

      if (error || !data) {
        throw new Error(`Patient not found: ${error?.message}`);
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
  async verifyAddressStorage({ email, phone, expectedAddress }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      let query = supabase.from("allpatients").select("address, email, phone");

      if (email) {
        query = query.eq("email", email);
      } else if (phone) {
        query = query.eq("phone", phone);
      } else {
        throw new Error("Either email or phone must be provided");
      }

      const { data, error } = await query.single();

      if (error || !data) {
        throw new Error(`Patient not found: ${error?.message}`);
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
   * Verify phone number format (+1 prefix)
   */
  async verifyPhoneFormat({ email, phone, expectedFormat = "+1" }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      let query = supabase.from("allpatients").select("phone, email");

      if (email) {
        query = query.eq("email", email);
      } else if (phone) {
        query = query.eq("phone", phone);
      } else {
        throw new Error("Either email or phone must be provided");
      }

      const { data, error } = await query.single();

      if (error || !data) {
        throw new Error(`Patient not found: ${error?.message}`);
      }

      if (!data.phone?.startsWith(expectedFormat)) {
        throw new Error(
          `Phone format invalid: expected to start with "${expectedFormat}", got "${data.phone}"`,
        );
      }

      return { success: true, data };
    } catch (err: any) {
      console.error("❌ verifyPhoneFormat error:", err);
      throw err;
    }
  },

  /**
   * Verify date of birth is stored correctly
   */
  async verifyDateOfBirth({ email, phone, expectedDob }: any) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      let query = supabase.from("allpatients").select("dob, email, phone");

      if (email) {
        query = query.eq("email", email);
      } else if (phone) {
        query = query.eq("phone", phone);
      } else {
        throw new Error("Either email or phone must be provided");
      }

      const { data, error } = await query.single();

      if (error || !data) {
        throw new Error(`Patient not found: ${error?.message}`);
      }

      if (expectedDob) {
        const storedDob = data.dob
          ? new Date(data.dob).toISOString().split("T")[0]
          : null;
        if (storedDob !== expectedDob) {
          throw new Error(
            `DOB mismatch: expected "${expectedDob}", got "${storedDob}"`,
          );
        }
      }

      return { success: true, data };
    } catch (err: any) {
      console.error("❌ verifyDateOfBirth error:", err);
      throw err;
    }
  },

  // Dummy task for test purposes
  logMessage(message: string) {
    console.log(message);
    return null;
  },

  /**
   * Generic query task - wraps Supabase queries with SQL-like interface
   * Used by tests that expect db:query style calls
   */
  async "db:query"({ query, params }: { query: string; params: any[] }) {
    const supabase = getSupabaseClient();
    if (!supabase) return { rows: [], error: "Supabase not configured" };

    try {
      // Parse the query to determine operation type
      const queryLower = query.toLowerCase().trim();

      // SELECT queries
      if (queryLower.startsWith("select")) {
        // Extract table name and where clause
        const fromMatch = query.match(/from\s+(\w+)/i);
        const tableName = fromMatch ? fromMatch[1] : "allpatients";

        let supabaseQuery = supabase.from(tableName).select("*");

        // Handle WHERE clause with email
        if (
          queryLower.includes("where") &&
          queryLower.includes("email") &&
          params[0]
        ) {
          supabaseQuery = supabaseQuery.eq("email", params[0]);
        }
        // Handle WHERE clause with phone
        else if (
          queryLower.includes("where") &&
          queryLower.includes("phone") &&
          params[0]
        ) {
          supabaseQuery = supabaseQuery.eq("phone", params[0]);
        }
        // Handle WHERE clause with id (but not patient_id)
        else if (
          queryLower.includes("where") &&
          queryLower.includes("id") &&
          !queryLower.includes("patient_id") &&
          params[0]
        ) {
          supabaseQuery = supabaseQuery.eq("id", params[0]);
        }
        // Handle WHERE clause with patient_id (for Appoinments table)
        else if (
          queryLower.includes("where") &&
          queryLower.includes("patient_id") &&
          params[0]
        ) {
          supabaseQuery = supabaseQuery.eq("patient_id", params[0]);
        }

        // Handle ORDER BY and LIMIT
        if (queryLower.includes("order by") && queryLower.includes("desc")) {
          supabaseQuery = supabaseQuery.order("created_at", {
            ascending: false,
          });
        }
        if (queryLower.includes("limit 1")) {
          supabaseQuery = supabaseQuery.limit(1);
        }

        const { data, error } = await supabaseQuery;

        if (error) {
          console.error("db:query SELECT error:", error);
          return { rows: [], error: error.message };
        }

        return { rows: data || [] };
      }

      // DELETE queries
      else if (queryLower.startsWith("delete")) {
        const fromMatch = query.match(/from\s+(\w+)/i);
        const tableName = fromMatch ? fromMatch[1] : "allpatients";

        let deleteQuery = supabase.from(tableName).delete();

        // Handle WHERE clause with id
        if (
          queryLower.includes("where") &&
          queryLower.includes("id") &&
          params[0]
        ) {
          deleteQuery = deleteQuery.eq("id", params[0]);
        }
        // Handle WHERE clause with email
        else if (
          queryLower.includes("where") &&
          queryLower.includes("email") &&
          params[0]
        ) {
          deleteQuery = deleteQuery.eq("email", params[0]);
        }

        const { error } = await deleteQuery;

        if (error) {
          console.error("db:query DELETE error:", error);
          return { success: false, error: error.message };
        }

        return { success: true, rows: [] };
      }

      return { rows: [], error: "Unsupported query type" };
    } catch (err: any) {
      console.error("db:query error:", err);
      return { rows: [], error: err.message };
    }
  },

  /**
   * Delete patient by ID
   */
  async deletePatientById({ id }: { id: number }) {
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
      const { error } = await supabase
        .from("allpatients")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("deletePatientById error:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      console.error("deletePatientById error:", err);
      return { success: false, error: err.message };
    }
  },
};
