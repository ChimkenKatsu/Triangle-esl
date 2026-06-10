// ── Time Slots ────────────────────────────────────────────────
export const SLOTS = [
  "Mon 8:00 AM",  "Mon 10:00 AM", "Mon 2:00 PM",  "Mon 5:00 PM",  "Mon 7:00 PM",
  "Tue 8:00 AM",  "Tue 10:00 AM", "Tue 2:00 PM",  "Tue 6:00 PM",  "Tue 8:00 PM",
  "Wed 9:00 AM",  "Wed 11:00 AM", "Wed 3:00 PM",  "Wed 5:00 PM",  "Wed 7:00 PM",
  "Thu 8:00 AM",  "Thu 10:00 AM", "Thu 4:00 PM",  "Thu 7:00 PM",
  "Fri 9:00 AM",  "Fri 11:00 AM", "Fri 1:00 PM",  "Fri 5:00 PM",  "Fri 7:00 PM",
  "Sat 9:00 AM",  "Sat 11:00 AM", "Sat 2:00 PM",  "Sat 4:00 PM",
  "Sun 10:00 AM", "Sun 1:00 PM",  "Sun 3:00 PM",
];

// ── English Levels ────────────────────────────────────────────
export const LEVELS = [
  "Beginner (A1)",
  "Elementary (A2)",
  "Pre-Intermediate (B1)",
  "Intermediate (B2)",
  "Upper-Intermediate (C1)",
  "Advanced (C2)",
];

// ── FAQ Items ─────────────────────────────────────────────────
export const FAQS = [
  { q: "How long is each class?",   a: "Each session is 50 minutes. Free demo classes are 10 minutes with no payment required." },
  { q: "What platform do you use?", a: "We use Google Meet. A link is automatically generated and emailed to you after booking." },
  { q: "Can I choose my teacher?",  a: "Yes! You can select your preferred teacher during booking, or let us match you with the best fit." },
  { q: "Is there a free trial?",    a: "Absolutely! Book a free demo class — no commitment, no payment, just great English." },
  { q: "What ages do you teach?",   a: "We welcome all ages — young learners (age 4+), teens, adults, and seniors." },
  { q: "How do I reschedule?",      a: "Contact us at least 24 hours before your class via email or Facebook Messenger to reschedule." },
];

// ── Demo / Seed Bookings (fallback when Supabase not connected) ─
export const FALLBACK_BOOKINGS = [
  { id:1, name:"Kenji Tanaka",    email:"kenji@example.com",   teacher:"Teacher Yarrah",    slot:"Mon 10:00 AM", level:"Intermediate (B2)",       pkg:"15 Classes", amount:"$39.99", status:"Confirmed", date:"2026-06-10" },
  { id:2, name:"Park Ji-yeon",   email:"jiyeon@example.com",  teacher:"Teacher Wia",       slot:"Wed 9:00 AM",  level:"Pre-Intermediate (B1)",   pkg:"Single Class", amount:"$3",  status:"Confirmed", date:"2026-06-12" },
  { id:3, name:"Wang Mei",       email:"wangmei@example.com", teacher:"Teacher Vithyanne", slot:"Sat 11:00 AM", level:"Beginner (A1)",           pkg:"30 Classes",   amount:"$69.99", status:"Pending", date:"2026-06-15" },
  { id:4, name:"Nguyen Thi Lan", email:"lan@example.com",     teacher:"Teacher Yarrah",    slot:"Fri 5:00 PM",  level:"Upper-Intermediate (C1)", pkg:"15 Classes",   amount:"$39.99", status:"Confirmed", date:"2026-06-17" },
  { id:5, name:"Aiko Yamamoto",  email:"aiko@example.com",    teacher:"Teacher Wia",       slot:"Tue 8:00 AM",  level:"Elementary (A2)",         pkg:"30 Classes",   amount:"$69.99", status:"Confirmed", date:"2026-06-18" },
];

// ── Contact Info ──────────────────────────────────────────────
export const CONTACT = {
  address:  "MEA Bldg., Saray-Tibanga, Iligan City, Philippines 9200",
  phone:    "0997 762 2717",
  email:    "triangle.esidivision@gmail.com",
  facebook: "facebook.com/triangleesl",
};