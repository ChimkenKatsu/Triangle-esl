import { useState } from "react";
import C from "../../styles/theme";

export default function SecBtn({ children, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background:   "#fff",
        color:        h ? C.goldDark : C.navy,
        border:       `2px solid ${h ? C.gold : C.border}`,
        padding:      "11px 22px",
        borderRadius: 11,
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
