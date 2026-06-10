import { useRef } from "react";

/** Decorative floating coloured dots for dark backgrounds */
export default function FloatDots({ count = 14 }) {
  const dots = useRef(
    Array.from({ length: count }, (_, i) => ({
      x:     Math.random() * 100,
      y:     Math.random() * 100,
      size:  5 + Math.random() * 12,
      color: ["#F5A623","#3ABFB1","#F06292","#7C3AED","#FFD166","#06D6A0"][i % 6],
      dur:   6 + Math.random() * 7,
      delay: Math.random() * 5,
    }))
  ).current;

  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
      {dots.map((d, i) => (
        <div
          key={i}
          style={{
            position:   "absolute",
            left:       `${d.x}%`,
            top:        `${d.y}%`,
            width:      d.size,
            height:     d.size,
            borderRadius: "50%",
            background: d.color,
            opacity:    0.14,
            animation:  `floatDot ${d.dur}s ${d.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}
