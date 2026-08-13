import { useState, useEffect } from "react";
import IMG from "../../data/images";
import C from "../../styles/theme";
import { NavBtn, GoldBtn } from "../ui";

const NAV_LINKS = [
  { id: "home",     label: "About"        },
  { id: "teachers", label: "Teachers"     },
  { id: "pricing",  label: "Packages"     },
  { id: "booking",  label: "Book a Class" },
];

export default function Navbar({ page, go, onDemo }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigate = (id) => {
    go(id);
    setMenuOpen(false);
  };

  return (
    <nav style={{
      background:   C.navy,
      position:     "sticky",
      top:          0,
      zIndex:       200,
      borderBottom: `3px solid ${C.gold}`,
      boxShadow:    "0 4px 28px rgba(14,24,41,.5)",
    }}>
      {/* ── Top bar ── */}
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        padding:  "0 16px",
        display:  "flex", alignItems: "center", height: 62, gap: 8,
      }}>

        {/* Logo */}
        <div
          onClick={() => navigate("home")}
          style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", marginRight:"auto", flexShrink:0 }}
        >
          <img
            src={IMG.logo}
            alt="Triangle ESL"
            style={{ width:38, height:38, objectFit:"contain", borderRadius:8, border:"2px solid rgba(245,166,35,.4)" }}
          />
          <div>
            <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:16, fontWeight:900, color:C.gold, lineHeight:1.1, letterSpacing:".02em" }}>
              TRIANGLE ESL
            </div>
            <div style={{ fontSize:8, color:"rgba(255,255,255,.38)", fontWeight:800, letterSpacing:".06em", lineHeight:1 }}>
              LEARN MORE · SPEAK MORE · CONNECT MORE
            </div>
          </div>
        </div>

        {/* Desktop links — only rendered when not mobile */}
        {!isMobile && (
          <div style={{ display:"flex", alignItems:"center", gap:2 }}>
            {NAV_LINKS.map(n => (
              <NavBtn key={n.id} active={page === n.id} onClick={() => navigate(n.id)}>
                {n.label}
              </NavBtn>
            ))}
            <GoldBtn onClick={onDemo} style={{ marginLeft:10, whiteSpace:"nowrap" }}>
              📋 Free Demo
            </GoldBtn>
          </div>
        )}

        {/* Mobile: hamburger button */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{
              background:   menuOpen ? "rgba(245,166,35,.2)" : "rgba(255,255,255,.08)",
              border:       `2px solid rgba(245,166,35,.5)`,
              borderRadius: 9,
              width:        44, height: 44,
              cursor:       "pointer",
              color:        C.gold,
              fontSize:     20,
              display:      "flex", alignItems: "center", justifyContent: "center",
              flexShrink:   0,
              transition:   "background .15s",
            }}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        )}
      </div>

      {/* ── Mobile dropdown — only rendered when open ── */}
      {isMobile && menuOpen && (
        <div style={{
          background:    C.navy,
          borderTop:     `2px solid rgba(245,166,35,.25)`,
          padding:       "10px 16px 20px",
          display:       "flex",
          flexDirection: "column",
          gap:           6,
        }}>
          {NAV_LINKS.map(n => (
            <button
              key={n.id}
              onClick={() => navigate(n.id)}
              style={{
                background:   page === n.id ? "rgba(245,166,35,.18)" : "rgba(255,255,255,.04)",
                border:       page === n.id ? `1.5px solid rgba(245,166,35,.4)` : "1.5px solid rgba(255,255,255,.06)",
                borderRadius: 10,
                padding:      "14px 16px",
                textAlign:    "left",
                fontFamily:   "'Nunito',sans-serif",
                fontSize:     16,
                fontWeight:   700,
                color:        page === n.id ? C.gold : "rgba(255,255,255,.9)",
                cursor:       "pointer",
                width:        "100%",
              }}
            >
              {n.label}
            </button>
          ))}

          {/* Free Demo CTA */}
          <button
            onClick={() => { onDemo(); setMenuOpen(false); }}
            style={{
              background:   C.gold,
              border:       "none",
              borderRadius: 10,
              padding:      "14px 16px",
              textAlign:    "center",
              fontFamily:   "'Nunito',sans-serif",
              fontSize:     16,
              fontWeight:   800,
              color:        C.navy,
              cursor:       "pointer",
              marginTop:    4,
              width:        "100%",
            }}
          >
            📋 Book a Free 10-Min Demo
          </button>
        </div>
      )}
    </nav>
  );
}