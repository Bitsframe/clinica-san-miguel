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

export default function VoiceWave() {
  return (
    <div
      className="flex justify-center items-center w-full"
      aria-hidden="true"
    >
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
            x={i * (BAR_WIDTH + BAR_GAP)}
            y={(SVG_HEIGHT - h) / 2}   // ✅ center vertically
            width={BAR_WIDTH}
            height={h}
            rx={BAR_WIDTH / 2}        // ✅ pill shape
            fill="#000"
          />
        ))}
      </svg>
    </div>
  );
}
