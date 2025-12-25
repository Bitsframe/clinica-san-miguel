"use client";

import { useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";

type VoiceIntakeProps = {
  setForm: any;
  setOnsetDate?: (date: Date | null) => void;
};

export default function VoiceIntake({ setForm, setOnsetDate }: VoiceIntakeProps) {
  const vapi = useRef<Vapi | null>(null);
  const lastUserTranscript = useRef<string>("");
  const lastToolCallData = useRef<any>(null);
  // Store Q&A pairs: { question: string, answer: string }
  const qaPairs = useRef<{ question: string; answer: string }[]>([]);
  // Track last assistant question
  const lastAssistantQuestion = useRef<string>("");

  useEffect(() => {
    console.log("🔵 [Clinic] Initializing Vapi…");

    const apiKey = process.env.NEXT_PUBLIC_CLINIC_VAPI_PUBLIC_KEY;

    console.log(
      "🔑 [Clinic] API KEY PREFIX:",
      apiKey ? apiKey.slice(0, 5) : "MISSING"
    );

    if (!apiKey) {
      console.error("❌ [Clinic] API key missing");
      return;
    }

    vapi.current = new Vapi(apiKey);

    console.log("✅ [Clinic] Vapi initialized:", vapi.current);

    // ---- CORE EVENTS ----


    vapi.current.on("call-start", () => {
      console.log("📞 [Clinic] CALL STARTED");
      lastUserTranscript.current = "";
      lastToolCallData.current = null;
      qaPairs.current = [];
      lastAssistantQuestion.current = "";
    });

    vapi.current.on("call-end", async () => {
      console.log("📴 [Clinic] CALL ENDED");
      // On call end, log Q&A pairs and prepare for OpenAI normalization
      console.log("[Vapi Q&A] Assistant questions and user answers:", qaPairs.current);
      // If Q&A pairs exist, call the normalization API
      if (qaPairs.current.length > 0) {
        try {
          const res = await fetch("/api/normalize-csa", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ qaPairs: qaPairs.current }),
          });
          const data = await res.json();
          if (data.normalized) {
            console.log("[OpenAI Normalized CSA]", data.normalized);
            // Set onset date if present and valid
            if (data.normalized.onset_date && typeof data.normalized.onset_date === "string" && !isNaN(Date.parse(data.normalized.onset_date))) {
              if (typeof setOnsetDate === "function") {
                setOnsetDate(new Date(data.normalized.onset_date));
              }
            }
            setForm((prev: any) => {
              let next = { ...prev, ...mergeSafe(prev, data.normalized) };
              // If allergies_choice is Yes, set allergyChoice to Yes and set allergies array
              if (data.normalized.allergies_choice === "Yes") {
                if (typeof next.allergies === "undefined" || !Array.isArray(next.allergies)) next.allergies = [];
                next.allergyChoice = "Yes";
                next.allergies = data.normalized.allergies || [];
              } else if (data.normalized.allergies_choice === "No") {
                next.allergyChoice = "No";
                next.allergies = [];
              }
              // If surgeries_choice is Yes or No, set surgeryChoice and surgeries field
              if (data.normalized.surgeries_choice === "Yes") {
                next.surgeryChoice = "Yes";
                next.surgeries = data.normalized.surgeries || "";
              } else if (data.normalized.surgeries_choice === "No") {
                next.surgeryChoice = "No";
                next.surgeries = "";
              }
              return next;
            });
            return;
          } else {
            console.error("[OpenAI Normalization Error]", data.error, data.raw);
          }
        } catch (err) {
          console.error("[OpenAI Normalization Exception]", err);
        }
      }
      // Fallback: autofill CSA form fields with last tool-call data if available
      if (lastToolCallData.current) {
        console.log("[Vapi Autofill] Adding to CSA form (tool-call):", lastToolCallData.current);
        setForm((prev: any) => ({
          ...prev,
          ...mergeSafe(prev, lastToolCallData.current),
        }));
      } else if (lastUserTranscript.current) {
        const autofillData = {
          chief_complaint: lastUserTranscript.current,
        };
        console.log("[Vapi Autofill] Adding to CSA form (transcript):", autofillData);
        setForm((prev: any) => ({
          ...prev,
          ...autofillData,
        }));
      }
    });

    vapi.current.on("message", (msg) => {
      console.log("💬 [Clinic] MESSAGE EVENT:", msg);
      // Store the last user transcript
      if (msg.type === "transcript" && msg.role === "user" && msg.transcriptType === "final") {
        lastUserTranscript.current = msg.transcript;
        // Store Q&A pair if last assistant question exists
        if (lastAssistantQuestion.current && msg.transcript) {
          qaPairs.current.push({
            question: lastAssistantQuestion.current,
            answer: msg.transcript,
          });
        }
      }
      // Track last assistant question
      if (msg.type === "transcript" && msg.role === "assistant" && msg.transcriptType === "final" && msg.transcript) {
        lastAssistantQuestion.current = msg.transcript;
      }
      // Removed auto-stop call logic. Call will be ended manually using the stop button.
    });

    vapi.current.on("error", (err) => {
      console.error("🔥 [Clinic] VAPI EVENT ERROR:", err);
    });

    // ---- TOOL CALL ----
    // NOTE: The 'function-call' event is not recognized by the current VapiEventNames type.
    // If the SDK updates to support this event, re-enable the handler below.
    // vapi.current.on("function-call", (call: any) => {
    //   console.log("🛠 [Clinic] FUNCTION CALL RECEIVED:", call);
    //   if (call.name === "updateMedicalIntake") {
    //     console.log("[Vapi Tool-Call] Data received:", call.arguments);
    //     lastToolCallData.current = call.arguments;
    //     setForm((prev: any) => ({
    //       ...prev,
    //       ...mergeSafe(prev, call.arguments),
    //     }));
    //   }
    // });

    return () => {
      console.log("🧹 [Clinic] Cleaning up Vapi");
      vapi.current?.stop();
    };
  }, [setForm]);

  const startVoice = async () => {
    console.log("▶️ [Clinic] Start Voice clicked");

    const assistantId = process.env.NEXT_PUBLIC_CLINIC_VAPI_ASSISTANT_ID;

    if (!assistantId) {
      console.error("❌ [Clinic] Assistant ID missing");
      return;
    }

    if (!vapi.current) {
      console.error("❌ [Clinic] Vapi not initialized");
      return;
    }
    if (!assistantId) {
      console.error("❌ [Clinic] Assistant ID missing");
      return;
    }
    try {
      const result = await vapi.current.start(assistantId);
      console.log("✅ [Clinic] vapi.start() result:", result);
      if (result === null) {
        console.error("❌ [Clinic] CALL CREATION FAILED → key/assistant/org mismatch");
      }
    } catch (err) {
      console.error("🔥 [Clinic] vapi.start() THREW ERROR:", err);
    }
  };

  const stopVoice = () => {
    console.log("⏹ [Clinic] Stop Voice clicked");
    vapi.current?.stop();
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <button
        onClick={() => { console.log('Start Voice Intake button clicked'); startVoice(); }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: '#2563eb', // blue-600
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '0.5rem 1rem',
          fontWeight: 600,
          fontSize: '1rem',
          cursor: 'pointer',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
        }}
      >
        <span role="img" aria-label="mic">🎤</span> Start Voice Intake
      </button>
      <button
        onClick={() => { console.log('Stop Voice Intake button clicked'); stopVoice(); }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: '#e53e3e',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '0.5rem 1rem',
          fontWeight: 600,
          fontSize: '1rem',
          cursor: 'pointer',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
        }}
      >
        <span role="img" aria-label="stop">🛑</span> Stop
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
