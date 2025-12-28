// components/VoiceWave.tsx
import React, { useEffect, useRef } from "react"

const BAR_COUNT = 48;
const MIN_HEIGHT = 10;
const MAX_HEIGHT = 60;

function getRandomHeights() {
  return Array.from({ length: BAR_COUNT }, () =>
    Math.floor(Math.random() * (MAX_HEIGHT - MIN_HEIGHT + 1)) + MIN_HEIGHT
  );
}

export default function VoiceWave({ isActive, color = "#00f5ff" }: { isActive: boolean, color?: string }) {
  const [heights, setHeights] = React.useState(() => getRandomHeights());
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setHeights(getRandomHeights());
      }, 120);
    } else {
      setHeights(Array(BAR_COUNT).fill(MIN_HEIGHT));
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  return (
    <div className="wave-container neon">
      <svg width="480" height="80" viewBox="0 0 480 80">
        <defs>
          <filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {heights.map((h, i) => (
          <rect
            key={i}
            x={i * 10}
            y={80 - h}
            width={6}
            height={h}
            rx={3}
            style={{
              fill: color,
              opacity: color === "#ff0033" ? 0.7 : 0.85,
              filter: color === "#ff0033" ? "url(#glow-red)" : "url(#glow-blue)"
            }}
          />
        ))}
      </svg>
    </div>
  )
}
