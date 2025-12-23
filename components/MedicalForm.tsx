"use client";

import { useState } from "react";
import VoiceIntake from "./VoiceIntake";

export default function MedicalForm() {
  const [form, setForm] = useState({
    chief_complaint: "",
    onsetDate: "",
    location: "",
    severity: "",
    symptoms_description: "",
    relieving_factors: "",
    medical_conditions: "",
    current_medications: "",
    surgeries: "",
    allergies: "",
    family_history: {},
    tobacco_use: false,
    alcohol_use: false,
    drug_use: false,
    occupation: "",
  });

  return (
    <>
      <VoiceIntake setForm={setForm} />

      <input value={form.chief_complaint} readOnly />
      <input value={form.onsetDate} readOnly />
      <input value={form.location} readOnly />
      {/* rest of your form fields */}
    </>
  );
}
