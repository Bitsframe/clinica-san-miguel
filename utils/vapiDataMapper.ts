/**
 * VAPI Data Mapper
 * Maps incremental real-time data from VAPI agent to CSAForm autofill structure
 * Handles both full objects and partial/incremental updates
 */

export interface VapiRawData {
  sex?: "Male" | "Female" | "Other";
  email?: string;
  service?: string;
  lastName?: string;
  severity?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";
  allergies?: string[];
  firstName?: string;
  lifestyle?: {
    drugs?: boolean;
    alcohol?: boolean;
    tobacco?: boolean;
  };
  surgeries?: string;
  visitType?: "In-Office" | "Virtual";
  cancerType?: string;
  occupation?: string;
  dateOfBirth?: string; // MM/DD/YYYY
  patientType?: "New" | "Returning";
  phoneNumber?: string;
  familyHistory?: {
    cancer?: boolean;
    unknown?: boolean;
    diabetes?: boolean;
    heartDisease?: boolean;
    hypertension?: boolean;
  };
  reasonForVisit?: string;
  appointmentDate?: string; // MM/DD/YYYY
  appointmentTime?: string; // HH:MM AM/PM
  symptomDuration?: string;
  symptomLocation?: string;
  relievingFactors?: string[];
  medicalConditions?: string[];
  preventiveHistory?: {
    birthControl?: "Yes" | "No" | "Not applicable";
    lastPapSmear?: string; // Never, Don't remember, or MM/YYYY
    lastMammogram?: string; // Never, Don't remember, or MM/YYYY
    lastProstateExam?: string; // Never, Don't remember, or MM/YYYY
    numberOfPregnancies?: number;
  };
  currentMedications?: string[];
  symptomsDescription?: string[];
}

export interface NormalizedFormData {
  // Demographics
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  sex?: string;
  dob?: string; // ISO format or parseable date
  occupation?: string;

  // Schedule
  schedule_date?: string; // MM/DD/YYYY
  schedule_time?: string; // HH:MM AM/PM
  visit_type?: string; // "In-Office" | "Virtual"
  patient_type?: string; // "New" | "Returning"
  service?: string;

  // Chief complaint & symptoms
  chief_complaint?: string;
  location?: string;
  severity?: string | number;
  symptoms_description?: string[];
  symptom_duration?: string;
  relieving_factors?: {
    options?: string[];
    other?: string;
  };

  // Medical history
  medical_conditions?: string[];
  surgeries?: string;
  allergies?: string[];
  current_medications?: string;

  // Lifestyle
  tobacco_use?: boolean;
  alcohol_use?: boolean;
  drug_use?: boolean;

  // Family history
  family_history?: {
    hypertension?: boolean;
    diabetes?: boolean;
    cancer?: boolean;
    heart_disease?: boolean;
    unknown?: boolean;
  };

  // Cancer-specific
  cancer_type?: string;

  // Preventive/Reproductive history
  num_pregnancies?: number | string;
  birth_control?: string;
  pap_smear?: string;
  pap_smear_date?: string;
  mammogram?: string;
  mammogram_date?: string;
  prostate_exam?: string;
  prostate_exam_date?: string;
}

/**
 * Converts VAPI raw data to normalized form data structure
 * Handles incremental updates - only includes fields that are defined
 * @param vapiData - Raw data from VAPI agent (can be partial/incremental)
 * @returns Normalized data ready for CSAForm autofill
 */
