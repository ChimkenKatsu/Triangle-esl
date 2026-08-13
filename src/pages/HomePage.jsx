import C from "../styles/theme";
import { Eyebrow, Title, Subtitle, Counter, FloatDots } from "../components/ui";
import { GoldBtn, GhostBtn } from "../components/ui";
import MascotHero from "../components/sections/MascotHero";
import PricingCard from "../components/sections/PricingCard";
import FAQ from "../components/sections/FAQ";
import IMG from "../data/images";
import TEACHERS from "../data/teachers";
import PACKAGES from "../data/packages";
import { CONTACT } from "../data/constants";

function FeatureCard({ icon, title, desc }) {
  const [h, setH] = React.useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      background:"#fff", border:`2.5px solid ${h ? C.gold : C.border}`, borderRadius:18, padding:"22px 18px",
      transform: h ? "translateY(-4px)" : "translateY(0)",
      boxShadow: h ? `0 12px 32px rgba(245,166,35,.18)` : "0 2px 12px rgba(14,24,41,.04)",
      transition:"all .22s", position:"relative", overflow:"hidden",
    }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:4, background:`linear-gradient(90deg,${C.gold},#F0B429)` }} />
      <div style={{ fontSize:28, marginBottom:12 }}>{icon}</div>
      <div style={{ fontFamily:"'Baloo 2',cursive", fontWeight:800, fontSize:15, marginBottom:6, color:C.navy }}>{title}</div>
      <p style={{ color:C.muted, fontSize:13, lineHeight:1.68, fontWeight:600, margin:0 }}>{desc}</p>
    </div>
  );
}

function LevelChip({ code, name, col }) {
  const [h, setH] = React.useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      background: h ? C.goldLight : C.goldPale,
      border:     `2px solid ${h ? col : C.border}`,
      borderRadius:14, padding:"14px 10px", textAlign:"center", transition:"all .18s",
    }}>
      <div style={{ width:32, height:32, background:col, color:"#fff", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Baloo 2',cursive", fontSize:13, fontWeight:800, margin:"0 auto 8px" }}>{code}</div>
      <div style={{ fontSize:12, fontWeight:800, color:C.navy }}>{name}</div>
    </div>
  );
}

import React from "react";

const FEATURES = [
  { icon:"🎯", title:"Personalized Lessons",   desc:"Every session tailored to your goals, pace, and interests — zero cookie-cutter approach." },
  { icon:"🏅", title:"Certified Teachers",      desc:"All teachers are trained, certified, and genuinely passionate about student success." },
  { icon:"📅", title:"Flexible Scheduling",     desc:"Morning, afternoon, or evening — Mon to Sun. Classes fit your life, not the other way." },
  { icon:"👨‍👩‍👧", title:"All Ages Welcome",      desc:"Young learners (age 4+) to working adults — we have the perfect class for everyone." },
  { icon:"💰", title:"Affordable Packages",     desc:"Single classes or bundles — more sessions means more savings on your journey." },
  { icon:"🌐", title:"100% Online",             desc:"Learn from home, anywhere in the world. All you need is a device and internet." },
];

const LEVELS = [
  { code:"A1", name:"Beginner",           col:"#9B5DE5" },
  { code:"A2", name:"Elementary",         col:C.gold    },
  { code:"B1", name:"Pre-Intermediate",   col:C.teal    },
  { code:"B2", name:"Intermediate",       col:C.pink    },
  { code:"C1", name:"Upper-Intermediate", col:"#E84040" },
  { code:"C2", name:"Advanced",           col:C.navy    },
];

const LANGS = ["🇯🇵 Japanese","🇰🇷 Korean","🇨🇳 Chinese","🇻🇳 Vietnamese","🇹🇭 Thai","🇮🇩 Indonesian","🇵🇭 Filipino","🇸🇦 Arabic","🇧🇷 Portuguese","🇲🇾 Malay","🇹🇼 Taiwanese","🇪🇸 Spanish"];

