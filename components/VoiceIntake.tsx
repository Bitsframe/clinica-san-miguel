"use client";


import React, { useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";


type VoiceIntakeProps = {
  setForm: any;
  setOnsetDate?: (date: Date | null) => void;
};


export default function VoiceIntake({ setForm, setOnsetDate }: VoiceIntakeProps): JSX.Element {
  const vapi = useRef<Vapi | null>(null);
  const lastUserTranscript = useRef<string>("");
  const lastToolCallData = useRef<any>(null);
  // Store Q&A pairs: { question: string, answer: string }
  const qaPairs = useRef<{ question: string; answer: string }[]>([]);
  // Track last assistant question
  const lastAssistantQuestion = useRef<string>("");
  const apiKey = process.env.NEXT_PUBLIC_CLINIC_VAPI_PUBLIC_KEY;


  useEffect(() => {
    if (!apiKey) return;
    console.log("🔵 [Clinic] Initializing Vapi…");
    console.log(
      "🔑 [Clinic] API KEY PREFIX:",
      apiKey ? apiKey.slice(0, 5) : "MISSING"
    );
    vapi.current = new Vapi(apiKey);
    console.log("✅ [Clinic] Vapi initialized:", vapi.current);
    // ---- CORE EVENTS ----
    if (vapi.current) {
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
            // ...existing code...
          } catch (err) {
            // ...existing code...
          }
        }
      });
      // Listen for END CALL message from agent and stop Vapi automatically
        // vapi.current.on("message", (msg) => {
        //   if (
        //     msg &&
        //     msg.text &&
        //     typeof msg.text === "string" &&
        //     msg.text.toUpperCase().includes("END CALL")
        //   ) {
        //     console.log("[VAPI MIC] Received END CALL from agent, stopping Vapi...");
        //     vapi.current && vapi.current.stop();
        //   }
        // });
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
    }
    return () => {
      console.log("🧹 [Clinic] Cleaning up Vapi");
      if (vapi.current) vapi.current.stop();
    };
  }, [setForm, apiKey]);


  if (!apiKey) {
    return (
      <div style={{ color: 'red', fontWeight: 600 }}>
        Voice assistant unavailable: API key missing.
      </div>
    );
  }


  const startVoice = async () => {
    console.log("▶️ [Clinic] Start Voice clicked");


    const assistantId = process.env.NEXT_PUBLIC_CLINIC_VAPI_ASSISTANT_ID;


    if (!assistantId) {
      console.error("❌ [Clinic] Assistant ID missing");
      return;
    }


    console.log("[VAPI MIC] startVoice called");
    if (!vapi.current) {
      console.error("❌ [VAPI MIC] Vapi not initialized");
      return;
    }
    if (!assistantId) {
      console.error("❌ [VAPI MIC] Assistant ID missing");
      return;
    }
    try {
      console.log("[VAPI MIC] Calling vapi.current.start with assistantId:", assistantId);
      const result = await vapi.current.start(assistantId);
      console.log("✅ [VAPI MIC] vapi.start() result:", result);
      if (result === null) {
        console.error("❌ [VAPI MIC] CALL CREATION FAILED → key/assistant/org mismatch");
      }
    } catch (err) {
      console.error("🔥 [VAPI MIC] vapi.start() THREW ERROR:", err);
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



