import { useState } from "react";

export default function GhostBtn({ children, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background:   h ? "rgba(255,255,255,.16)" : "rgba(255,255,255,.08)",
        color:        "#fff",
        border:       "1.5px solid rgba(255,255,255,.3)",
        padding:      "12px 24px",
        borderRadius: 12,
        fontWeight:   700,
        fontSize:     14,
        cursor:       "pointer",
        fontFamily:   "'Nunito',sans-serif",
        transition:   "all .18s",
      }}
    >
      {children}
    </button>
  );
}
