"use client";

import { useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";

export default function VoiceIntake({ setForm }: { setForm: any }) {
  const vapi = useRef<any>(null);

  useEffect(() => {
    vapi.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!);

    // 👇 This receives structured medical data
    vapi.current.on("function-call", (call: any) => {
      if (call.name === "updateMedicalIntake") {
        setForm((prev: any) => ({
          ...prev,
          ...mergeSafe(prev, call.arguments),
        }));
      }
    });

    return () => vapi.current?.stop();
  }, []);

  const startVoice = async () => {
    try {
      await vapi.current.start({
        assistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!
      });
    } catch (err) {
      console.error("Vapi start error:", err);
    }
  };

  const stopVoice = () => {
    vapi.current.stop();
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <button
        onClick={startVoice}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: '#C1001F',
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
        onClick={stopVoice}
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
  Object.keys(next).forEach((k) => {
    if (next[k] !== undefined && next[k] !== "") {
      merged[k] = next[k];
    }
  });
  return merged;
}
