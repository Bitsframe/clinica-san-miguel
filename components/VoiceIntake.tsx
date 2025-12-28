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
    if (instance) {
      instance.on("call-start", () => {
        lastUserTranscript.current = "";
        lastToolCallData.current = null;
        qaPairs.current = [];
        lastAssistantQuestion.current = "";
      });
      instance.on("call-end", async () => {
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
      });
      instance.on("message", (msg: any) => {
        // Log all Vapi message events for debugging
        console.log('[VAPI MESSAGE EVENT]', msg);
        // User speaking detection: show red wave on any user transcript
        if (msg.type === "transcript" && msg.role === "user") {
          if (onUserSpeaking) onUserSpeaking();
        }
        if (onTranscript && msg.type === "transcript" && msg.transcript) {
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



