import { useState, useEffect, useCallback } from "react";
import supabase from "../lib/supabase";
import C from "../styles/theme";
import IMG from "../data/images";
import { Eyebrow, Title, Subtitle, Card, Field, GoldBtn, SecBtn } from "../components/ui";

const iStyle = {
  width: "100%", padding: "12px 14px",
  border: `2px solid ${C.borderLight}`, borderRadius: 10,
  fontSize: 14, fontFamily: "'Nunito',sans-serif",
  fontWeight: 600, color: C.text,
  outline: "none", background: "#fff", transition: "border .15s",
};

// ── Demo status options ────────────────────────────────────────
const DEMO_STATUSES = ["Pending", "Approved Demo", "Done Demo"];

// ── Booking status options ─────────────────────────────────────
const BOOKING_STATUSES = ["Confirmed", "Pending", "Done", "Cancelled"];

// ── Helper: is a slot in the past? ────────────────────────────
function isSlotPast(slot, dateStr) {
  if (!slot && !dateStr) return false;
  try {
    const base = dateStr ? new Date(dateStr) : new Date();
    const dayMap = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 };
    const parts = (slot || "").split(" ");
    if (parts.length < 2) return false;
    const [dayStr, timeStr, period] = parts;
    if (!Object.prototype.hasOwnProperty.call(dayMap, dayStr)) return false;
    const [hStr, mStr] = timeStr.split(":");
    let h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    const slotDate = new Date(base);
    const diff = (dayMap[dayStr] - slotDate.getDay() + 7) % 7;
    slotDate.setDate(slotDate.getDate() - (diff === 0 ? 7 : diff));
    slotDate.setHours(h, m, 0, 0);
    return slotDate < new Date();
  } catch { return false; }
}

// ── Tab button ────────────────────────────────────────────────
function TabBtn({ active, onClick, children, badge }) {
  return (
    <button
      onClick={onClick}
      style={{
        background:   active ? C.navy : "#fff",
        color:        active ? C.gold : C.muted,
        border:       `2px solid ${active ? C.navy : C.border}`,
        padding:      "9px 16px",
        borderRadius: 10,
        fontFamily:   "'Nunito',sans-serif",
        fontWeight:   800,
        fontSize:     13,
        cursor:       "pointer",
        display:      "flex",
        alignItems:   "center",
        gap:          7,
        transition:   "all .15s",
      }}
    >
      {children}
      {badge != null && (
        <span style={{
          background:   active ? C.gold : C.goldLight,
          color:        active ? C.navy : C.goldDark,
          fontSize:     11,
          fontWeight:   900,
          padding:      "1px 7px",
          borderRadius: 100,
          minWidth:     20,
          textAlign:    "center",
        }}>
          {badge}
        </span>
      )}
    </button>
  );
}

// ── Stat card ─────────────────────────────────────────────────
function StatCard({ icon, label, value, color }) {
  return (
    <Card pad={16}>
      <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontFamily: "'Baloo 2',cursive", fontSize: 24, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 12, color: C.muted, fontWeight: 700 }}>{label}</div>
    </Card>
  );
}

// ── DB status pill ────────────────────────────────────────────
function DbPill({ status }) {
  const map = {
    idle:  { bg: C.goldLight, text: C.goldDark, dot: C.gold,    label: "Connecting…"                           },
    ok:    { bg: "#D1FAE5",   text: "#065F46",  dot: "#10B981",  label: "Supabase Connected"                   },
    error: { bg: "#FEE2E2",   text: "#991B1B",  dot: "#EF4444",  label: "Using Local Data (Configure Supabase)" },
  };
  const s = map[status] || map.idle;
  return (
    <div style={{
      background:  s.bg,
      color:       s.text,
      fontSize:    11, fontWeight: 800,
      padding:     "5px 12px", borderRadius: 100,
      border:      `1px solid ${s.dot}33`,
      display:     "flex", alignItems: "center", gap: 6,
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: "50%",
        background: s.dot, display: "inline-block",
        animation:  status === "idle" ? "pulse 1.5s infinite" : "none",
      }} />
      {s.label}
    </div>
  );
}

