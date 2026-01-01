// components/VoiceWave.tsx
import React from "react";

// Compact, UI-matched waveform
const BAR_HEIGHTS = [
  6, 12, 18, 26, 18, 12, 6,
  8, 16, 22, 30, 22, 16, 8,
  10, 20, 34, 40, 34, 20, 10,
  8, 16, 22, 30, 22, 16, 8,
  6, 12, 18, 26, 18, 12, 6
];

const BAR_WIDTH = 4;
const BAR_GAP = 6;
const SVG_HEIGHT = 48;
const SVG_WIDTH = BAR_HEIGHTS.length * (BAR_WIDTH + BAR_GAP);

interface VoiceWaveProps {
  isActive?: boolean;
  color?: string;
}

export default function VoiceWave({ isActive = true, color = "#000" }: VoiceWaveProps) {
  return (
    <div
      className="flex justify-center items-center w-full"
      aria-hidden="true"
      style={{
        opacity: isActive ? 1 : 0,
        visibility: isActive ? 'visible' : 'hidden',
        transition: 'opacity 0.3s ease, visibility 0.3s ease',
      }}
    >
      <style>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1.2); }
        }
        .voice-bar {
          animation: ${isActive ? 'wave 0.6s ease-in-out infinite' : 'none'};
          transform-origin: center;
        }
      `}</style>
      <svg
        width="100%"
        height={SVG_HEIGHT}
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        style={{
          maxWidth: "300px",
          minWidth: "180px",
          height: "auto",
          display: "block",
        }}
      >
        {BAR_HEIGHTS.map((h, i) => (
          <rect
            key={i}
            className="voice-bar"
            x={i * (BAR_WIDTH + BAR_GAP)}
            y={(SVG_HEIGHT - h) / 2}
            width={BAR_WIDTH}
            height={h}
            rx={BAR_WIDTH / 2}
            fill={color}
            style={{
              animationDelay: isActive ? `${i * 0.05}s` : '0s',
            }}
          />
        ))}
      </svg>
    </div>
  );
}
