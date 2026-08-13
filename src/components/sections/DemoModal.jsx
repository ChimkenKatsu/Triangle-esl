import { useState, useMemo } from "react";
import supabase from "../../lib/supabase";
import { sendDemoEmails } from "../../lib/meetUtils";
import C from "../../styles/theme";
import { LEVELS } from "../../data/constants";
import { Eyebrow, Title, Field, GoldBtn } from "../ui";

// All available time slots per day-of-week
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

const iStyle = {
  width: "100%", padding: "12px 14px",
  border: `2px solid ${C.borderLight}`, borderRadius: 10,
  fontSize: 14, fontFamily: "'Nunito',sans-serif",
  fontWeight: 600, color: C.text, outline: "none",
  background: "#fff", transition: "border .15s",
};

export default function DemoModal({ onClose }) {
  const [f, setF] = useState({ name: "", email: "", slot: "", level: "", desiredDate: "" });
  const [done, setDone]     = useState(false);
  const [saving, setSaving] = useState(false);
  const [errs, setErrs]     = useState({});

  const today = new Date().toISOString().split("T")[0];

  // Derive available time slots from the selected date's weekday
  const availableTimeSlots = useMemo(() => {
    if (!f.desiredDate) return [];
    const [y, m, d] = f.desiredDate.split("-").map(Number);
    const dayIndex = new Date(y, m - 1, d).getDay();
    const dayKey = DAY_NAMES[dayIndex];
    return TIME_SLOTS_BY_DAY[dayKey] || [];
  }, [f.desiredDate]);

  // When date changes, reset slot if it's no longer valid
  const handleDateChange = (e) => {
    setF(prev => ({ ...prev, desiredDate: e.target.value, slot: "" }));
  };

  const submit = async () => {
    const e = {};
    if (!f.name.trim())  e.name  = "Required";
    if (!f.email.trim()) e.email = "Required";
    if (!f.desiredDate)  e.desiredDate = "Select your preferred date";
    if (!f.slot)         e.slot  = "Select a time slot";
    if (!f.level)        e.level = "Select your level";
    if (Object.keys(e).length) { setErrs(e); return; }

    setSaving(true);
    try {
      // Full slot label e.g. "Mon 10:00 AM"
      const [y, m, d] = f.desiredDate.split("-").map(Number);
      const dayKey = DAY_NAMES[new Date(y, m - 1, d).getDay()];
      const fullSlot = `${dayKey} ${f.slot}`;

      await supabase.insertDemo({
        name:           f.name,
        email:          f.email,
        preferred_slot: fullSlot,
        english_level:  f.level,
        desired_date:   f.desiredDate,
        status:         "Pending",
        meet_link:      null,          // Admin will send link manually
        created_at:     new Date().toISOString(),
      });

      try {
        await sendDemoEmails({
          studentName:  f.name,
          studentEmail: f.email,
          slot:         fullSlot,
          level:        f.level,
          desiredDate:  f.desiredDate,
        });
        console.log("✅ Emails sent successfully");
      } catch (emailErr) {
        console.error("❌ Email send failed:", emailErr);
        alert("⚠️ Booking saved! But email notification failed:\n\n" + emailErr.message + "\n\nCheck browser console for details.");
      }

      setDone(true);
    } catch (err) {
      console.error("Demo booking failed:", err);
      alert("Unable to complete booking.\n\n" + (err?.message || "Unknown error") + "\n\nPlease check your Supabase table setup and RLS policies.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(14,24,41,.8)",
        zIndex: 1000, display: "flex",
        alignItems: "center", justifyContent: "center",
        padding: "12px",
        backdropFilter: "blur(8px)",
        overflowY: "auto",
      }}
    >
      <div style={{
        background: "white", borderRadius: 22,
        padding: "clamp(16px,5vw,28px) clamp(14px,5vw,22px)",
        maxWidth: 500, width: "100%",
        maxHeight: "92vh", overflowY: "auto",
        position: "relative",
        border: `3px solid ${C.gold}`,
        boxShadow: `0 32px 80px rgba(245,166,35,.3)`,
        animation: "popIn .32s cubic-bezier(.175,.885,.32,1.275) both",
        margin: "auto",
        WebkitOverflowScrolling: "touch",
      }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 12, right: 12,
            background: C.goldPale, border: `2px solid ${C.border}`,
            width: 34, height: 34, borderRadius: "50%",
            cursor: "pointer", fontWeight: 900, fontSize: 16,
            color: C.navy, display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
        >✕</button>

        {done ? (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🎉</div>
            <Title center size={22}>Demo Booked!</Title>
            <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.8, marginBottom: 18, fontWeight: 600 }}>
              Thank you, <strong>{f.name}</strong>!<br />
              Your <strong>free 10-minute demo class</strong> has been scheduled.<br />
              A confirmation has been sent to <strong>{f.email}</strong>.
            </p>

            {/* What happens next */}
            <div style={{
              background: "#F0FDF4", border: "2px solid #86EFAC",
              borderRadius: 12, padding: "14px 16px", marginBottom: 16, textAlign: "left",
            }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#166534", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 8 }}>
                📋 What Happens Next
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "#166534", fontWeight: 600, lineHeight: 1.9 }}>
                <li>Our admin team will review your booking.</li>
                <li>A <strong>Google Meet link</strong> will be sent to <strong>{f.email}</strong> before your session.</li>
                <li>Check your inbox (and spam folder) closer to your scheduled time.</li>
              </ul>
            </div>

            <div style={{
              background: "#FEF3C7", border: "1.5px solid #F59E0B",
              borderRadius: 10, padding: "10px 14px", marginBottom: 16, textAlign: "left", fontSize: 12, color: "#92400E", fontWeight: 600,
            }}>
              💬 Questions? Message us on <strong>facebook.com/triangleesl</strong> or email <strong>triangle.esidivision@gmail.com</strong>
            </div>

            <GoldBtn onClick={onClose} full large>Close</GoldBtn>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 2 }}>
              <Eyebrow>Free Demo Class</Eyebrow>
            </div>
            <Title size={22}>Book Your Free Demo</Title>

            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#FEF3C7", border: "1.5px solid #F59E0B",
              borderRadius: 100, padding: "5px 12px", marginBottom: 14,
            }}>
              <span style={{ fontSize: 14 }}>⏱</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#92400E" }}>
                10-minute free session · No payment · No pressure
              </span>
            </div>

            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 2 }}>

              {/* Name + Email row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
                <Field label="Your Name" error={errs.name} half>
                  <input
                    value={f.name}
                    onChange={e => setF({ ...f, name: e.target.value })}
                    placeholder="Full name"
                    style={iStyle}
                  />
                </Field>
                <Field label="Email Address" error={errs.email} half>
                  <input
                    type="email"
                    value={f.email}
                    onChange={e => setF({ ...f, email: e.target.value })}
                    placeholder="your@email.com"
                    style={iStyle}
                  />
                </Field>
              </div>

              {/* Preferred Date */}
              <Field label="Preferred Date" error={errs.desiredDate}>
                <input
                  type="date"
                  value={f.desiredDate}
                  min={today}
                  onChange={handleDateChange}
                  style={iStyle}
                />
              </Field>

              {/* Preferred Time — shown only after date is selected */}
              <Field label="Preferred Time" error={errs.slot}>
                {!f.desiredDate ? (
                  <div style={{
                    ...iStyle,
                    color: C.muted, display: "flex", alignItems: "center",
                    background: "#F9FAFB", cursor: "not-allowed",
                  }}>
                    ← Select a date first
                  </div>
                ) : availableTimeSlots.length === 0 ? (
                  <div style={{ ...iStyle, color: "#E04040", background: "#FEF2F2" }}>
                    No slots available for this day
                  </div>
                ) : (
                  <select
                    value={f.slot}
                    onChange={e => setF({ ...f, slot: e.target.value })}
                    style={iStyle}
                  >
                    <option value="">Select a time</option>
                    {availableTimeSlots.map(s => <option key={s}>{s}</option>)}
                  </select>
                )}
              </Field>

              {/* English Level */}
              <Field label="English Level" error={errs.level}>
                <select value={f.level} onChange={e => setF({ ...f, level: e.target.value })} style={iStyle}>
                  <option value="">Select your level</option>
                  {LEVELS.map(l => <option key={l}>{l}</option>)}
                </select>
              </Field>

            </div>

            <div style={{
              background: "#F0FDF4", border: "1.5px solid #86EFAC",
              borderRadius: 10, padding: "10px 14px", marginBottom: 14, marginTop: 4, fontSize: 12, color: "#166534", fontWeight: 600,
            }}>
              📧 A confirmation email will be sent after booking. Our team will then email you the Google Meet link before your session.
            </div>

            <GoldBtn onClick={submit} full large disabled={saving}>
              {saving ? "⏳ Booking…" : "📋 Book My Free 10-Min Demo →"}
            </GoldBtn>
          </>
        )}
      </div>
    </div>
  );
}