import IMG from "../../data/images";
import C from "../../styles/theme";
import { Eyebrow, GoldBtn, GhostBtn } from "../ui";

const ORBIT_ITEMS = [
  { emoji:"📚", r:160, start:0,   dur:18, size:38 },
  { emoji:"✏️",  r:160, start:90,  dur:18, size:34 },
  { emoji:"🌟", r:160, start:180, dur:18, size:36 },
  { emoji:"💬", r:160, start:270, dur:18, size:38 },
  { emoji:"🎓", r:110, start:45,  dur:12, size:32 },
  { emoji:"🗣️", r:110, start:225, dur:12, size:32 },
];

const SPARKLES = [
  { top:10,   left:-20,  size:18, delay:"0s",   dur:"2.4s" },
  { top:40,   right:-24, size:14, delay:"0.7s", dur:"2.1s" },
  { top:-10,  right:30,  size:22, delay:"1.4s", dur:"2.8s" },
  { bottom:30, left:10,  size:16, delay:"0.3s", dur:"2.2s" },
  { bottom:10, right:0,  size:12, delay:"1.8s", dur:"1.9s" },
];

export default function MascotHero({ onDemo, onTeachers }) {
  return (
    <div style={{
      position:   "relative",
      textAlign:  "center",
      padding:    "clamp(40px,8vw,80px) 20px clamp(32px,6vw,60px)",
      overflow:   "hidden",
      background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(245,166,35,.13) 0%, transparent 70%)",
    }}>

      {/* ── Orbit rings ── */}
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
        <div style={{ width:"min(420px,90vw)", height:"min(420px,90vw)", borderRadius:"50%", border:"1.5px dashed rgba(245,166,35,.18)", animation:"orbitSpin 22s linear infinite" }} />
        <div style={{ position:"absolute", width:"min(290px,65vw)", height:"min(290px,65vw)", borderRadius:"50%", border:"1.5px dashed rgba(58,191,177,.18)", animation:"orbitSpin 14s linear infinite reverse" }} />
        <div style={{ position:"absolute", width:"min(180px,40vw)", height:"min(180px,40vw)", borderRadius:"50%", border:"1.5px dashed rgba(240,98,146,.18)", animation:"orbitSpin 9s linear infinite" }} />
      </div>

      {/* ── Orbiting emoji badges ── */}
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
        {ORBIT_ITEMS.map((o, i) => (
          <div key={i} style={{ position:"absolute", animation:`orbitItem${i} ${o.dur}s linear infinite` }}>
            <style>{`
              @keyframes orbitItem${i} {
                from { transform: rotate(${o.start}deg) translateX(${o.r}px) rotate(-${o.start}deg); }
                to   { transform: rotate(${o.start + 360}deg) translateX(${o.r}px) rotate(-${o.start + 360}deg); }
              }
            `}</style>
            <div style={{
              width:          o.size,
              height:         o.size,
              background:     "rgba(255,255,255,.12)",
              borderRadius:   "50%",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              fontSize:       o.size * 0.52,
              border:         "1.5px solid rgba(245,166,35,.25)",
              backdropFilter: "blur(4px)",
            }}>
              {o.emoji}
            </div>
          </div>
        ))}
      </div>

      {/* ── Glow behind mascot ── */}
      <div style={{
        position:     "absolute",
        left: "50%",  top: "50%",
        transform:    "translate(-50%,-50%)",
        width: 300,   height: 300,
        borderRadius: "50%",
        background:   "radial-gradient(circle, rgba(245,166,35,.22) 0%, transparent 70%)",
        animation:    "glowPulse 3s ease-in-out infinite",
        pointerEvents:"none",
        zIndex:       0,
      }} />

      {/* ── Mascot image ── */}
      <div style={{ position:"relative", zIndex:1, display:"inline-block" }}>
        {/* Shadow */}
        <div style={{
          width:        160,
          height:       28,
          background:   "rgba(14,24,41,.25)",
          borderRadius: "50%",
          margin:       "0 auto",
          filter:       "blur(14px)",
          animation:    "shadowPulse 3s ease-in-out infinite",
          transform:    "translateY(8px)",
        }} />
        <img
          src={IMG.logo}
          alt="Triangle ESL Mascot"
          style={{
            width:  "min(220px,55vw)",
            height: "min(220px,55vw)",
            objectFit:"contain",
            filter:   "drop-shadow(0 24px 48px rgba(245,166,35,.45)) drop-shadow(0 8px 16px rgba(0,0,0,.3))",
            animation:"mascotFloat 3.8s ease-in-out infinite",
            display:  "block",
            margin:   "-20px auto 0",
            position: "relative",
            zIndex:   2,
          }}
        />
        {/* Sparkles */}
        {SPARKLES.map((sp, i) => (
          <div
            key={i}
            style={{
              position:  "absolute",
              ...sp,
              animation: `sparkle ${sp.dur} ${sp.delay} ease-in-out infinite`,
              fontSize:  sp.size,
              zIndex:    3,
              lineHeight:1,
              color:     C.gold,
            }}
          >
            ✦
          </div>
        ))}
      </div>

      {/* ── Text below mascot ── */}
      <div style={{ position:"relative", zIndex:2, marginTop:16 }}>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:14 }}>
          <Eyebrow light>🌏 Online ESL Classes · Iligan City, Philippines</Eyebrow>
        </div>
        <h1 style={{
          fontFamily:  "'Baloo 2',cursive",
          fontSize:    "clamp(36px,6vw,58px)",
          fontWeight:  900,
          lineHeight:  1.08,
          color:       "#fff",
          margin:      "0 0 12px",
          textShadow:  "0 2px 24px rgba(0,0,0,.3)",
        }}>
          Learn More.<br />
          <span style={{ color: C.gold, textShadow: "0 0 40px rgba(245,166,35,.6), 0 2px 8px rgba(0,0,0,.3)" }}>
            Speak More.
          </span><br />
          Connect More.
        </h1>
        <p style={{ fontSize:16, lineHeight:1.78, color:"rgba(255,255,255,.7)", fontWeight:600, maxWidth:520, margin:"0 auto 32px" }}>
          Triangle ESL delivers fun, personalized, and results-driven online English classes
          for all ages and levels — from shy beginners to confident speakers taking on the world.
        </p>
        <div style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center", padding:"0 8px" }}>
          <GoldBtn onClick={onDemo} large>📋 Book a Free Demo</GoldBtn>
          <GhostBtn onClick={onTeachers}>Meet Our Teachers →</GhostBtn>
        </div>
      </div>
    </div>
  );
}