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
    if (externalVapi) {
      vapi.current = externalVapi;
    } else {
      if (!apiKey) return;
      localVapi = new Vapi(apiKey);
      vapi.current = localVapi;
    }
    const instance = vapi.current;
    // ---- CORE EVENTS ----
    // Prevent multiple API calls on call-end
    const callEndHandledRef = { current: false };
    // Handler for call-end
    const handleCallEnd = async () => {
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
          // Auto-end call if assistant says intake is complete (final transcript)
          if (
            msg.role === "assistant" &&
            msg.transcriptType === "final" &&
            msg.transcript.trim() === "Thank you. Your intake is complete."
          ) {
            stopVoice();
            return;
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
  }, [setForm, apiKey, externalVapi, onTranscript]);


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

  // Optionally, listen for call-end to reset button state
  React.useEffect(() => {
    if (!vapi.current) return;
    const instance = vapi.current;
    const handleCallEnd = () => setIsVoiceActive(false);
    instance.on && instance.on('call-end', handleCallEnd);
    return () => {
      instance.off && instance.off('call-end', handleCallEnd);
    };
  }, []);

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <button
        onClick={handleToggleVoice}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: isVoiceActive ? '#e53e3e' : '#2563eb',
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
        {isVoiceActive ? (
          <><span role="img" aria-label="stop">🛑</span> Stop</>
        ) : (
          <><span role="img" aria-label="mic">🎤</span> Start Voice Intake</>
        )}
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