export default function HomePage({ go, onDemo }) {
  return (
    <div className="page">

      {/* ── Hero ── */}
      <div style={{
        background:   `linear-gradient(160deg,${C.navy} 0%,${C.navyMid} 55%,#162848 100%)`,
        borderRadius: 24, marginTop:20, marginBottom:40,
        position:"relative", overflow:"hidden",
        boxShadow:"0 28px 72px rgba(14,24,41,.55)",
        border:`1px solid rgba(245,166,35,.18)`,
      }}>
        <FloatDots count={20} />
        <div style={{ position:"absolute", right:-80, top:-80, opacity:.05, pointerEvents:"none" }}>
          <svg width="480" height="480" viewBox="0 0 200 200"><polygon points="100,5 195,195 5,195" fill="#F5A623" /></svg>
        </div>
        <MascotHero onDemo={onDemo} onTeachers={() => go("teachers")} />
        {/* Stat bar */}
        <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", borderTop:"1px solid rgba(255,255,255,.08)" }}>
          {[{n:500,s:"+",l:"Students Taught"},{n:4,s:"",l:"Certified Teachers"},{n:8,s:"+",l:"Student Languages"},{n:100,s:"%",l:"Online & Flexible"}].map((st,i) => (
            <div key={st.l} className="stat-item" style={{ flex:"1 1 140px", padding:"18px 16px", textAlign:"center", borderRight:i<3?"1px solid rgba(255,255,255,.08)":"none" }}>
              <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:26, fontWeight:900, color:C.gold, lineHeight:1 }}><Counter end={st.n} suffix={st.s} /></div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.48)", marginTop:4, fontWeight:700 }}>{st.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Contact strip ── */}
      <div style={{ background:`linear-gradient(90deg,${C.gold},#EFA020)`, borderRadius:16, padding:"14px 20px", display:"flex", flexWrap:"wrap", gap:12, alignItems:"center", justifyContent:"center", marginBottom:48, boxShadow:`0 8px 28px rgba(245,166,35,.38)` }}>
        {[["📍",CONTACT.address],["📞",CONTACT.phone],["✉️",CONTACT.email],["💬",CONTACT.facebook]].map(([ic,tx]) => (
          <div key={tx} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, fontWeight:800, color:C.navy }}>
            <span style={{ fontSize:14 }}>{ic}</span>{tx}
          </div>
        ))}
      </div>

      {/* ── Why Triangle ── */}
      <div style={{ textAlign:"center", marginBottom:28 }}>
        <Eyebrow>Why Triangle ESL</Eyebrow>
        <Title center size={32}>English Learning That Actually Works</Title>
        <Subtitle center>Personalized. Encouraging. Results-driven. Every lesson is built around you.</Subtitle>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16, marginBottom:56 }}>
        {FEATURES.map(f => <FeatureCard key={f.title} {...f} />)}
      </div>

      {/* ── Teacher preview ── */}
      <div style={{ background:C.navy, borderRadius:22, padding:"36px 28px", marginBottom:56, position:"relative", overflow:"hidden" }}>
        <FloatDots count={10} />
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <Eyebrow light>Our Team</Eyebrow>
            <Title center light size={28}>Learn From the Best</Title>
            <Subtitle center light>Four certified, dedicated teachers — each with a unique style for every learner.</Subtitle>
          </div>
          <div className="teacher-preview" style={{ display:"flex", gap:14, flexWrap:"wrap", justifyContent:"center" }}>
            {TEACHERS.map(t => (
              <div key={t.id} onClick={() => go("teachers")} style={{ background:"rgba(255,255,255,.07)", border:`2px solid rgba(${t.accentRgb},.28)`, borderRadius:16, padding:"18px 16px", textAlign:"center", cursor:"pointer", width:160, transition:"all .2s", flexShrink:0 }}
                onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,.14)"; e.currentTarget.style.transform="translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,.07)"; e.currentTarget.style.transform="translateY(0)"; }}
              >
                <img src={IMG[t.img]} alt={t.name} style={{ width:66, height:66, borderRadius:"50%", objectFit:"cover", border:`3px solid ${t.accent}`, marginBottom:8 }} />
                <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:13, fontWeight:800, color:t.accent }}>{t.name}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,.42)", fontWeight:600, marginTop:2 }}>{t.specs[0]}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center", marginTop:24 }}>
            <GoldBtn onClick={() => go("teachers")} large>View All Teacher Profiles →</GoldBtn>
          </div>
        </div>
      </div>

      {/* ── Worldwide students ── */}
      <div style={{ background:"#fff", border:`2px solid ${C.border}`, borderRadius:20, padding:"30px 28px", marginBottom:56 }}>
        <div style={{ textAlign:"center", marginBottom:20 }}>
          <Eyebrow>Our Students</Eyebrow>
          <Title center size={26}>We Teach Students Worldwide 🌏</Title>
          <Subtitle center>Borderless classrooms — students from across Asia and beyond.</Subtitle>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center" }}>
          {LANGS.map(l => <span key={l} style={{ background:C.goldPale, color:C.navy, fontSize:13, fontWeight:700, padding:"6px 12px", borderRadius:100, border:`1.5px solid ${C.border}` }}>{l}</span>)}
        </div>
      </div>

      {/* ── CEFR Levels ── */}
      <div style={{ background:"#fff", border:`2px solid ${C.border}`, borderRadius:20, padding:"32px 24px", marginBottom:56 }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <Eyebrow>CEFR Levels</Eyebrow>
          <Title center size={26}>Find Your Starting Level</Title>
          <Subtitle center>All six CEFR levels. Tell us where you are and we take you further.</Subtitle>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:10 }}>
          {LEVELS.map(l => <LevelChip key={l.code} {...l} />)}
        </div>
      </div>

      {/* ── Pricing teaser ── */}
      <div style={{ marginBottom:56 }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <Eyebrow>Pricing</Eyebrow>
          <Title center size={28}>Simple, Transparent Pricing</Title>
          <Subtitle center>No hidden fees. Single class or a bundle — you choose.</Subtitle>
        </div>
        <div className="package-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:14 }}>
          {PACKAGES.map(p => <PricingCard key={p.id} pkg={p} onBook={() => go("booking")} />)}
        </div>
      </div>

      {/* ── FAQ ── */}
      <div style={{ marginBottom:56 }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <Eyebrow>Common Questions</Eyebrow>
          <Title center size={28}>Frequently Asked Questions</Title>
        </div>
        <FAQ />
      </div>

      {/* ── CTA — single Free Demo section, no duplicate ── */}
      <div className="cta-section" style={{ background:`linear-gradient(140deg,${C.navy},${C.navyMid})`, borderRadius:22, padding:"48px 36px", textAlign:"center", position:"relative", overflow:"hidden", marginBottom:8 }}>
        <FloatDots count={12} />
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontSize:44, marginBottom:14 }}>🚀</div>
          <Title center light size={34}>Ready to Start Your English Journey?</Title>
          <Subtitle center light>Book a free 10-minute demo today — no commitment, no payment, just great English!</Subtitle>
          <div style={{ marginTop:28, display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <GoldBtn onClick={onDemo} large>📋 Book My Free Demo</GoldBtn>
            <GhostBtn onClick={() => go("booking")}>View All Classes →</GhostBtn>
          </div>
        </div>
      </div>
    </div>
  );
}
