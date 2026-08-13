import { useState } from "react";
import C from "../../styles/theme";
import { FAQS } from "../../data/constants";

export default function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ maxWidth:760, margin:"0 auto" }}>
      {FAQS.map((faq, i) => (
        <div key={i} style={{
          background:   "#fff",
          border:       `2px solid ${open === i ? C.gold : C.border}`,
          borderRadius: 14, marginBottom:10,
          overflow:     "hidden", transition:"border .2s",
        }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width:"100%", background:"none", border:"none",
              padding:"18px 22px",
              display:"flex", justifyContent:"space-between", alignItems:"center",
              cursor:"pointer", fontFamily:"'Nunito',sans-serif",
              fontWeight:700, fontSize:15, color:C.navy, textAlign:"left",
            }}
          >
            <span>{faq.q}</span>
            <span style={{ fontSize:20, color:C.gold, transform: open===i ? "rotate(45deg)" : "rotate(0)", transition:"transform .2s" }}>+</span>
          </button>
          {open === i && (
            <div style={{ padding:"0 22px 18px", fontSize:14, color:C.textSoft, lineHeight:1.78, fontWeight:600 }}>
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
