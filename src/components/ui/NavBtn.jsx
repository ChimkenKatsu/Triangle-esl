import { useState } from "react";
import C from "../../styles/theme";

export default function NavBtn({ children, active, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background:    active ? "rgba(245,166,35,.16)" : h ? "rgba(255,255,255,.08)" : "none",
        border:        "none",
        fontFamily:    "'Nunito',sans-serif",
        fontSize:      13,
        fontWeight:    700,
        color:         active ? C.gold : h ? "#fff" : "rgba(255,255,255,.58)",
        padding:       "8px 12px",
        borderRadius:  9,
        cursor:        "pointer",
        transition:    "all .15s",
        letterSpacing: ".01em",
      }}
    >
      {children}
    </button>
  );
}
