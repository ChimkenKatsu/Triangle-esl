import { useState, useEffect, useMemo } from "react";
import supabase from "../lib/supabase";
import { sendBookingEmails } from "../lib/meetUtils";
import C from "../styles/theme";
import PACKAGES from "../data/packages";
import TEACHERS from "../data/teachers";
import { LEVELS, CONTACT, buildPaypalLink } from "../data/constants";

// Time slots organised by weekday
const TIME_SLOTS_BY_DAY = {
  Mon: ["8:00 AM", "10:00 AM", "2:00 PM", "5:00 PM", "7:00 PM"],
  Tue: ["8:00 AM", "10:00 AM", "2:00 PM", "6:00 PM", "8:00 PM"],
  Wed: ["9:00 AM", "11:00 AM", "3:00 PM", "5:00 PM", "7:00 PM"],
  Thu: ["8:00 AM", "10:00 AM", "4:00 PM", "7:00 PM"],
  Fri: ["9:00 AM", "11:00 AM", "1:00 PM", "5:00 PM", "7:00 PM"],
  Sat: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
  Sun: ["10:00 AM", "1:00 PM", "3:00 PM"],
};
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
import { Eyebrow, Title, Subtitle, Card, Field, GoldBtn, SecBtn } from "../components/ui";

const iStyle = {
  width:"100%", padding:"12px 14px",
  border:`2px solid ${C.borderLight}`, borderRadius:10,
  fontSize:14, fontFamily:"'Nunito',sans-serif",
  fontWeight:600, color:C.text, outline:"none",
  background:"#fff", transition:"border .15s",
};

// ── Get today as ISO date string ─────────────────────────────
const todayStr = new Date().toISOString().split("T")[0];

