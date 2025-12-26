import React from "react";

interface TranscriptDisplayProps {
  currentTranscript: { role: "agent" | "user"; text: string } | null;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ currentTranscript }) => (
  <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
    {currentTranscript ? (
      <div style={{ background: '#fff', borderLeft: '4px solid #C1001F', padding: 8, borderRadius: 6, width: '100%' }}>
        <span style={{ fontWeight: 600, color: '#000' }}>{currentTranscript.role === 'agent' ? 'Agent says:' : 'User says:'}</span>
        <br />
        <span style={{ color: '#000' }}>{currentTranscript.text}</span>
      </div>
    ) : (
      <div style={{ color: '#000' }}>No transcripts yet.</div>
    )}
  </div>
);

export default TranscriptDisplay;
