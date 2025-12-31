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
  const lastUserTranscript = useRef<string>("");
  const lastToolCallData = useRef<any>(null);
  // Store Q&A pairs: { question: string, answer: string }
  const qaPairs = useRef<{ question: string; answer: string }[]>([]);
  // Track last assistant question
  const lastAssistantQuestion = useRef<string>("");
  const apiKey = process.env.NEXT_PUBLIC_CLINIC_VAPI_PUBLIC_KEY;

  // Track voice state for toggle button
  const [isVoiceActive, setIsVoiceActive] = React.useState(false);

  // Helper to stop voice programmatically
  const stopVoice = () => {
    console.log("⏹ [Clinic] Stop Voice clicked");
    vapi.current?.stop();
    setIsVoiceActive(false); // Always reset button to blue
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
    // ---- CORE EVENTS ----
    // Prevent multiple API calls on call-end
    const callEndHandledRef = { current: false };
    // Handler for call-end
    const handleCallEnd = async () => {
      setIsVoiceActive(false); // Always reset button to blue on call end
      if (callEndHandledRef.current) return;
      callEndHandledRef.current = true;
      if (qaPairs.current.length > 0) {
        try {
          const res = await fetch("/api/normalize-csa", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ qaPairs: qaPairs.current }),
          });
          const resBody = await res.text();
          try {
            const parsed = JSON.parse(resBody);
            console.log('[NORMALIZE-CSA RESPONSE]', parsed);
            if (parsed && parsed.normalized && typeof window !== 'undefined' && typeof (window as any).__autofillCSA === 'function') {
              (window as any).__autofillCSA(parsed.normalized);
            }
          } catch (e) {}
        } catch (err) {}
      }
    };
    if (instance) {
      instance.on("call-start", () => {
        lastUserTranscript.current = "";
        lastToolCallData.current = null;
        qaPairs.current = [];
        lastAssistantQuestion.current = "";
        callEndHandledRef.current = false; // Reset for new call
      });
      instance.on("call-end", handleCallEnd);
      instance.on("message", (msg: any) => {
        // Log all Vapi message events for debugging
        console.log('[VAPI MESSAGE EVENT]', msg);
        // Log any structured output from Vapi
        if (msg.type === "structured_output") {
          console.log('[VAPI STRUCTURED OUTPUT]', msg);
        }
        // User speaking detection: show red wave on any user transcript
        if (msg.type === "transcript" && msg.role === "user") {
          if (onUserSpeaking) onUserSpeaking();
        }
        if (onTranscript && msg.type === "transcript" && msg.transcript) {
          // Debug log for auto-end
          console.log("[VAPI AUTO-END CHECK]", msg.transcript, msg.transcriptType);
          // Auto-end call if assistant says intake is complete (final transcript, robust check)
          if (
            msg.role === "assistant" &&
            msg.transcriptType === "final"
          ) {
            // Normalize transcript: lowercase, trim, remove punctuation and extra spaces
            const normalized = msg.transcript
              .toLowerCase()
              .replace(/[.!?]/g, "")
              .replace(/\s+/g, " ")
              .trim();
            if (
              normalized === "your intake is complete" ||
              normalized === "your intake is now complete" ||
              normalized === " intake has been completed" ||
              normalized === " your intake process is complete"
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
        if (msg.type === "transcript" && msg.role === "user" && msg.transcriptType === "final") {
          lastUserTranscript.current = msg.transcript;
          if (lastAssistantQuestion.current && msg.transcript) {
            qaPairs.current.push({
              question: lastAssistantQuestion.current,
              answer: msg.transcript,
            });
          }
        }
        if (msg.type === "transcript" && msg.role === "assistant" && msg.transcriptType === "final" && msg.transcript) {
          lastAssistantQuestion.current = msg.transcript;
        }
      });
      instance.on("error", (err: any) => {});
    }
    return () => {
      if (instance) {
        instance.off && instance.off("call-end", handleCallEnd);
      }
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