export function mapVapiDataToNormalized(vapiData: Partial<VapiRawData>): NormalizedFormData {
  const normalized: NormalizedFormData = {};

  // Demographics mapping
  if (vapiData.firstName !== undefined) {
    normalized.first_name = vapiData.firstName || "";
  }
  if (vapiData.lastName !== undefined) {
    normalized.last_name = vapiData.lastName || "";
  }
  if (vapiData.phoneNumber !== undefined) {
    normalized.phone = vapiData.phoneNumber || "";
  }
  if (vapiData.email !== undefined) {
    normalized.email = vapiData.email || "";
  }
  if (vapiData.sex !== undefined) {
    normalized.sex = vapiData.sex || "";
  }
  if (vapiData.dateOfBirth !== undefined) {
    normalized.dob = convertDateFormat(vapiData.dateOfBirth, "MM/DD/YYYY", "ISO");
  }
  if (vapiData.occupation !== undefined) {
    normalized.occupation = vapiData.occupation || "";
  }

  // Schedule mapping
  if (vapiData.appointmentDate !== undefined) {
    normalized.schedule_date = vapiData.appointmentDate || "";
  }
  if (vapiData.appointmentTime !== undefined) {
    normalized.schedule_time = vapiData.appointmentTime || "";
  }
  if (vapiData.visitType !== undefined) {
    normalized.visit_type = vapiData.visitType || "";
  }
  if (vapiData.patientType !== undefined) {
    normalized.patient_type = vapiData.patientType || "";
  }
  if (vapiData.service !== undefined) {
    normalized.service = vapiData.service || "";
  }

  // Chief complaint & symptoms
  if (vapiData.reasonForVisit !== undefined) {
    normalized.chief_complaint = vapiData.reasonForVisit || "";
  }
  if (vapiData.symptomLocation !== undefined) {
    normalized.location = vapiData.symptomLocation || "";
  }
  if (vapiData.severity !== undefined) {
    normalized.severity = vapiData.severity || "";
  }
  if (vapiData.symptomsDescription !== undefined) {
    normalized.symptoms_description = Array.isArray(vapiData.symptomsDescription)
      ? vapiData.symptomsDescription.filter(Boolean)
      : vapiData.symptomsDescription
      ? [vapiData.symptomsDescription]
      : [];
  }
  if (vapiData.symptomDuration !== undefined) {
    normalized.symptom_duration = vapiData.symptomDuration || "";
  }
  if (vapiData.relievingFactors !== undefined) {
    normalized.relieving_factors = {
      options: Array.isArray(vapiData.relievingFactors)
        ? vapiData.relievingFactors.filter(Boolean)
        : vapiData.relievingFactors
        ? [vapiData.relievingFactors]
        : [],
    };
  }

  // Medical history
  if (vapiData.medicalConditions !== undefined) {
    normalized.medical_conditions = Array.isArray(vapiData.medicalConditions)
      ? vapiData.medicalConditions.filter(Boolean)
      : vapiData.medicalConditions
      ? [vapiData.medicalConditions]
      : [];
  }
  if (vapiData.surgeries !== undefined) {
    normalized.surgeries = vapiData.surgeries || "";
  }
  if (vapiData.allergies !== undefined) {
    normalized.allergies = Array.isArray(vapiData.allergies)
      ? vapiData.allergies.filter(Boolean)
      : vapiData.allergies
      ? [vapiData.allergies]
      : [];
  }
  if (vapiData.currentMedications !== undefined) {
    normalized.current_medications =
      Array.isArray(vapiData.currentMedications)
        ? vapiData.currentMedications.filter(Boolean).join(", ")
        : vapiData.currentMedications || "";
  }

  // Lifestyle
  if (vapiData.lifestyle?.tobacco !== undefined) {
    normalized.tobacco_use = vapiData.lifestyle.tobacco;
  }
  if (vapiData.lifestyle?.alcohol !== undefined) {
    normalized.alcohol_use = vapiData.lifestyle.alcohol;
  }
  if (vapiData.lifestyle?.drugs !== undefined) {
    normalized.drug_use = vapiData.lifestyle.drugs;
  }

  // Family history
  if (vapiData.familyHistory !== undefined) {
    normalized.family_history = {
      hypertension: vapiData.familyHistory.hypertension ?? false,
      diabetes: vapiData.familyHistory.diabetes ?? false,
      cancer: vapiData.familyHistory.cancer ?? false,
      heart_disease: vapiData.familyHistory.heartDisease ?? false,
      unknown: vapiData.familyHistory.unknown ?? false,
    };
  }

  // Cancer-specific
  if (vapiData.cancerType !== undefined) {
    normalized.cancer_type = vapiData.cancerType || "";
  }

  // Preventive/Reproductive history
  if (vapiData.preventiveHistory?.numberOfPregnancies !== undefined) {
    normalized.num_pregnancies = vapiData.preventiveHistory.numberOfPregnancies;
  }
  if (vapiData.preventiveHistory?.birthControl !== undefined) {
    normalized.birth_control = vapiData.preventiveHistory.birthControl || "";
  }
  if (vapiData.preventiveHistory?.lastPapSmear !== undefined) {
    normalized.pap_smear = vapiData.preventiveHistory.lastPapSmear || "";
  }
  if (vapiData.preventiveHistory?.lastMammogram !== undefined) {
    normalized.mammogram = vapiData.preventiveHistory.lastMammogram || "";
  }
  if (vapiData.preventiveHistory?.lastProstateExam !== undefined) {
    normalized.prostate_exam = vapiData.preventiveHistory.lastProstateExam || "";
  }

  return normalized;
}

