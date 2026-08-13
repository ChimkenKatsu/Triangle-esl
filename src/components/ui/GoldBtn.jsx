import { useState } from "react";
import C from "../../styles/theme";

export default function GoldBtn({ children, onClick, full = false, large = false, style: st = {}, disabled = false }) {
  const [h, setH] = useState(false);
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background:    disabled ? "#ccc" : h ? C.goldHover : `linear-gradient(135deg,${C.gold},#EFA020)`,
        color:         disabled ? "#888" : C.navy,
        border:        "none",
        padding:       large ? "15px 36px" : "12px 26px",
        borderRadius:  12,
        fontWeight:    800,
        fontSize:      large ? 16 : 14,
        cursor:        disabled ? "not-allowed" : "pointer",
        fontFamily:    "'Nunito',sans-serif",
        display:       "inline-flex",
        alignItems:    "center",
        justifyContent: full ? "center" : "flex-start",
        gap:           6,
        boxShadow:     disabled ? "none" : h ? "0 8px 26px rgba(245,166,35,.55)" : "0 4px 16px rgba(245,166,35,.38)",
        transform:     (!disabled && h) ? "translateY(-2px)" : "translateY(0)",
        transition:    "all .18s",
        width:         full ? "100%" : "auto",
        letterSpacing: ".01em",
        ...st,
      }}
    >
      {children}
    </button>
  );
}