// ── Status pill (display only) ────────────────────────────────
function StatusPill({ status }) {
  const cfg = {
    "Confirmed":     { bg: "#D1FAE5",  color: "#065F46"  },
    "Pending":       { bg: C.goldLight, color: C.goldDark },
    "Done":          { bg: "#EDE9FE",  color: "#5B21B6"  },
    "Done Demo":     { bg: "#EDE9FE",  color: "#5B21B6"  },
    "Approved Demo": { bg: "#D1FAE5",  color: "#065F46"  },
    "Cancelled":     { bg: "#FEE2E2",  color: "#991B1B"  },
  };
  const s = cfg[status] || { bg: C.goldLight, color: C.goldDark };
  return (
    <span style={{
      background:   s.bg,
      color:        s.color,
      fontSize:     11, fontWeight: 800,
      padding:      "3px 10px",
      borderRadius: 100,
      whiteSpace:   "nowrap",
    }}>
      {status || "Pending"}
    </span>
  );
}

// ── Inline status dropdown ────────────────────────────────────
function StatusSelect({ value, options, onChange, disabled }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      style={{
        border:       `2px solid ${C.border}`,
        borderRadius: 8,
        padding:      "5px 8px",
        fontSize:     12,
        fontFamily:   "'Nunito',sans-serif",
        fontWeight:   700,
        color:        C.navy,
        background:   "#fff",
        cursor:       "pointer",
        outline:      "none",
      }}
    >
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  );
}

// ── Setup notice ──────────────────────────────────────────────
function SetupNotice() {
  return (
    <div style={{
      background:   "#FFF7ED", border: "2px solid #FDE68A",
      borderRadius: 14, padding: "14px 18px", marginBottom: 20,
      fontSize:     13, fontWeight: 600, color: "#92400E", lineHeight: 1.7,
    }}>
      <strong>⚡ Connect Supabase:</strong> Open{" "}
      <code style={{ background: "#FEF3C7", padding: "1px 6px", borderRadius: 4 }}>src/lib/supabase.js</code>
      {" "}and replace your credentials. Also add{" "}
      <code style={{ background: "#FEF3C7", padding: "1px 6px", borderRadius: 4 }}>status text</code>,{" "}
      <code style={{ background: "#FEF3C7", padding: "1px 6px", borderRadius: 4 }}>meet_link text</code>, and{" "}
      <code style={{ background: "#FEF3C7", padding: "1px 6px", borderRadius: 4 }}>duration_mins int</code>{" "}
      columns to both tables. Currently showing local demo data.
    </div>
  );
}

// ── Mobile booking card ───────────────────────────────────────
function BookingCard({ b, onStatusChange, onMeetLinkChange, updating }) {
  const id = b.id ?? b;
  const [editingLink, setEditingLink] = useState(false);
  const [linkVal, setLinkVal] = useState(b.meet_link || "");

  const saveLink = () => {
    onMeetLinkChange(id, linkVal);
    setEditingLink(false);
  };

  return (
    <div style={{
      background:   "#fff",
      borderRadius: 14,
      border:       `1.5px solid ${C.borderLight}`,
      padding:      "16px 14px",
      marginBottom: 10,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div style={{ fontWeight: 800, color: C.navy, fontSize: 15 }}>{b.name}</div>
          <div style={{ color: C.teal, fontSize: 12, fontWeight: 600 }}>{b.email}</div>
        </div>
        <StatusPill status={b.status} />
      </div>
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: "6px 12px", fontSize: 12, color: C.muted,
        fontWeight: 600, marginBottom: 10,
      }}>
        <span>👩‍🏫 {b.teacher}</span>
        <span>📅 {b.slot}</span>
        <span>📦 {b.pkg}</span>
        <span>💰 {b.amount}</span>
        <span>🎯 {b.level}</span>
        <span>🗓 {b.desired_date || b.date || (b.created_at ? b.created_at.slice(0, 10) : "—")}</span>
      </div>

      {/* Meet link editor */}
      <div style={{ marginBottom: 10 }}>
        {b.meet_link && !editingLink ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <a href={b.meet_link} target="_blank" rel="noreferrer"
              style={{ color: "#4F46E5", fontSize: 12, fontWeight: 700, wordBreak: "break-all", flex: 1 }}>
              📹 {b.meet_link}
            </a>
            <button onClick={() => { setLinkVal(b.meet_link); setEditingLink(true); }}
              style={{ fontSize: 11, background: C.goldLight, border: `1px solid ${C.border}`, borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontWeight: 700, color: C.navy, whiteSpace: "nowrap" }}>
              ✏️ Edit
            </button>
          </div>
        ) : editingLink ? (
          <div style={{ display: "flex", gap: 6 }}>
            <input value={linkVal} onChange={e => setLinkVal(e.target.value)}
              placeholder="https://meet.google.com/xxx-yyyy-zzz"
              style={{ flex: 1, padding: "6px 10px", border: `2px solid ${C.gold}`, borderRadius: 8, fontSize: 12, fontFamily: "'Nunito',sans-serif", fontWeight: 600 }} />
            <button onClick={saveLink} style={{ background: C.gold, border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontWeight: 800, color: C.navy, fontSize: 12 }}>Save</button>
            <button onClick={() => setEditingLink(false)} style={{ background: "#eee", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontWeight: 700, color: C.muted, fontSize: 12 }}>✕</button>
          </div>
        ) : (
          <button onClick={() => setEditingLink(true)}
            style={{ fontSize: 12, background: "#EEF2FF", border: "1.5px solid #818CF8", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontWeight: 700, color: "#4F46E5" }}>
            + Add Meet Link
          </button>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 12, color: C.muted, fontWeight: 700 }}>Status:</span>
        <StatusSelect
          value={b.status || "Confirmed"}
          options={BOOKING_STATUSES}
          onChange={v => onStatusChange(id, v)}
          disabled={updating === id}
        />
        {updating === id && <span style={{ fontSize: 11, color: C.muted }}>⏳</span>}
      </div>
    </div>
  );
}