/**
 * Merges incremental updates into existing normalized data
 * Useful for real-time data streaming from VAPI agent
 * @param existing - Previously normalized data
 * @param newVapiData - New incremental VAPI data to merge
 * @returns Merged normalized data
 */
export function mergeIncrementalVapiData(
  existing: NormalizedFormData,
  newVapiData: Partial<VapiRawData>
): NormalizedFormData {
  const newNormalized = mapVapiDataToNormalized(newVapiData);
  return { ...existing, ...newNormalized };
}

/**
 * Converts date between different formats
 * Supports MM/DD/YYYY, ISO (YYYY-MM-DD), and JavaScript Date parsing
 * @param dateString - Date string to convert
 * @param fromFormat - Source format ("MM/DD/YYYY" or "ISO")
 * @param toFormat - Target format ("MM/DD/YYYY" or "ISO")
 * @returns Formatted date string
 */
export function convertDateFormat(
  dateString: string | undefined,
  fromFormat: "MM/DD/YYYY" | "ISO",
  toFormat: "MM/DD/YYYY" | "ISO"
): string | undefined {
  if (!dateString) return undefined;

  let date: Date;

  if (fromFormat === "MM/DD/YYYY") {
    const [month, day, year] = dateString.split("/");
    date = new Date(`${year}-${month}-${day}`);
  } else {
    date = new Date(dateString);
  }

  if (isNaN(date.getTime())) return undefined;

  if (toFormat === "MM/DD/YYYY") {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  } else {
    return date.toISOString().split("T")[0];
  }
}

/**
 * Validates VAPI data for required fields
 * @param vapiData - Data to validate
 * @returns Object with validation results
 */
export function validateVapiData(vapiData: Partial<VapiRawData>): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check critical fields
  if (!vapiData.firstName) warnings.push("First name not provided");
  if (!vapiData.lastName) warnings.push("Last name not provided");
  if (!vapiData.phoneNumber) warnings.push("Phone number not provided");
  if (!vapiData.email) warnings.push("Email not provided");

  // Check date formats
  if (
    vapiData.dateOfBirth &&
    !isValidDateFormat(vapiData.dateOfBirth, "MM/DD/YYYY")
  ) {
    errors.push(
      "Invalid dateOfBirth format. Expected MM/DD/YYYY"
    );
  }
  if (
    vapiData.appointmentDate &&
    !isValidDateFormat(vapiData.appointmentDate, "MM/DD/YYYY")
  ) {
    errors.push(
      "Invalid appointmentDate format. Expected MM/DD/YYYY"
    );
  }

  // Check enum values
  if (
    vapiData.sex &&
    !["Male", "Female", "Other"].includes(vapiData.sex)
  ) {
    errors.push("Invalid sex value. Must be Male, Female, or Other");
  }
  if (
    vapiData.visitType &&
    !["In-Office", "Virtual"].includes(vapiData.visitType)
  ) {
    errors.push(
      "Invalid visitType. Must be In-Office or Virtual"
    );
  }
  if (
    vapiData.patientType &&
    !["New", "Returning"].includes(vapiData.patientType)
  ) {
    errors.push("Invalid patientType. Must be New or Returning");
  }
  if (vapiData.severity && !isValidSeverity(vapiData.severity)) {
    errors.push(
      "Invalid severity. Must be a number 1-10"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Checks if string matches MM/DD/YYYY format
 */
function isValidDateFormat(dateString: string, format: string): boolean {
  if (format === "MM/DD/YYYY") {
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    return regex.test(dateString);
  }
  return false;
}

/**
 * Checks if severity is valid (1-10)
 */
function isValidSeverity(severity: string): boolean {
  const num = parseInt(severity, 10);
  return !isNaN(num) && num >= 1 && num <= 10;
}

/**
 * Extracts only defined fields from VAPI data
 * Useful for debugging and logging which fields were updated
 * @param vapiData - VAPI data to extract from
 * @returns Object with only defined fields
 */
export function getDefinedFields(vapiData: Partial<VapiRawData>): Partial<VapiRawData> {
  const defined: Partial<VapiRawData> = {};
  
  (Object.keys(vapiData) as Array<keyof VapiRawData>).forEach((key) => {
    if (vapiData[key] !== undefined) {
      (defined as any)[key] = vapiData[key];
    }
  });

  return defined;
}