// ── Format date nicely ───────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function StepBar({ current }) {
  const steps = ["Details", "Schedule", "Package", "Payment"];
  return (
    <div style={{ display:"flex", position:"relative", marginBottom:32 }}>
      <div style={{ position:"absolute", top:17, left:18, right:18, height:2, background:C.borderLight }} />
      {steps.map((lbl, i) => {
        const n = i + 1;
        const isDone   = n < current;
        const isActive = n === current;
        return (
          <div key={lbl} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6, position:"relative", zIndex:1 }}>
            <div style={{
              width:34, height:34, borderRadius:"50%",
              background:  isDone ? C.navy  : isActive ? C.gold  : "#fff",
              border:      `2.5px solid ${isDone ? C.navy : isActive ? C.gold : C.border}`,
              color:       isDone ? C.gold  : isActive ? C.navy  : C.muted,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontFamily:"'Baloo 2',cursive", fontWeight:800, fontSize:13,
              boxShadow: isActive ? `0 0 0 5px rgba(245,166,35,.2)` : "none",
              transition:"all .2s",
            }}>
              {isDone ? "✓" : n}
            </div>
            <span style={{ fontSize:10, fontWeight:800, letterSpacing:".04em", color: isDone ? C.navy : isActive ? C.goldDark : C.muted }}>
              {lbl}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ConfirmScreen({ form, slot, desiredDate, pkgId, onReset }) {
  const pkg = PACKAGES.find(p => p.id === pkgId);
  return (
    <Card style={{ maxWidth:580, margin:"0 auto", textAlign:"center", padding:"clamp(20px,5vw,36px) clamp(16px,5vw,28px)" }}>
      <div style={{ fontSize:60, marginBottom:14 }}>🎉</div>
      <Title center>Booking Received!</Title>
      <p style={{ color:C.muted, fontSize:15, lineHeight:1.8, marginBottom:22, fontWeight:600 }}>
        Thank you, <strong>{form.name}</strong>!<br />
        Your <strong>{pkg?.label}</strong> with <strong>{form.teacher || "our team"}</strong><br />
        on <strong>{desiredDate ? formatDate(desiredDate) : slot}</strong> is reserved, pending payment verification.
      </p>

      {/* Meet link info */}
      <div style={{
        background:"#F0FDF4", border:"2px solid #86EFAC",
        borderRadius:14, padding:"16px 18px", marginBottom:20, textAlign:"left",
      }}>
        <div style={{ fontSize:12, fontWeight:800, color:"#166534", marginBottom:8, textTransform:"uppercase", letterSpacing:".06em" }}>
          📋 What Happens Next
        </div>
        <ul style={{ margin:0, paddingLeft:18, fontSize:13, color:"#166534", fontWeight:600, lineHeight:1.9 }}>
          <li>A confirmation email has been sent to <strong>{form.email}</strong>.</li>
          <li>Our admin will verify your PayPal payment, then create your <strong>Google Meet session</strong> and email you the link before your class.</li>
          <li>Check your inbox (and spam folder) closer to your scheduled time.</li>
        </ul>
      </div>

      <div style={{ background:C.goldPale, border:`2px solid ${C.border}`, borderRadius:14, padding:"16px 20px", marginBottom:22, textAlign:"left" }}>
        {[
          ["Package",       pkg?.label],
          ["Sessions",      `${pkg?.sessions} class${pkg?.sessions > 1 ? "es" : ""}`],
          ["Amount Due",    `$${pkg?.price} (via PayPal)`],
          ["Date",          desiredDate ? formatDate(desiredDate) : slot],
          ["Time Slot",     slot],
          ["Teacher",       form.teacher || "Any Teacher"],
        ].map(([k, v]) => (
          <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid ${C.border}`, fontSize:14 }}>
            <span style={{ color:C.muted, fontWeight:600 }}>{k}</span>
            <span style={{ fontWeight:800, color:C.navy }}>{v}</span>
          </div>
        ))}
      </div>
      <GoldBtn full large onClick={onReset}>Book Another Class</GoldBtn>
    </Card>
  );
}

export default function BookingPage({ prefill, onNewBooking }) {
  const [step,        setStep]        = useState(1);
  const [form,        setForm]        = useState({ name:"", email:"", level:"", teacher: prefill || "" });
  const [slot,        setSlot]        = useState("");
  const [desiredDate, setDesiredDate] = useState("");
  const [pkgId,       setPkgId]       = useState("");
  const [paypalOpened,setPaypalOpened]= useState(false);
  const [paidConfirm, setPaidConfirm] = useState(false);
  const [errs,        setErrs]        = useState({});
  const [saving,      setSaving]      = useState(false);
  const [done,        setDone]        = useState(false);

  // Slots available for the chosen date's weekday
  const availableTimeSlots = useMemo(() => {
    if (!desiredDate) return [];
    const [y, m, d] = desiredDate.split("-").map(Number);
    const dayKey = DAY_NAMES[new Date(y, m - 1, d).getDay()];
    return TIME_SLOTS_BY_DAY[dayKey] || [];
  }, [desiredDate]);

  // Reset slot when date changes
  const handleDateChange = (val) => {
    setDesiredDate(val);
    setSlot("");
  };

  useEffect(() => {
    if (prefill) setForm(f => ({ ...f, teacher: prefill }));
  }, [prefill]);

  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "Required";
    if (!form.email.trim()) e.email = "Required";
    if (!form.level)        e.level = "Choose your level";
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const confirmBooking = async () => {
    const e = {};
    if (!paidConfirm) e.paid = "Please confirm your PayPal payment before continuing";
    if (Object.keys(e).length) { setErrs(e); return; }

    const pkg = PACKAGES.find(p => p.id === pkgId);

    // Build full slot label with day prefix
    let fullSlot = slot;
    if (desiredDate && !slot.includes(" ")) {
      const [y, m, d] = desiredDate.split("-").map(Number);
      const dayKey = DAY_NAMES[new Date(y, m - 1, d).getDay()];
      fullSlot = `${dayKey} ${slot}`;
    }

    const record = {
      name:         form.name,
      email:        form.email,
      teacher:      form.teacher || "Any Teacher",
      slot: fullSlot,
      desired_date: desiredDate || null,
      level:        form.level,
      pkg:          pkg.label,
      amount:       `$${pkg.price}`,
      status:       "Pending Payment Verification",
      meet_link:    null,          // Admin will send the Meet link manually
      date:         desiredDate || new Date().toISOString().slice(0, 10),
    };

    setSaving(true);
    try {
      await supabase.insertBooking(record);
    } catch (dbErr) {
      setSaving(false);
      console.error("Supabase insertBooking failed:", dbErr);
      alert("Unable to save booking to database.\n\n" + (dbErr?.message || "Unknown error") + "\n\nPlease check your Supabase table setup and RLS policies.");
      return;
    }

    // Send emails with desired date
    try {
      await sendBookingEmails({
        studentName:  form.name,
        studentEmail: form.email,
        teacher:      form.teacher || "Any Teacher",
        slot:         fullSlot,
        pkg:          pkg.label,
        amount:       `$${pkg.price}`,
        desiredDate,
      });
    } catch (emailErr) {
      console.error("Email send failed:", emailErr);
    }

    setSaving(false);
    onNewBooking(record);
    setDone(true);
  };

  const reset = () => {
    setDone(false); setStep(1); setSlot(""); setPkgId(""); setDesiredDate("");
    setForm({ name:"", email:"", level:"", teacher:"" });
    setPaypalOpened(false); setPaidConfirm(false);
    setErrs({});
  };

  if (done) return (
    <ConfirmScreen
      form={form} slot={slot} desiredDate={desiredDate}
      pkgId={pkgId} onReset={reset}
    />
  );

  const pkg = PACKAGES.find(p => p.id === pkgId);

  return (
    <div style={{ maxWidth:760, margin:"0 auto" }}>
      <StepBar current={step} />
      <Card>

        {step === 1 && (
          <>
            <Title size={22}>Your Details</Title>
            <Subtitle>Tell us a bit about yourself to get started.</Subtitle>
            <div style={{ marginTop:20, display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 14px" }}>
              <Field label="Full Name" error={errs.name} half>
                <input value={form.name} onChange={e => setForm({ ...form, name:e.target.value })} placeholder="e.g. Maria Santos" style={iStyle} />
              </Field>
              <Field label="Email Address" error={errs.email} half>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email:e.target.value })} placeholder="your@email.com" style={iStyle} />
              </Field>
              <Field label="English Level" error={errs.level} half>
                <select value={form.level} onChange={e => setForm({ ...form, level:e.target.value })} style={iStyle}>
                  <option value="">Select your level</option>
                  {LEVELS.map(l => <option key={l}>{l}</option>)}
                </select>
              </Field>
              <Field label="Preferred Teacher" half>
                <select value={form.teacher} onChange={e => setForm({ ...form, teacher:e.target.value })} style={iStyle}>
                  <option value="">No preference</option>
                  {TEACHERS.map(t => <option key={t.id}>{t.name}</option>)}
                </select>
              </Field>
            </div>
            <GoldBtn full large onClick={() => { if (validateStep1()) { setErrs({}); setStep(2); } }}>Continue →</GoldBtn>
          </>
        )}

        {step === 2 && (
          <>
            <Title size={22}>Choose Your Schedule</Title>
            <Subtitle>Pick the date and time that works best for you.</Subtitle>

            {/* Desired date picker */}
            <div style={{ marginTop:18, marginBottom:18 }}>
              <Field label="Preferred Date" error={errs.date}>
                <input
                  type="date"
                  value={desiredDate}
                  min={todayStr}
                  onChange={e => handleDateChange(e.target.value)}
                  style={iStyle}
                />
              </Field>
            </div>

            <div style={{ fontSize:13, fontWeight:700, color:C.navy, marginBottom:10 }}>Select a Time Slot</div>
            {!desiredDate ? (
              <div style={{ background:"#F9FAFB", border:`2px solid ${C.borderLight}`, borderRadius:10, padding:"14px 16px", color:C.muted, fontWeight:600, fontSize:13, marginBottom:20 }}>
                ← Please select a preferred date above first
              </div>
            ) : availableTimeSlots.length === 0 ? (
              <div style={{ background:"#FEF2F2", border:"2px solid #FCA5A5", borderRadius:10, padding:"14px 16px", color:"#991B1B", fontWeight:600, fontSize:13, marginBottom:20 }}>
                No available slots on this day. Please choose a different date.
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(108px,1fr))", gap:8, marginBottom:20 }}>
                {availableTimeSlots.map(s => (
                  <button key={s} onClick={() => setSlot(s)} style={{
                    background: slot === s ? C.gold : C.goldPale,
                    border:`2px solid ${slot === s ? C.gold : C.border}`,
                    borderRadius:10, padding:"9px 6px",
                    fontFamily:"'Nunito',sans-serif", fontSize:12, fontWeight:700,
                    color: slot === s ? C.navy : C.muted,
                    cursor:"pointer", transition:"all .15s",
                    boxShadow: slot === s ? `0 4px 12px rgba(245,166,35,.32)` : "none",
                  }}>{s}</button>
                ))}
              </div>
            )}
            {errs.slot && <p style={{ color:"#E04040", fontSize:13, fontWeight:700, marginBottom:12 }}>⚠ Please select a time slot.</p>}
            <div style={{ display:"flex", gap:12 }}>
              <SecBtn onClick={() => setStep(1)}>← Back</SecBtn>
              <GoldBtn full large onClick={() => {
                if (!slot) { setErrs({ slot:true }); return; }
                setErrs({}); setStep(3);
              }}>Continue →</GoldBtn>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <Title size={22}>Choose a Package</Title>
            <Subtitle>Pick the plan that best fits your goals and budget.</Subtitle>
            <div style={{ marginTop:20, display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:12, marginBottom:20 }}>
              {PACKAGES.map(p => (
                <div key={p.id} onClick={() => setPkgId(p.id)} style={{
                  border:`2.5px solid ${pkgId === p.id ? p.color : C.border}`,
                  borderRadius:16, padding:"16px 12px", cursor:"pointer",
                  background: pkgId === p.id ? `rgba(${p.rgb},.06)` : C.goldPale,
                  position:"relative", transition:"all .18s",
                  boxShadow: pkgId === p.id ? `0 8px 24px rgba(${p.rgb},.18)` : "none",
                }}>
                  {p.badge && (
                    <div style={{
                      position:"absolute", top:-1, right:12,
                      fontSize:10, fontWeight:800, padding:"3px 10px",
                      borderRadius:"0 0 8px 8px", letterSpacing:".05em",
                      background: p.badge === "POPULAR" ? C.navy : p.color,
                      color: p.badge === "POPULAR" ? C.gold : "#fff",
                    }}>{p.badge}</div>
                  )}
                  <div style={{ fontSize:22, marginBottom:6 }}>{p.icon}</div>
                  <div style={{ fontFamily:"'Baloo 2',cursive", fontWeight:800, fontSize:15, color:C.navy, marginBottom:2 }}>{p.label}</div>
                  <div style={{ color:C.muted, fontSize:12, fontWeight:600, marginBottom:10 }}>{p.sessions} session{p.sessions > 1 ? "s" : ""}</div>
                  <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:26, fontWeight:900, color:p.color }}>${p.price}</div>
                  {p.per && <div style={{ fontSize:11, color:C.muted, fontWeight:600, marginTop:3 }}>{p.per}/class</div>}
                </div>
              ))}
            </div>
            {errs.pkg && <p style={{ color:"#E04040", fontSize:13, fontWeight:700, marginBottom:12 }}>⚠ Please select a package.</p>}
            <div style={{ display:"flex", gap:12 }}>
              <SecBtn onClick={() => setStep(2)}>← Back</SecBtn>
              <GoldBtn full large onClick={() => { if (!pkgId) { setErrs({ pkg:true }); return; } setErrs({}); setStep(4); }}>Continue →</GoldBtn>
            </div>
          </>
        )}

        {step === 4 && pkg && (
          <>
            <Title size={22}>Review &amp; Payment</Title>
            <div style={{ background:C.goldPale, border:`2px solid ${C.border}`, borderRadius:14, padding:"16px 20px", marginBottom:20, marginTop:14 }}>
              <div style={{ fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:".08em", color:C.muted, marginBottom:10 }}>Booking Summary</div>
              {[
                ["Student",   form.name],
                ["Email",     form.email],
                ["Level",     form.level],
                ["Teacher",   form.teacher || "Any Teacher"],
                ["Date",      desiredDate ? formatDate(desiredDate) : "—"],
                ["Schedule",  slot],
                ["Package",   pkg.label],
                ["Sessions",  `${pkg.sessions} class${pkg.sessions > 1 ? "es" : ""}`],
              ].map(([k, v]) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid ${C.border}`, fontSize:14 }}>
                  <span style={{ color:C.muted, fontWeight:600 }}>{k}</span>
                  <span style={{ fontWeight:700, color:C.text, textAlign:"right", maxWidth:"55%" }}>{v}</span>
                </div>
              ))}
              <div style={{ display:"flex", justifyContent:"space-between", paddingTop:14, fontSize:18, fontWeight:800, color:C.goldDark }}>
                <span>Total Due</span><span>${pkg.price}</span>
              </div>
            </div>

            {/* ── PayPal payment step ─────────────────────────── */}
            <div style={{ background:"#EFF6FF", border:"2px solid #BFDBFE", borderRadius:14, padding:"16px 18px", marginBottom:18 }}>
              <div style={{ fontSize:12, fontWeight:800, color:"#1E40AF", marginBottom:8, textTransform:"uppercase", letterSpacing:".06em" }}>
                💳 How Payment Works
              </div>
              <ol style={{ margin:0, paddingLeft:18, fontSize:13, color:"#1E3A8A", fontWeight:600, lineHeight:1.85 }}>
                <li>Click <strong>"Pay ${pkg.price} with PayPal"</strong> below — it opens PayPal in a new tab, pre-filled with the amount.</li>
                <li>Complete the payment there to <strong>{CONTACT.email}</strong>.</li>
                <li>Come back here, check the box, and tap <strong>Confirm Booking</strong>.</li>
                <li>Our admin verifies the payment and emails your Google Meet link before class.</li>
              </ol>
            </div>

            <a
              href={buildPaypalLink({
                amount:   pkg.price,
                itemName: `${pkg.label} – Triangle ESL (${form.name || "Student"})`,
                note:     `${form.email} | ${form.teacher || "Any Teacher"} | ${desiredDate ? formatDate(desiredDate) : ""} ${slot}`,
              })}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setPaypalOpened(true)}
              style={{
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                width:"100%", padding:"14px 16px", marginBottom:16,
                background:"#0070BA", color:"#fff", borderRadius:12,
                fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:15,
                textDecoration:"none", boxShadow:"0 4px 14px rgba(0,112,186,.28)",
              }}
            >
              🅿️ Pay ${pkg.price} with PayPal
            </a>

            <label style={{
              display:"flex", alignItems:"flex-start", gap:10, cursor:"pointer",
              background: errs.paid ? "#FEF2F2" : C.goldPale,
              border:`2px solid ${errs.paid ? "#FCA5A5" : C.border}`,
              borderRadius:12, padding:"12px 14px", marginBottom:8,
            }}>
              <input
                type="checkbox"
                checked={paidConfirm}
                onChange={e => { setPaidConfirm(e.target.checked); setErrs({}); }}
                style={{ marginTop:2, width:18, height:18, accentColor:C.gold, flexShrink:0 }}
              />
              <span style={{ fontSize:13, fontWeight:700, color:C.text }}>
                I have completed my ${pkg.price} PayPal payment to {CONTACT.email}.
              </span>
            </label>
            {errs.paid && <p style={{ color:"#E04040", fontSize:12, fontWeight:700, marginBottom:12 }}>⚠ {errs.paid}</p>}

            <div style={{ display:"flex", gap:12, marginTop:12 }}>
              <SecBtn onClick={() => setStep(3)}>← Back</SecBtn>
              <GoldBtn full large onClick={confirmBooking} disabled={saving}>
                {saving ? "⏳ Processing…" : "🔒 Confirm Booking"}
              </GoldBtn>
            </div>
            <p style={{ textAlign:"center", fontSize:12, color:C.muted, marginTop:12, fontWeight:700 }}>
              🔒 Secured by PayPal · Our admin will email your Google Meet link once payment is verified
            </p>
          </>
        )}

      </Card>
    </div>
  );
}