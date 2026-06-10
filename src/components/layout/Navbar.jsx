import { useState } from "react";
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

  const navigate = (id) => {
    go(id);
    setMenuOpen(false);
  };

  // Detect mobile via window width
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <nav style={{
      background:   C.navy,
      position:     "sticky",
      top:          0,
      zIndex:       200,
      borderBottom: `3px solid ${C.gold}`,
      boxShadow:    "0 4px 28px rgba(14,24,41,.5)",
    }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        padding:  "0 16px",
        display:  "flex", alignItems: "center", height: 62, gap: 2,
      }}>

        {/* ── Logo ── */}
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

        {/* ── Desktop nav links (768px+) ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 2,
          // Hide on mobile using media query via className
        }} className="nav-desktop">
          {NAV_LINKS.map(n => (
            <NavBtn key={n.id} active={page === n.id} onClick={() => navigate(n.id)}>
              {n.label}
            </NavBtn>
          ))}
          <GoldBtn onClick={onDemo} style={{ marginLeft: 10, whiteSpace: "nowrap" }}>
            📋 Free Demo
          </GoldBtn>
        </div>

        {/* ── Mobile controls (below 768px) ── */}
        <div className="nav-mobile" style={{ alignItems:"center", gap:8 }}>
          <button
            onClick={onDemo}
            style={{
              background:   C.gold,
              border:       "none",
              borderRadius: 9,
              padding:      "8px 12px",
              fontFamily:   "'Nunito',sans-serif",
              fontSize:     12,
              fontWeight:   800,
              color:        C.navy,
              cursor:       "pointer",
              whiteSpace:   "nowrap",
            }}
          >
            📋 Free Demo
          </button>
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{
              background:   "rgba(255,255,255,.08)",
              border:       `2px solid rgba(245,166,35,.4)`,
              borderRadius: 9,
              width:        40, height: 40,
              cursor:       "pointer",
              color:        C.gold,
              fontSize:     18,
              display:      "flex", alignItems: "center", justifyContent: "center",
              flexShrink:   0,
            }}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown menu ── */}
      {menuOpen && (
        <div
          className="nav-mobile"
          style={{
            borderTop:     `2px solid rgba(245,166,35,.2)`,
            padding:       "8px 16px 16px",
            flexDirection: "column",
            gap:           4,
            background:    C.navy,
          }}
        >
          {NAV_LINKS.map(n => (
            <button
              key={n.id}
              onClick={() => navigate(n.id)}
              style={{
                background:   page === n.id ? "rgba(245,166,35,.16)" : "none",
                border:       "none",
                borderRadius: 9,
                padding:      "13px 14px",
                textAlign:    "left",
                fontFamily:   "'Nunito',sans-serif",
                fontSize:     15,
                fontWeight:   700,
                color:        page === n.id ? C.gold : "rgba(255,255,255,.85)",
                cursor:       "pointer",
                width:        "100%",
              }}
            >
              {n.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}