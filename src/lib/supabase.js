// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  SUPABASE CONFIG
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SUPABASE_URL      = "https://csetnjpmycctsdkdudqh.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzZXRuanBteWNjdHNka2R1ZHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNzU1NjYsImV4cCI6MjA5NTg1MTU2Nn0.9T3K7Up0nW98JUl4lmALeE3OBGDn1ZlLfE0iM-uK7lc";

// ── Google Meet Link Generator ────────────────────────────────
export function generateMeetLink() {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const seg = (n) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `https://meet.google.com/${seg(3)}-${seg(4)}-${seg(3)}`;
}

// ── Email Notification via Supabase Edge Function ─────────────
export async function sendMeetEmail({ to, studentName, meetLink, slot, type, adminEmail }) {
  try {
    const r = await fetch(`${SUPABASE_URL}/functions/v1/send-meet-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ to, studentName, meetLink, slot, type, adminEmail }),
    });
    return r.ok;
  } catch {
    console.info(`[Meet Email] Would send to ${to} and ${adminEmail}:`, { meetLink, slot, type });
    return false;
  }
}

const supabase = {
  _url: SUPABASE_URL,
  _key: SUPABASE_ANON_KEY,

  // FIX: Added "Content-Type" header — required for POST/PATCH bodies
  _headers() {
    return {
      "Content-Type":  "application/json",
      "apikey":        this._key,
      "Authorization": `Bearer ${this._key}`,
    };
  },

  async select(table, { search = "", filter = "all" } = {}) {
    // FIX: Use correct PostgREST column filter syntax (status=eq.value)
    let url = `${this._url}/rest/v1/${table}?select=*&order=id.desc`;
    if (search) url += `&or=(name.ilike.*${encodeURIComponent(search)}*,email.ilike.*${encodeURIComponent(search)}*)`;
    if (filter && filter !== "all") url += `&status=eq.${encodeURIComponent(filter)}`;
    const r = await fetch(url, { headers: this._headers() });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },

  async insert(table, data) {
    const r = await fetch(`${this._url}/rest/v1/${table}`, {
      method: "POST",
      headers: { ...this._headers(), Prefer: "return=representation" },
      body: JSON.stringify(data),
    });
    if (!r.ok) {
      const errText = await r.text();
      throw new Error(`Supabase insert failed (${r.status}): ${errText}`);
    }
    return r.json();
  },

  async update(table, id, data) {
    const r = await fetch(`${this._url}/rest/v1/${table}?id=eq.${id}`, {
      method: "PATCH",
      headers: { ...this._headers(), Prefer: "return=representation" },
      body: JSON.stringify(data),
    });
    if (!r.ok) {
      const errText = await r.text();
      throw new Error(`Supabase update failed (${r.status}): ${errText}`);
    }
    return r.json();
  },

  async insertBooking(data)              { return this.insert("bookings", data); },
  async getBookings()                    { return this.select("bookings"); },
  async updateBookingStatus(id, status)  { return this.update("bookings", id, { status }); },

  async insertDemo(data)                 { return this.insert("demo_requests", data); },
  async getDemoRequests()                { return this.select("demo_requests"); },
  async updateDemoStatus(id, status)     { return this.update("demo_requests", id, { status }); },

  async getDashboardData() {
    const [bookings, demos] = await Promise.all([this.getBookings(), this.getDemoRequests()]);
    return { bookings, demos };
  },
};

export default supabase;