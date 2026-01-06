"use client";


import React, { useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";
import { useTranslations } from "next-intl";



type VoiceIntakeProps = {
  setForm: any;
  setOnsetDate?: (date: Date | null) => void;
  onTranscript?: (event: { role?: string, transcript?: string, transcriptType?: string }) => void;
  vapi?: any; // shared Vapi instance
  onUserSpeaking?: () => void;
};


export default function VoiceIntake({ setForm, setOnsetDate, onTranscript, vapi: externalVapi, onUserSpeaking }: VoiceIntakeProps): JSX.Element {
  const t = useTranslations("appoinment_form");
  // Use provided vapi instance if available, else create our own
  const vapi = useRef<any>(null);
  const apiKey = process.env.NEXT_PUBLIC_CLINIC_VAPI_PUBLIC_KEY;

  // Track aggregated tool payloads and last normalized snapshot for single call-end logging
  const mergedToolPayloadRef = useRef<Record<string, any>>({});
  const lastToolPayloadRef = useRef<any>(null);
  const lastNormalizedRef = useRef<any>(null);
  const conversationRef = useRef<Array<{role: string; content: string; timestamp: number}>>([]);
  const normalizeTriggeredRef = useRef<boolean>(false);

  // Track voice state for toggle button
  const [isVoiceActive, setIsVoiceActive] = React.useState(false);

  // Map Vapi tool payload to the normalized shape expected by the CSA form
  const mapToolPayloadToNormalized = (data: any) => {
    const normalized: any = {};

    // Only set fields that are present to avoid wiping previous values
    if (data?.firstName !== undefined) normalized.first_name = data.firstName;
    if (data?.lastName !== undefined) normalized.last_name = data.lastName;
    if (data?.email !== undefined) normalized.email = data.email;
    if (data?.streetAddress !== undefined) normalized.street_address = data.streetAddress;
    if (data?.phoneNumber !== undefined) normalized.phone = data.phoneNumber;
    if (data?.sex !== undefined) normalized.sex = data.sex;
    if (data?.severity !== undefined) normalized.severity = data.severity;
    if (data?.service !== undefined) normalized.service = data.service;
    if (data?.visitType !== undefined) normalized.visit_type = data.visitType;
    if (data?.patientType !== undefined) normalized.patient_type = data.patientType;


    if (data?.symptomsDescription !== undefined) {
      normalized.symptoms_description = Array.isArray(data.symptomsDescription)
        ? data.symptomsDescription
        : [data.symptomsDescription].filter(Boolean);
    }

    // Normalize relieving factors to match checkbox labels (case-insensitive)
    if (data?.relievingFactors !== undefined) {
      const mapReliefOption = (val: string) => {
        const key = (val || '').trim().toLowerCase();
        const lookup: Record<string, string> = {
          rest: 'Rest',
          ice: 'Ice',
          heat: 'Heat',
          elevation: 'Elevation',
          medication: 'Medication',
          stretching: 'Stretching',
          massage: 'Massage',
          'support or compression': 'Support or compression',
          support: 'Support or compression',
          compression: 'Support or compression',
          time: 'Time',
          other: 'Other',
        };
        return lookup[key] || (val ? val.charAt(0).toUpperCase() + val.slice(1) : '');
      };

      const options = Array.isArray(data.relievingFactors)
        ? data.relievingFactors.map(mapReliefOption).filter(Boolean)
        : [mapReliefOption(String(data.relievingFactors))].filter(Boolean);

      normalized.relieving_factors = {
        options,
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
    
    if (data?.appointmentDate !== undefined) {
      // Convert MM/DD/YYYY to YYYY-MM-DD for date input
      let date = data.appointmentDate;
      if (date && date.includes('/')) {
        const [month, day, year] = date.split('/');
        date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      normalized.schedule_date = date;
    }
    
    if (data?.appointmentTime !== undefined) {
      // Normalize time format: "3 PM" -> "3:00 PM", "03:30 PM" stays as is
      let time = data.appointmentTime;
      if (time && !time.includes(':')) {
        // Add :00 if no colon present (e.g., "3 PM" -> "3:00 PM")
        time = time.replace(/(\d+)\s*(AM|PM)/i, '$1:00 $2');
      }
      normalized.schedule_time = time;
    }
    if (data?.reasonForVisit !== undefined) normalized.chief_complaint = data.reasonForVisit;
    if (data?.symptomLocation !== undefined) {
      normalized.location = data.symptomLocation;
      // console.log('[DEBUG] Mapping symptomLocation:', data.symptomLocation, '→ location:', normalized.location);
    }
    if (data?.symptomDuration !== undefined) normalized.onset_date = data.symptomDuration;

    // Preventive history
    if (data?.preventiveHistory !== undefined) {
      const ph = data.preventiveHistory;
      if (ph?.birthControl !== undefined) normalized.birth_control = ph.birthControl;
      
      // Pap Smear: check if it's a choice or a date
      if (ph?.lastPapSmear !== undefined) {
        const papValue = ph.lastPapSmear;
        if (papValue === 'Never' || papValue === "Don't remember") {
          normalized.pap_smear = papValue;
        } else {
          // It's a date in MM/YYYY format
          normalized.pap_smear = 'Month & Year';
          normalized.pap_smear_date = papValue;
        }
      }
      
      // Mammogram: check if it's a choice or a date
      if (ph?.lastMammogram !== undefined) {
        const mammoValue = ph.lastMammogram;
        if (mammoValue === 'Never' || mammoValue === "Don't remember") {
          normalized.mammogram = mammoValue;
        } else {
          normalized.mammogram = 'Month & Year';
          normalized.mammogram_date = mammoValue;
        }
      }
      
      // Prostate Exam: check if it's a choice or a date
      if (ph?.lastProstateExam !== undefined) {
        const prostateValue = ph.lastProstateExam;
        if (prostateValue === 'Never' || prostateValue === "Don't remember") {
          normalized.prostate_exam = prostateValue;
        } else {
          normalized.prostate_exam = 'Month & Year';
          normalized.prostate_exam_date = prostateValue;
        }
      }
      if (ph?.numberOfPregnancies !== undefined) normalized.num_pregnancies = ph.numberOfPregnancies;
    }

    return normalized;
  };

  // Helper to stop voice programmatically
  const stopVoice = () => {
    // console.log("⏹ [Clinic] Stop Voice clicked");
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

      console.log(`[TOOL CALL: ${toolName}]`, {
        toolId: toolCall?.id,
        toolName,
        arguments: parsedArgs,
      });

      if (toolName === 'updateMedicalIntake') {
        // Merge incremental payloads for a single summary at call-end
        mergedToolPayloadRef.current = {
          ...(mergedToolPayloadRef.current || {}),
          ...(parsedArgs || {}),
        };
        lastToolPayloadRef.current = parsedArgs;

        console.log('[MERGED TOOL PAYLOAD]', mergedToolPayloadRef.current);

        // Use the existing __autofillCSA with the merged data
        if (typeof window !== 'undefined' && typeof (window as any).__autofillCSA === 'function') {
          const normalized = mapToolPayloadToNormalized(mergedToolPayloadRef.current);
          lastNormalizedRef.current = normalized;
          console.log('[NORMALIZED DATA]', normalized);
          (window as any).__autofillCSA(normalized);
        } else {
          console.error('[VoiceIntake] __autofillCSA not found on window!');
        }
      }
    };
    if (instance) {
      instance.on("call-start", () => {
        console.log('[VAPI] Call started');
        // Reset on call start
        mergedToolPayloadRef.current = {};
        lastToolPayloadRef.current = null;
        lastNormalizedRef.current = null;
        conversationRef.current = [];
        normalizeTriggeredRef.current = false;
      });
      instance.on("call-end", () => {
        console.log('[VAPI] Call ended');
        if (normalizeTriggeredRef.current) {
          console.log('[VAPI] Normalize already triggered, skipping');
          return; // Prevent multiple normalize calls for the same call
        }
        normalizeTriggeredRef.current = true;

        setIsVoiceActive(false); // Always reset button to blue on call end
        // Single consolidated log to inspect Vapi return data
        console.log('================================');
        console.log('[VAPI CALL-END SUMMARY]');
        console.log('Raw Merged Payload:', mergedToolPayloadRef.current);
        console.log('Last Tool Payload:', lastToolPayloadRef.current);
        console.log('Normalized Snapshot:', lastNormalizedRef.current);
        console.log('Conversation History:', conversationRef.current);
        console.log('================================');

        // Trigger normalize-csa with onset/service on call end
        (async () => {
          try {
            const res = await fetch('/api/normalize-csa', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                normalizedSnapshot: lastNormalizedRef.current,
                rawMergedPayload: mergedToolPayloadRef.current,
              }),
            });
            if (res.ok) {
              const data = await res.json();
           
              const normalized = data?.normalized;
              if (normalized && typeof window !== 'undefined' && typeof (window as any).__autofillCSA === 'function') {
                // Use normalized response to autofill (service, onset_date, etc.)
                (window as any).__autofillCSA(normalized);
              }
            } else {
              console.error('[VoiceIntake] normalize-csa non-200', res.status);
            }
          } catch (err) {
            console.error('[VoiceIntake] normalize-csa call failed', err);
          }
        })();
      });
      // Direct tool-call events (when Vapi surfaces tools outside of message payload)
      instance.on("tool-call", handleToolCall);
      instance.on("error", (error: any) => {
        console.error('[VAPI ERROR]', error);
      });
      instance.on("speech-start", () => {
        console.log('[VAPI] User speech started');
      });
      instance.on("speech-end", () => {
        console.log('[VAPI] User speech ended');
      });
      instance.on("message", (msg: any) => {
        console.log('[VAPI MESSAGE]', msg.type, msg);
        // Capture clean conversation turns from Vapi's LLM messages
        if (msg.type === "message" && msg.role && msg.content) {
          conversationRef.current.push({
            role: msg.role,
            content: msg.content,
            timestamp: Date.now(),
          });
        }
        
        // Log any structured output from Vapi
        if (msg.type === "structured_output") {
     
        }
        
        // Log tool/function call results (updateMedicalIntake output)
        if (msg.type === "tool-calls" || msg.type === "function-call") {
          // console.log('[VAPI TOOL CALL MESSAGE]', msg.type);
          
          // Extract tool calls
          if (msg.toolCalls) {
            msg.toolCalls.forEach(handleToolCall);
          }
        }
        
        // Log function call results
        if (msg.functionCall) {
          // console.log('[VAPI FUNCTION CALL DATA]', {
          //   name: msg.functionCall.name,
          //   parameters: msg.functionCall.parameters
          // });
        }
        // User speaking detection: show red wave on any user transcript
        if (msg.type === "transcript" && msg.role === "user") {
          if (onUserSpeaking) onUserSpeaking();
        }
        if (onTranscript && msg.type === "transcript" && msg.transcript) {
          // Debug log for auto-end
          // console.log("[VAPI AUTO-END CHECK]", msg.transcript, msg.transcriptType);
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
      // console.log('Start Voice Intake button clicked');
      await startVoice();
      setIsVoiceActive(true);
    } else {
      // console.log('Stop Voice Intake button clicked');
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
            ? 'linear-gradient(90deg, #DC143C 0%, #B91C1C 100%)'
            : 'linear-gradient(90deg, #DC143C 0%, #B91C1C 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: '999px',
          padding: '0.9rem 2.5rem',
          fontWeight: 600,
          fontSize: '1.25rem',
          cursor: 'pointer',
          boxShadow: '0 2px 8px 0 rgba(220,20,60,0.10)',
          outline: 'none',
          transition: 'background 0.2s',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" style={{ marginRight: '0.5rem' }}>
            <path d="M12 17a4 4 0 0 0 4-4v-5a4 4 0 0 0-8 0v5a4 4 0 0 0 4 4zm5-4v-1h2v1a7 7 0 0 1-14 0v-1h2v1a5 5 0 0 0 10 0zm-5 6h2v2h-2v-2z" fill="#fff"/>
          </svg>
          {isVoiceActive ? t('voice_intake_listening') : t('voice_intake_button')}
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