// ── Mobile demo card ──────────────────────────────────────────
function DemoCard({ d, onStatusChange, onMeetLinkChange, updating }) {
  const id = d.id ?? d;
  const [editingLink, setEditingLink] = useState(false);
  const [linkVal, setLinkVal] = useState(d.meet_link || "");

  const saveLink = () => {
    onMeetLinkChange(id, linkVal);
    setEditingLink(false);
  };

  return (
    <div style={{
      background:   "#fff",
      borderRadius: 14,
      border:       `1.5px solid ${C.borderLight}`,
      padding:      "16px 14px",
      marginBottom: 10,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div style={{ fontWeight: 800, color: C.navy, fontSize: 15 }}>{d.name || "—"}</div>
          <div style={{ color: C.teal, fontSize: 12, fontWeight: 600 }}>{d.email || "—"}</div>
        </div>
        <StatusPill status={d.status} />
      </div>
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: "6px 12px", fontSize: 12, color: C.muted,
        fontWeight: 600, marginBottom: 10,
      }}>
        <span>📅 {d.preferred_slot || "—"}</span>
        <span>🎯 {d.english_level || "—"}</span>
        {d.duration_mins && <span>⏱ {d.duration_mins} min</span>}
        <span>📆 {d.desired_date || (d.created_at ? d.created_at.slice(0, 10) : "—")}</span>
        <span>🗓 Submitted: {d.created_at ? new Date(d.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</span>
      </div>

      {/* Meet link editor */}
      <div style={{ marginBottom: 10 }}>
        {d.meet_link && !editingLink ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <a href={d.meet_link} target="_blank" rel="noreferrer"
              style={{ color: "#4F46E5", fontSize: 12, fontWeight: 700, wordBreak: "break-all", flex: 1 }}>
              📹 {d.meet_link}
            </a>
            <button onClick={() => { setLinkVal(d.meet_link); setEditingLink(true); }}
              style={{ fontSize: 11, background: C.goldLight, border: `1px solid ${C.border}`, borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontWeight: 700, color: C.navy, whiteSpace: "nowrap" }}>
              ✏️ Edit
            </button>
          </div>
        ) : editingLink ? (
          <div style={{ display: "flex", gap: 6 }}>
            <input value={linkVal} onChange={e => setLinkVal(e.target.value)}
              placeholder="https://meet.google.com/xxx-yyyy-zzz"
              style={{ flex: 1, padding: "6px 10px", border: `2px solid ${C.gold}`, borderRadius: 8, fontSize: 12, fontFamily: "'Nunito',sans-serif", fontWeight: 600 }} />
            <button onClick={saveLink} style={{ background: C.gold, border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontWeight: 800, color: C.navy, fontSize: 12 }}>Save</button>
            <button onClick={() => setEditingLink(false)} style={{ background: "#eee", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontWeight: 700, color: C.muted, fontSize: 12 }}>✕</button>
          </div>
        ) : (
          <button onClick={() => setEditingLink(true)}
            style={{ fontSize: 12, background: "#EEF2FF", border: "1.5px solid #818CF8", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontWeight: 700, color: "#4F46E5" }}>
            + Add Meet Link
          </button>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 12, color: C.muted, fontWeight: 700 }}>Status:</span>
        <StatusSelect
          value={d.status || "Pending"}
          options={DEMO_STATUSES}
          onChange={v => onStatusChange(id, v)}
          disabled={updating === id}
        />
        {updating === id && <span style={{ fontSize: 11, color: C.muted }}>⏳</span>}
      </div>
    </div>
  );
}

// ── Booking meet link inline editor cell ──────────────────────
function BookingMeetLinkCell({ b, onMeetLinkChange }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal]         = useState(b.meet_link || "");

  const save = () => {
    onMeetLinkChange(b.id, val);
    setEditing(false);
  };

  if (editing) {
    return (
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <input
          value={val}
          onChange={e => setVal(e.target.value)}
          placeholder="https://meet.google.com/..."
          style={{ flex: 1, padding: "4px 8px", border: `2px solid ${C.gold}`, borderRadius: 6, fontSize: 11, fontFamily: "'Nunito',sans-serif", fontWeight: 600, minWidth: 0 }}
        />
        <button onClick={save} style={{ background: C.gold, border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontWeight: 800, color: C.navy, fontSize: 11, whiteSpace: "nowrap" }}>✓ Save</button>
        <button onClick={() => setEditing(false)} style={{ background: "#eee", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer", color: C.muted, fontSize: 11 }}>✕</button>
      </div>
    );
  }
  if (b.meet_link) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <a href={b.meet_link} target="_blank" rel="noreferrer" style={{ color: "#4F46E5", fontSize: 11, fontWeight: 700 }}>📹 Join</a>
        <button onClick={() => { setVal(b.meet_link); setEditing(true); }} style={{ fontSize: 10, background: C.goldLight, border: `1px solid ${C.border}`, borderRadius: 5, padding: "2px 7px", cursor: "pointer", fontWeight: 700, color: C.navy }}>✏️</button>
      </div>
    );
  }
  return (
    <button onClick={() => setEditing(true)} style={{ fontSize: 11, background: "#EEF2FF", border: "1.5px solid #818CF8", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontWeight: 700, color: "#4F46E5", whiteSpace: "nowrap" }}>
      + Add Link
    </button>
  );
}

