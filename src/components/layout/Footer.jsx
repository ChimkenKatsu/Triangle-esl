import IMG from "../../data/images";
import C from "../../styles/theme";
import { CONTACT } from "../../data/constants";

const LINKS = [
  { label:"About",        id:"home"     },
  { label:"Teachers",     id:"teachers" },
  { label:"Packages",     id:"pricing"  },
  { label:"Book a Class", id:"booking"  },
];

const CONTACT_ROWS = [
  ["📍", `${CONTACT.address}`],
  ["📞", CONTACT.phone],
  ["✉️", CONTACT.email],
  ["💬", CONTACT.facebook],
];

export default function Footer({ go }) {
  const linkStyle = {
    fontSize: 13, color: "rgba(255,255,255,.45)", fontWeight: 600,
    marginBottom: 8, cursor: "pointer", transition: "color .15s",
  };
  return (
    <footer style={{
      background:  C.navy,
      borderTop:   `3px solid ${C.gold}`,
      padding:     "40px 24px 28px",
      marginTop:   72,
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display:"flex", flexWrap:"wrap", gap:40, marginBottom:36, justifyContent:"space-between" }}>

          {/* Brand */}
          <div style={{ flex:"0 0 240px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <img src={IMG.logo} alt="Logo" style={{ width:44, height:44, objectFit:"contain", borderRadius:10, border:"2px solid rgba(245,166,35,.35)" }} />
              <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:18, fontWeight:900, color:C.gold }}>TRIANGLE ESL</div>
            </div>
            <p style={{ fontSize:13, color:"rgba(255,255,255,.42)", fontWeight:600, lineHeight:1.72 }}>
              Learn More. Speak More. Connect More.<br />
              Personalized online English classes for all levels and ages.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <div style={{ fontSize:12, fontWeight:800, color:C.gold, textTransform:"uppercase", letterSpacing:".08em", marginBottom:14 }}>Quick Links</div>
            {LINKS.map(l => (
              <div
                key={l.id}
                onClick={() => go(l.id)}
                style={linkStyle}
                onMouseEnter={e => (e.currentTarget.style.color = C.gold)}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,.45)")}
              >
                {l.label}
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize:12, fontWeight:800, color:C.gold, textTransform:"uppercase", letterSpacing:".08em", marginBottom:14 }}>Contact Us</div>
            {CONTACT_ROWS.map(([ic, tx]) => (
              <div key={tx} style={{ display:"flex", gap:8, marginBottom:10, fontSize:13, color:"rgba(255,255,255,.45)", fontWeight:600 }}>
                <span>{ic}</span>
                <span style={{ whiteSpace:"pre-line" }}>{tx}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop:"1px solid rgba(255,255,255,.1)", paddingTop:20, textAlign:"center" }}>
          <div style={{ fontSize:12, color:"rgba(255,255,255,.22)", fontWeight:600 }}>
            © 2026 Triangle ESL · Iligan City, Philippines ·
          </div>
        </div>
      </div>
    </footer>
  );
}
