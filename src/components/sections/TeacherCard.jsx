import { useState } from "react";
import IMG from "../../data/images";
import C from "../../styles/theme";
import { GoldBtn } from "../ui";

export default function TeacherCard({ t, onBook }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:   "#fff",
        border:       `2.5px solid ${hov ? t.accent : C.border}`,
        borderRadius: 24,
        overflow:     "hidden",
        marginBottom: 24,
        boxShadow:    hov ? `0 18px 52px rgba(${t.accentRgb},.2)` : "0 4px 20px rgba(14,24,41,.06)",
        transition:   "all .22s",
      }}
    >
      <div style={{ display:"flex", flexWrap:"wrap" }}>

        {/* ── Sidebar ── */}
        <div style={{
          background: `linear-gradient(160deg,${C.navy} 0%,${C.navyMid} 100%)`,
          padding:    "36px 26px",
          flex:       "0 0 230px",
          display:    "flex", flexDirection:"column", alignItems:"center", textAlign:"center", gap:14,
        }}>
          <div style={{ position:"relative" }}>
            <img
              src={IMG[t.img]}
              alt={t.name}
              style={{
                width:116, height:116, borderRadius:"50%", objectFit:"cover",
                border:     `4px solid ${t.accent}`,
                boxShadow:  `0 0 0 4px rgba(${t.accentRgb},.2), 0 10px 28px rgba(0,0,0,.35)`,
              }}
            />
            {/* Online indicator */}
            <div style={{ position:"absolute", bottom:6, right:2, width:20, height:20, borderRadius:"50%", background:"#22C55E", border:"3px solid #fff" }} />
          </div>

          <div>
            <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:19, fontWeight:800, color:t.accent, lineHeight:1.1 }}>{t.name}</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,.42)", fontWeight:600, marginTop:4 }}>{t.role}</div>
          </div>

          <div style={{ display:"flex", flexWrap:"wrap", gap:5, justifyContent:"center" }}>
            {t.specs.map(sp => (
              <span key={sp} style={{
                background: `rgba(${t.accentRgb},.15)`,
                color:      t.accent,
                fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:100,
                border:     `1px solid rgba(${t.accentRgb},.3)`,
              }}>
                {sp}
              </span>
            ))}
          </div>

          <GoldBtn onClick={() => onBook(t.name)} full style={{ marginTop:4 }}>
            Book {t.name.split(" ")[1]} →
          </GoldBtn>
        </div>

        {/* ── Body ── */}
        <div style={{ flex:1, padding:"28px 26px", minWidth:260 }}>
          {[
            {
              label: "About",
              content: <p style={{ fontSize:14, color:C.textSoft, lineHeight:1.82, fontWeight:600 }}>{t.bio}</p>,
            },
            {
              label: "Certifications",
              content: (
                <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                  {t.certs.map(c => (
                    <span key={c} style={{ background:C.tealLight, color:"#0B7A70", fontSize:12, fontWeight:700, padding:"4px 12px", borderRadius:100, border:"1px solid #B2EDE6" }}>
                      ✓ {c}
                    </span>
                  ))}
                </div>
              ),
            },
            {
              label: "What Students Say",
              content: (
                <div>
                  {t.testimonials.map((tm, i) => (
                    <div key={i} style={{ background:C.goldPale, borderLeft:`3px solid ${t.accent}`, borderRadius:"0 12px 12px 0", padding:"12px 16px", marginBottom:10 }}>
                      <p style={{ fontSize:13, color:C.textSoft, lineHeight:1.72, fontStyle:"italic", fontWeight:600, marginBottom:5 }}>"{tm.text}"</p>
                      <div style={{ fontSize:12, fontWeight:800, color:t.accent }}>— {tm.author}</div>
                    </div>
                  ))}
                </div>
              ),
            },
          ].map(({ label, content }) => (
            <div key={label} style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:".09em", color:C.goldDark, marginBottom:8 }}>{label}</div>
              {content}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
