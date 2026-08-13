import { Eyebrow, Title, Subtitle, Card } from "../components/ui";
import { GoldBtn } from "../components/ui";
import PricingCard from "../components/sections/PricingCard";
import FAQ from "../components/sections/FAQ";
import PACKAGES from "../data/packages";
import C from "../styles/theme";

const COMPARISON = [
  ["Price",           ["$2", "$39.99", "$69.99"]],
  ["Sessions",        ["1",  "15 + 2 free", "30 + 5 free"]],
  ["Total Classes",   ["1",  "17", "35"]],
  ["Price/Class",     ["$2", "$2.35", "$2.00"]],
  ["Validity",        ["1 week", "60 days", "90 days"]],
  ["Teacher Choice",  ["✓", "✓", "✓"]],
  ["Free Reschedule", ["—", "1x", "3x"]],
  ["Progress Report", ["—", "—", "✓"]],
  ["Priority Booking",["—", "—", "✓"]],
];

export default function PricingPage({ go }) {
  return (
    <div className="page" style={{ paddingTop:40, paddingBottom:16 }}>
      <div style={{ textAlign:"center", marginBottom:48 }}>
        <Eyebrow>Packages & Pricing</Eyebrow>
        <Title center size={38}>Find Your Perfect Plan</Title>
        <Subtitle center>Affordable classes with bonus sessions — something for every learner and budget.</Subtitle>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:20, marginBottom:52 }}>
        {PACKAGES.map(p => <PricingCard key={p.id} pkg={p} onBook={() => go("booking")} big />)}
      </div>

      <Card style={{ marginBottom:48 }}>
        <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:22, fontWeight:800, color:C.navy, marginBottom:6 }}>Package Comparison</div>
        <p style={{ fontSize:15, color:C.muted, fontWeight:600, marginBottom:22 }}>See exactly what each package includes at a glance.</p>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
            <thead>
              <tr style={{ background:C.navy }}>
                <th style={{ padding:"12px 16px", textAlign:"left", color:C.gold, fontWeight:800, fontSize:12, textTransform:"uppercase", letterSpacing:".07em" }}>Feature</th>
                {PACKAGES.map(p => (
                  <th key={p.id} style={{ padding:"12px 16px", textAlign:"center", color: p.color === C.navy ? "#fff" : p.color, fontWeight:800, fontSize:12, textTransform:"uppercase", letterSpacing:".07em", whiteSpace:"nowrap" }}>{p.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map(([feat, vals], ri) => (
                <tr key={feat} style={{ background: ri % 2 === 0 ? C.goldPale : "#fff" }}>
                  <td style={{ padding:"12px 16px", fontWeight:700, color:C.navy }}>{feat}</td>
                  {vals.map((v, vi) => (
                    <td key={vi} style={{ padding:"12px 16px", textAlign:"center", fontWeight:700, color: v==="✓" ? "#0B7A70" : v==="—" ? "#ccc" : C.text }}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div style={{ textAlign:"center", marginBottom:60 }}>
        <GoldBtn onClick={() => go("booking")} large>🎯 Book Your First Class Now</GoldBtn>
      </div>

      <div style={{ marginBottom:16 }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <Eyebrow>Questions</Eyebrow>
          <Title center size={28}>FAQs About Packages</Title>
        </div>
        <FAQ />
      </div>
    </div>
  );
}