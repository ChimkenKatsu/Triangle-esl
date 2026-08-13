import { useState } from "react";
import C from "../../styles/theme";
import { GoldBtn } from "../ui";

export default function PricingCard({ pkg: p, onBook, big = false }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background:   "#fff",
        border:       `2.5px solid ${h || p.badge === "POPULAR" ? p.color : C.border}`,
        borderRadius: 20,
        padding:      big ? "28px 24px" : "22px 18px",
        position:     "relative",
        transition:   "all .22s",
        transform:    h ? "translateY(-4px)" : p.badge ? "translateY(-2px)" : "translateY(0)",
        boxShadow:    h
          ? `0 16px 40px rgba(${p.rgb},.22)`
          : p.badge
            ? `0 8px 24px rgba(${p.rgb},.13)`
            : "none",
      }}
    >
      {p.badge && (
        <div style={{
          position:     "absolute", top:-1, left:"50%", transform:"translateX(-50%)",
          background:   p.badge === "POPULAR" ? C.navy : p.color,
          color:        p.badge === "POPULAR" ? C.gold : "#fff",
          fontSize:10, fontWeight:800, padding:"3px 14px",
          borderRadius: "0 0 10px 10px", letterSpacing:".06em", whiteSpace:"nowrap",
        }}>
          {p.badge}
        </div>
      )}
      <div style={{ fontSize: big ? 32 : 26, marginBottom:10, marginTop: p.badge ? 8 : 0 }}>{p.icon}</div>
      <div style={{ fontFamily:"'Baloo 2',cursive", fontSize: big ? 20 : 17, fontWeight:800, color:C.navy, marginBottom:3 }}>{p.label}</div>
      <div style={{ color:C.muted, fontSize:12, fontWeight:600, marginBottom: p.note ? 4 : 14 }}>
        {p.sessions} session{p.sessions > 1 ? "s" : ""}
      </div>
      {p.note && (
        <div style={{
          display:"inline-block", background:"#F0FDF4", border:"1.5px solid #86EFAC",
          borderRadius:100, padding:"3px 10px", fontSize:11, fontWeight:800,
          color:"#166534", marginBottom:10,
        }}>
          🎁 {p.note}
        </div>
      )}
      <div style={{ fontFamily:"'Baloo 2',cursive", fontSize: big ? 34 : 28, fontWeight:900, color:p.color }}>${p.price}</div>
      {p.per && <div style={{ fontSize:12, color:C.muted, fontWeight:600, marginTop:4 }}>{p.per}/class</div>}
      {big && <div style={{ marginTop:18 }}><GoldBtn onClick={onBook} full>Book Now →</GoldBtn></div>}
    </div>
  );
}