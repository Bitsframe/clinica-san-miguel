"use client";


import React, { useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";



type VoiceIntakeProps = {
  setForm: any;
  setOnsetDate?: (date: Date | null) => void;
  onTranscript?: (event: { role?: string, transcript?: string, transcriptType?: string }) => void;
  vapi?: any; // shared Vapi instance
  onUserSpeaking?: () => void;
};


export default function VoiceIntake({ setForm, setOnsetDate, onTranscript, vapi: externalVapi, onUserSpeaking }: VoiceIntakeProps): JSX.Element {
  // Use provided vapi instance if available, else create our own
  const vapi = useRef<any>(null);
  const apiKey = process.env.NEXT_PUBLIC_CLINIC_VAPI_PUBLIC_KEY;

  // Track voice state for toggle button
  const [isVoiceActive, setIsVoiceActive] = React.useState(false);

  // Map Vapi tool payload to the normalized shape expected by the CSA form
  const mapToolPayloadToNormalized = (data: any) => {
    const normalized: any = {};

    // Only set fields that are present to avoid wiping previous values
    if (data?.firstName !== undefined) normalized.first_name = data.firstName;
    if (data?.lastName !== undefined) normalized.last_name = data.lastName;
    if (data?.phoneNumber !== undefined) normalized.phone = data.phoneNumber;
    if (data?.sex !== undefined) normalized.sex = data.sex;
    if (data?.severity !== undefined) normalized.severity = data.severity;

    if (data?.symptomsDescription !== undefined) {
      normalized.symptoms_description = Array.isArray(data.symptomsDescription)
        ? data.symptomsDescription
        : [data.symptomsDescription].filter(Boolean);
    }

    if (data?.relievingFactors !== undefined) {
      normalized.relieving_factors = {
        options: Array.isArray(data.relievingFactors) ? data.relievingFactors : [],
        other: "",
      };
    }

    if (data?.medicalConditions !== undefined) {
      normalized.medical_conditions = Array.isArray(data.medicalConditions)
        ? data.medicalConditions
        : [data.medicalConditions].filter(Boolean);
    }

    if (data?.allergies !== undefined) {
      normalized.allergies = Array.isArray(data.allergies) ? data.allergies : [data.allergies].filter(Boolean);
    }

    if (data?.surgeries !== undefined) normalized.surgeries = data.surgeries;
    if (data?.cancerType !== undefined) normalized.cancer_type = data.cancerType;
    if (data?.occupation !== undefined) normalized.occupation = data.occupation;

    if (data?.currentMedications !== undefined) {
      normalized.current_medications = Array.isArray(data.currentMedications)
        ? data.currentMedications.join(", ")
        : data.currentMedications;
    }

    if (data?.familyHistory !== undefined) {
      normalized.family_history = {
        hypertension: !!data.familyHistory?.hypertension,
        diabetes: !!data.familyHistory?.diabetes,
        cancer: !!data.familyHistory?.cancer,
        heart_disease: !!data.familyHistory?.heartDisease,
        unknown: !!data.familyHistory?.unknown,
      };
    }

    if (data?.lifestyle !== undefined) {
      normalized.tobacco_use = data.lifestyle?.tobacco ?? undefined;
      normalized.alcohol_use = data.lifestyle?.alcohol ?? undefined;
      normalized.drug_use = data.lifestyle?.drugs ?? undefined;
    }

    if (data?.dateOfBirth !== undefined) normalized.dob = data.dateOfBirth;
    if (data?.appointmentDate !== undefined) normalized.schedule_date = data.appointmentDate;
    if (data?.appointmentTime !== undefined) normalized.schedule_time = data.appointmentTime;
    if (data?.reasonForVisit !== undefined) normalized.chief_complaint = data.reasonForVisit;
    if (data?.symptomLocation !== undefined) normalized.location = data.symptomLocation;
    if (data?.symptomDuration !== undefined) normalized.onset_date = data.symptomDuration;

    // Preventive history
    if (data?.preventiveHistory !== undefined) {
      const ph = data.preventiveHistory;
      if (ph?.birthControl !== undefined) normalized.birth_control = ph.birthControl;
      if (ph?.lastPapSmear !== undefined) normalized.pap_smear_date = ph.lastPapSmear;
      if (ph?.lastMammogram !== undefined) normalized.mammogram_date = ph.lastMammogram;
      if (ph?.lastProstateExam !== undefined) normalized.prostate_exam_date = ph.lastProstateExam;
      if (ph?.numberOfPregnancies !== undefined) normalized.num_pregnancies = ph.numberOfPregnancies;
    }

    return normalized;
  };

  // Helper to stop voice programmatically
  const stopVoice = () => {
    console.log("⏹ [Clinic] Stop Voice clicked");
    vapi.current?.stop();
    setIsVoiceActive(false); // Always reset button to blue
    // Force emit call-end to reset speaking states
    if (vapi.current) {
      try {
        vapi.current.emit("message", { type: "call-end" });
      } catch (e) {}
    }
  };



  useEffect(() => {
    let localVapi: any = null;
    if (!apiKey) {
      return () => {};
    }
    if (externalVapi) {
      vapi.current = externalVapi;
    } else {
      localVapi = new Vapi(apiKey);
      vapi.current = localVapi;
    }
    const instance = vapi.current;
    // Handler for tool calls (works for both message.toolCalls and direct tool-call events)
    const handleToolCall = (toolCall: any) => {
      const toolName = toolCall?.function?.name || toolCall?.name;
      const args = toolCall?.function?.arguments || toolCall?.arguments;
      const parsedArgs = typeof args === 'string' ? JSON.parse(args) : args;

      console.log(`[TOOL: ${toolName}]`, {
        toolId: toolCall?.id,
        toolName,
        arguments: parsedArgs,
      });

      if (toolName === 'updateMedicalIntake') {
        console.log('[MEDICAL INTAKE DATA - AUTOFILLING]', parsedArgs);
        const normalized = mapToolPayloadToNormalized(parsedArgs);
        if (typeof window !== 'undefined' && typeof (window as any).__autofillCSA === 'function') {
          (window as any).__autofillCSA(normalized);
        }
      }
    };
    if (instance) {
      instance.on("call-start", () => {
        // Reset on call start
      });
      instance.on("call-end", () => {
        setIsVoiceActive(false); // Always reset button to blue on call end
      });
      // Direct tool-call events (when Vapi surfaces tools outside of message payload)
      instance.on("tool-call", handleToolCall);
      instance.on("message", (msg: any) => {
        // Log all Vapi message events for debugging
        console.log('[VAPI MESSAGE EVENT]', msg);
        
        // Log any structured output from Vapi
        if (msg.type === "structured_output") {
          console.log('[VAPI STRUCTURED OUTPUT]', msg);
        }
        
        // Log tool/function call results (updateMedicalIntake output)
        if (msg.type === "tool-calls" || msg.type === "function-call") {
          console.log('[VAPI TOOL CALL MESSAGE]', msg.type);
          
          // Extract tool calls
          if (msg.toolCalls) {
            msg.toolCalls.forEach(handleToolCall);
          }
        }
        
        // Log function call results
        if (msg.functionCall) {
          console.log('[VAPI FUNCTION CALL DATA]', {
            name: msg.functionCall.name,
            parameters: msg.functionCall.parameters
          });
        }
        // User speaking detection: show red wave on any user transcript
        if (msg.type === "transcript" && msg.role === "user") {
          if (onUserSpeaking) onUserSpeaking();
        }
        if (onTranscript && msg.type === "transcript" && msg.transcript) {
          // Debug log for auto-end
          console.log("[VAPI AUTO-END CHECK]", msg.transcript, msg.transcriptType);
          // Auto-end call if assistant says intake is complete (final or interim, substring match)
          if (msg.role === "assistant") {
            const normalized = msg.transcript
              .toLowerCase()
              .replace(/[.!?]/g, " ")
              .replace(/\s+/g, " ")
              .trim();
            if (
              normalized.includes("intake is complete") ||
              normalized.includes("intake process is complete") ||
              normalized.includes("intake has been completed")
            ) {
              stopVoice();
              return;
            }
          }
          // Check for END CALL phrase (case-insensitive, exact match, no extra text)
          if (msg.transcript.trim().toUpperCase() === "END CALL") {
            stopVoice();
            return; // Do not pass "END CALL" to transcript display or TTS
          }
          onTranscript({
            role: msg.role === "assistant" ? "agent" : msg.role,
            transcript: msg.transcript,
            transcriptType: msg.transcriptType,
          });
        }
      });
      instance.on("error", (err: any) => {});
    }
    return () => {
      if (!externalVapi && localVapi) localVapi.stop();
    };
  }, [setForm, apiKey, externalVapi, onTranscript, onUserSpeaking]);


  if (!apiKey) {
    return (
      <div style={{ color: 'red', fontWeight: 600 }}>
        Voice assistant unavailable: API key missing.
      </div>
    );
  }



  const startVoice = async () => {
    const assistantId = process.env.NEXT_PUBLIC_CLINIC_VAPI_ASSISTANT_ID;
    if (!assistantId) return;
    if (!vapi.current) return;
    try {
      await vapi.current.start(assistantId);
    } catch (err) {}
  };







  const handleToggleVoice = async () => {
    if (!isVoiceActive) {
      console.log('Start Voice Intake button clicked');
      await startVoice();
      setIsVoiceActive(true);
    } else {
      console.log('Stop Voice Intake button clicked');
      stopVoice();
      setIsVoiceActive(false);
    }
  };


  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <button
        onClick={handleToggleVoice}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: isVoiceActive
            ? 'linear-gradient(90deg, #ff7a00 0%, #ff3c00 100%)'
            : 'linear-gradient(90deg, #ff7a00 0%, #ff3c00 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: '999px',
          padding: '0.9rem 2.5rem',
          fontWeight: 600,
          fontSize: '1.25rem',
          cursor: 'pointer',
          boxShadow: '0 2px 8px 0 rgba(255,122,0,0.10)',
          outline: 'none',
          transition: 'background 0.2s',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" style={{ marginRight: '0.5rem' }}>
            <path d="M12 17a4 4 0 0 0 4-4v-5a4 4 0 0 0-8 0v5a4 4 0 0 0 4 4zm5-4v-1h2v1a7 7 0 0 1-14 0v-1h2v1a5 5 0 0 0 10 0zm-5 6h2v2h-2v-2z" fill="#fff"/>
          </svg>
          {isVoiceActive ? 'Listening...' : 'Start Voice Intake'}
        </span>
      </button>
    </div>
  );
}


function mergeSafe(prev: any, next: any) {
  const merged = { ...prev };
  Object.keys(next || {}).forEach((k) => {
    if (next[k] !== undefined && next[k] !== "") {
      merged[k] = next[k];
    }
  });
  return merged;
}