// ── Desktop demo table row (with inline meet link editor) ─────
function DemoDesktopRow({ d, i, onStatusChange, onMeetLinkChange, updatingDemo }) {
  const [editingLink, setEditingLink] = useState(false);
  const [linkVal, setLinkVal]         = useState(d.meet_link || "");

  const saveLink = () => {
    onMeetLinkChange(d.id, linkVal);
    setEditingLink(false);
  };

  return (
    <tr
      style={{ borderBottom: `1.5px solid ${C.borderLight}`, transition: "background .15s" }}
      onMouseEnter={e => (e.currentTarget.style.background = C.goldPale)}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >
      <td style={{ padding: "12px 14px", color: "#ccc", fontWeight: 700 }}>{i + 1}</td>
      <td style={{ padding: "12px 14px", fontWeight: 800, color: C.navy, whiteSpace: "nowrap" }}>{d.name || "—"}</td>
      <td style={{ padding: "12px 14px", color: C.teal, fontWeight: 600 }}>{d.email || "—"}</td>
      <td style={{ padding: "12px 14px", fontWeight: 600, whiteSpace: "nowrap" }}>
        {d.preferred_slot ? (
          <span style={{ background: C.tealLight, color: "#0B7A70", fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 100 }}>
            {d.preferred_slot}
          </span>
        ) : "—"}
      </td>
      <td style={{ padding: "12px 14px", color: C.muted, fontWeight: 600, whiteSpace: "nowrap" }}>
        {d.desired_date || "—"}
      </td>
      <td style={{ padding: "12px 14px" }}>
        {d.english_level ? (
          <span style={{ background: "#EDE9FE", color: "#5B21B6", fontSize: 11, fontWeight: 800, padding: "3px 9px", borderRadius: 100 }}>
            {d.english_level}
          </span>
        ) : "—"}
      </td>
      <td style={{ padding: "12px 14px", fontWeight: 600 }}>
        {d.duration_mins ? `${d.duration_mins} min` : "10 min"}
      </td>
      <td style={{ padding: "12px 14px", minWidth: 180 }}>
        {editingLink ? (
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <input
              value={linkVal}
              onChange={e => setLinkVal(e.target.value)}
              placeholder="https://meet.google.com/..."
              style={{ flex: 1, padding: "4px 8px", border: `2px solid ${C.gold}`, borderRadius: 6, fontSize: 11, fontFamily: "'Nunito',sans-serif", fontWeight: 600, minWidth: 0 }}
            />
            <button onClick={saveLink} style={{ background: C.gold, border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontWeight: 800, color: C.navy, fontSize: 11, whiteSpace: "nowrap" }}>✓ Save</button>
            <button onClick={() => setEditingLink(false)} style={{ background: "#eee", border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer", color: C.muted, fontSize: 11 }}>✕</button>
          </div>
        ) : d.meet_link ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <a href={d.meet_link} target="_blank" rel="noreferrer" style={{ color: "#4F46E5", fontSize: 11, fontWeight: 700 }}>📹 Join</a>
            <button onClick={() => { setLinkVal(d.meet_link); setEditingLink(true); }} style={{ fontSize: 10, background: C.goldLight, border: `1px solid ${C.border}`, borderRadius: 5, padding: "2px 7px", cursor: "pointer", fontWeight: 700, color: C.navy }}>✏️</button>
          </div>
        ) : (
          <button onClick={() => setEditingLink(true)} style={{ fontSize: 11, background: "#EEF2FF", border: "1.5px solid #818CF8", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontWeight: 700, color: "#4F46E5", whiteSpace: "nowrap" }}>
            + Add Link
          </button>
        )}
      </td>
      <td style={{ padding: "12px 14px" }}>
        <StatusSelect
          value={d.status || "Pending"}
          options={DEMO_STATUSES}
          onChange={v => onStatusChange(d.id, v)}
          disabled={updatingDemo === d.id}
        />
        {updatingDemo === d.id && <span style={{ fontSize: 10, color: C.muted, marginLeft: 4 }}>⏳</span>}
      </td>
      <td style={{ padding: "12px 14px", color: C.muted, fontWeight: 600, whiteSpace: "nowrap" }}>
        {d.created_at ? new Date(d.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
      </td>
    </tr>
  );
}

// ── Main AdminPage ────────────────────────────────────────────
export default function AdminPage({ localBookings }) {
  const [authed,          setAuthed]          = useState(false);
  const [pass,            setPass]            = useState("");
  const [passErr,         setPassErr]         = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [dbStatus,        setDbStatus]        = useState("idle");
  const [filter,          setFilter]          = useState("all");
  const [search,          setSearch]          = useState("");
  const [activeTab,       setActiveTab]       = useState("bookings");
  const [demoSearch,      setDemoSearch]      = useState("");
  const [bookings,        setBookings]        = useState([]);
  const [demos,           setDemos]           = useState([]);
  const [updatingBooking, setUpdatingBooking] = useState(null);
  const [updatingDemo,    setUpdatingDemo]    = useState(null);

  // ── Auto-mark past confirmed bookings as Done ──────────────
  // Auto-mark bookings as Done when their date+slot is in the past
  const autoMarkDone = useCallback((list) => {
    const now = new Date();
    return list.map(b => {
      if (b.status !== "Confirmed") return b;
      // If we have a desired_date, check it + slot time
      const checkDate = b.desired_date || b.date;
      if (isSlotPast(b.slot, checkDate)) {
        // Fire async update to Supabase (best-effort)
        if (b.id) {
          supabase.updateBookingStatus(b.id, "Done").catch(() => {});
        }
        return { ...b, status: "Done" };
      }
      return b;
    });
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [bookingData, demoData] = await Promise.all([
        supabase.getBookings(),
        supabase.getDemoRequests(),
      ]);
      setBookings(autoMarkDone(bookingData || []));
      setDemos(demoData || []);
      setDbStatus("ok");
    } catch (err) {
      console.error(err);
      setBookings(autoMarkDone(localBookings));
      setDemos([]);
      setDbStatus("error");
    }
    setLoading(false);
  }, [localBookings, autoMarkDone]);

  useEffect(() => {
    if (authed) loadData();
  }, [authed, loadData]);

  // ── Status change handlers ─────────────────────────────────
  const handleBookingStatus = async (id, newStatus) => {
    setUpdatingBooking(id);
    // Optimistic update
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    try {
      await supabase.updateBookingStatus(id, newStatus);
    } catch (err) {
      console.error("Failed to update booking status:", err);
      // Revert on failure
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: b._prevStatus || b.status } : b));
      alert("⚠️ Failed to save status. Please try again.\n\n" + (err?.message || ""));
    }
    setUpdatingBooking(null);
  };

  const handleDemoStatus = async (id, newStatus) => {
    setUpdatingDemo(id);
    // Optimistic update
    setDemos(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
    try {
      await supabase.updateDemoStatus(id, newStatus);
    } catch (err) {
      console.error("Failed to update demo status:", err);
      alert("⚠️ Failed to save status. Please try again.\n\n" + (err?.message || ""));
    }
    setUpdatingDemo(null);
  };

  // ── Meet link update handler ───────────────────────────────
  const handleDemoMeetLink = async (id, meetLink) => {
    setDemos(prev => prev.map(d => d.id === id ? { ...d, meet_link: meetLink } : d));
    try {
      await supabase.update("demo_requests", id, { meet_link: meetLink });
    } catch (err) {
      console.error("Failed to update meet link:", err);
      alert("⚠️ Failed to save Meet link.\n\n" + (err?.message || ""));
    }
  };

  const handleBookingMeetLink = async (id, meetLink) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, meet_link: meetLink } : b));
    try {
      await supabase.update("bookings", id, { meet_link: meetLink });
    } catch (err) {
      console.error("Failed to update meet link:", err);
      alert("⚠️ Failed to save Meet link.\n\n" + (err?.message || ""));
    }
  };

  const login = () => {
    if (pass === import.meta.env.VITE_ADMIN_PASSWORD) { setAuthed(true); setPassErr(false); }
    else setPassErr(true);
  };

  const logout = () => {
    setAuthed(false); setPass(""); setPassErr(false);
    setBookings([]); setDemos([]); setDbStatus("idle");
  };

  // ── Login screen ──────────────────────────────────────────
  if (!authed) {
    return (
      <Card style={{ maxWidth: 400, margin: "0 auto", textAlign: "center", padding: "40px 32px" }}>
        <img
          src={IMG.logo} alt="Logo"
          style={{ width: 72, height: 72, objectFit: "contain", borderRadius: 14, marginBottom: 16, border: `3px solid ${C.border}` }}
        />
        <Title center size={22}>Admin Login</Title>
        <p style={{ color: C.muted, fontSize: 14, marginBottom: 24, fontWeight: 600 }}>
          Staff access only.
        </p>
        <Field label="Password" error={passErr ? "Incorrect password." : null}>
          <input
            type="password"
            value={pass}
            onChange={e => { setPass(e.target.value); setPassErr(false); }}
            onKeyDown={e => e.key === "Enter" && login()}
            placeholder="Enter admin password"
            style={iStyle}
          />
        </Field>
        <GoldBtn onClick={login} full large>Log In to Dashboard</GoldBtn>
      </Card>
    );
  }

  // ── Derived stats ─────────────────────────────────────────
  const confirmed    = bookings.filter(b => b.status === "Confirmed").length;
  const done         = bookings.filter(b => b.status === "Done").length;
  const pending      = bookings.filter(b => b.status === "Pending").length;
  const revenue      = bookings.reduce((s, b) => s + parseInt((b.amount || "0").replace("$", ""), 10), 0);
  const unique       = new Set(bookings.map(b => b.email)).size;
  const approvedDemo = demos.filter(d => d.status === "Approved Demo").length;
  const doneDemo     = demos.filter(d => d.status === "Done Demo").length;

  // ── Filtered bookings ─────────────────────────────────────
  const filtered = bookings.filter(b => {
    const matchFilter = filter === "all" || (b.status || "").toLowerCase() === filter.toLowerCase();
    const q = search.toLowerCase();
    const matchSearch = !q
      || (b.name    || "").toLowerCase().includes(q)
      || (b.email   || "").toLowerCase().includes(q)
      || (b.teacher || "").toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  // ── Filtered demos ────────────────────────────────────────
  const filteredDemos = demos.filter(d => {
    const q = demoSearch.toLowerCase();
    return !q
      || (d.name           || "").toLowerCase().includes(q)
      || (d.email          || "").toLowerCase().includes(q)
      || (d.preferred_slot || "").toLowerCase().includes(q)
      || (d.english_level  || "").toLowerCase().includes(q);
  });

  return (
    <div>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
        <div>
          <Eyebrow>Admin Portal</Eyebrow>
          <Title size={26}>Dashboard</Title>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <DbPill status={dbStatus} />
          <button
            onClick={loadData}
            style={{ background: C.goldLight, border: `2px solid ${C.border}`, borderRadius: 9, padding: "8px 12px", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer", color: C.navy }}
          >
            {loading ? "⏳" : "🔄"} Refresh
          </button>
          <SecBtn onClick={logout}>Log Out</SecBtn>
        </div>
      </div>

      {dbStatus === "error" && <SetupNotice />}

      {/* ── Stats row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 12, marginBottom: 22 }}>
        <StatCard icon="📚" label="Total Bookings"  value={bookings.length} color={C.navy}     />
        <StatCard icon="✅" label="Confirmed"        value={confirmed}       color="#0B7A70"    />
        <StatCard icon="✔️" label="Done"             value={done}            color="#5B21B6"    />
        <StatCard icon="⏳" label="Pending"          value={pending}         color={C.goldDark} />
        <StatCard icon="💰" label="Revenue"          value={`$${revenue}`}   color={C.navy}     />
        <StatCard icon="👥" label="Students"         value={unique}          color={C.teal}     />
        <StatCard icon="🎯" label="Demo Requests"    value={demos.length}    color={C.purple}   />
        <StatCard icon="🟢" label="Approved Demos"   value={approvedDemo}    color="#0B7A70"    />
        <StatCard icon="🏁" label="Done Demos"       value={doneDemo}        color="#5B21B6"    />
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        <TabBtn active={activeTab === "bookings"} onClick={() => setActiveTab("bookings")} badge={bookings.length}>
          📚 Student Bookings
        </TabBtn>
        <TabBtn active={activeTab === "demos"} onClick={() => setActiveTab("demos")} badge={demos.length}>
          🎯 Demo Requests
        </TabBtn>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* ── BOOKINGS TAB ── */}
      {/* ═══════════════════════════════════════════════════════ */}
      {activeTab === "bookings" && (
        <>
          {/* Search + filter bar */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Search students…"
              style={{ ...iStyle, maxWidth: 220, padding: "9px 12px", fontSize: 13 }}
            />
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["all", "Confirmed", "Pending", "Done", "Cancelled"].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    background:    filter === f ? C.gold : "#fff",
                    color:         filter === f ? C.navy : C.muted,
                    border:        `2px solid ${filter === f ? C.gold : C.border}`,
                    padding:       "7px 14px", borderRadius: 10,
                    fontFamily:    "'Nunito',sans-serif",
                    fontWeight:    700, fontSize: 12,
                    cursor:        "pointer", transition: "all .15s",
                  }}
                >
                  {f === "all" ? "All" : f}
                </button>
              ))}
            </div>
            <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Mobile cards */}
          <div className="mobile-only">
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: C.muted, fontWeight: 700 }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>⏳</div>Loading…
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: C.muted, fontWeight: 600 }}>
                No bookings found. 🔍
              </div>
            ) : (
              filtered.map((b, i) => (
                <BookingCard
                  key={b.id || i}
                  b={b}
                  onStatusChange={handleBookingStatus}
                  onMeetLinkChange={handleBookingMeetLink}
                  updating={updatingBooking}
                />
              ))
            )}
          </div>

          {/* Desktop table */}
          <Card pad={0} style={{ overflow: "hidden" }} className="desktop-only">
            <div style={{ overflowX: "auto" }}>
              {loading ? (
                <div style={{ textAlign: "center", padding: "48px 20px", color: C.muted, fontWeight: 700, fontSize: 15 }}>
                  <div style={{ fontSize: 32, marginBottom: 12, animation: "pulse 1s infinite" }}>⏳</div>
                  Loading bookings from Supabase…
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: C.navy }}>
                      {["#", "Student", "Email", "Teacher", "Schedule", "Level", "Package", "Amount", "Meet Link", "Status", "Date"].map(h => (
                        <th key={h} style={{
                          textAlign: "left", padding: "12px 14px",
                          fontSize: 10, textTransform: "uppercase",
                          letterSpacing: ".07em", color: C.gold,
                          fontWeight: 800, whiteSpace: "nowrap",
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={11} style={{ textAlign: "center", padding: "40px 20px", color: C.muted, fontWeight: 600, fontSize: 14 }}>
                          No bookings found. 🔍
                        </td>
                      </tr>
                    ) : (
                      filtered.map((b, i) => (
                        <tr
                          key={b.id || i}
                          style={{ borderBottom: `1.5px solid ${C.borderLight}`, transition: "background .15s" }}
                          onMouseEnter={e => (e.currentTarget.style.background = C.goldPale)}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          <td style={{ padding: "12px 14px", color: "#ccc", fontWeight: 700 }}>{i + 1}</td>
                          <td style={{ padding: "12px 14px", fontWeight: 800, color: C.navy, whiteSpace: "nowrap" }}>{b.name}</td>
                          <td style={{ padding: "12px 14px", color: C.teal, fontWeight: 600 }}>{b.email}</td>
                          <td style={{ padding: "12px 14px", fontWeight: 700, whiteSpace: "nowrap" }}>{b.teacher}</td>
                          <td style={{ padding: "12px 14px", fontWeight: 600, whiteSpace: "nowrap" }}>{b.slot}</td>
                          <td style={{ padding: "12px 14px" }}>
                            <span style={{ background: C.goldLight, color: C.goldDark, fontSize: 11, fontWeight: 800, padding: "3px 9px", borderRadius: 100, whiteSpace: "nowrap" }}>
                              {b.level}
                            </span>
                          </td>
                          <td style={{ padding: "12px 14px", fontWeight: 600 }}>{b.pkg}</td>
                          <td style={{ padding: "12px 14px", fontWeight: 800, color: C.goldDark }}>{b.amount}</td>
                          <td style={{ padding: "12px 14px", minWidth: 160 }}>
                            <BookingMeetLinkCell b={b} onMeetLinkChange={handleBookingMeetLink} />
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <StatusSelect
                              value={b.status || "Confirmed"}
                              options={BOOKING_STATUSES}
                              onChange={v => handleBookingStatus(b.id, v)}
                              disabled={updatingBooking === b.id}
                            />
                          </td>
                          <td style={{ padding: "12px 14px", color: C.muted, fontWeight: 600, whiteSpace: "nowrap" }}>
                            {b.desired_date || b.date || (b.created_at ? b.created_at.slice(0, 10) : "—")}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* ── DEMO REQUESTS TAB ── */}
      {/* ═══════════════════════════════════════════════════════ */}
      {activeTab === "demos" && (
        <>
          {/* Demo mini stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 12, marginBottom: 18 }}>
            <StatCard icon="🎯" label="Total Requests" value={demos.length}  color={C.purple}  />
            <StatCard icon="🟢" label="Approved"        value={approvedDemo}  color="#0B7A70"   />
            <StatCard icon="🏁" label="Done"            value={doneDemo}      color="#5B21B6"   />
            <StatCard icon="👤" label="Unique Emails"
              value={new Set(demos.map(d => d.email)).size}
              color={C.navy}
            />
          </div>

          {/* Demo search bar */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
            <input
              value={demoSearch}
              onChange={e => setDemoSearch(e.target.value)}
              placeholder="🔍 Search demo requests…"
              style={{ ...iStyle, maxWidth: 260, padding: "9px 12px", fontSize: 13 }}
            />
            <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>
              {filteredDemos.length} result{filteredDemos.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Mobile demo cards */}
          <div className="mobile-only">
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: C.muted, fontWeight: 700 }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>⏳</div>Loading…
              </div>
            ) : filteredDemos.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: C.muted, fontWeight: 600 }}>
                No demo requests found. 🔍
              </div>
            ) : (
              filteredDemos.map((d, i) => (
                <DemoCard
                  key={d.id || i}
                  d={d}
                  onStatusChange={handleDemoStatus}
                  onMeetLinkChange={handleDemoMeetLink}
                  updating={updatingDemo}
                />
              ))
            )}
          </div>

          {/* Desktop demo table */}
          <Card pad={0} style={{ overflow: "hidden" }} className="desktop-only">
            <div style={{ overflowX: "auto" }}>
              {loading ? (
                <div style={{ textAlign: "center", padding: "48px 20px", color: C.muted, fontWeight: 700, fontSize: 15 }}>
                  <div style={{ fontSize: 32, marginBottom: 12, animation: "pulse 1s infinite" }}>⏳</div>
                  Loading demo requests from Supabase…
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: C.navy }}>
                      {["#", "Name", "Email", "Preferred Slot", "Desired Date", "Level", "Duration", "Meet Link", "Status", "Submitted On"].map(h => (
                        <th key={h} style={{
                          textAlign: "left", padding: "12px 14px",
                          fontSize: 10, textTransform: "uppercase",
                          letterSpacing: ".07em", color: C.gold,
                          fontWeight: 800, whiteSpace: "nowrap",
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDemos.length === 0 ? (
                      <tr>
                        <td colSpan={10} style={{ textAlign: "center", padding: "40px 20px", color: C.muted, fontWeight: 600, fontSize: 14 }}>
                          No demo requests found. 🔍
                        </td>
                      </tr>
                    ) : (
                      filteredDemos.map((d, i) => (
                        <DemoDesktopRow
                          key={d.id || i}
                          d={d} i={i}
                          onStatusChange={handleDemoStatus}
                          onMeetLinkChange={handleDemoMeetLink}
                          updatingDemo={updatingDemo}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </>
      )}

    </div>
  );
}