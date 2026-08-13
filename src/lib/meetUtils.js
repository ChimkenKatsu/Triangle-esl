import emailjs from "@emailjs/browser";

// ── EmailJS Credentials ────────────────────────────────────────
// These MUST come from a .env file (see .env.example) with the
// VITE_ prefix, and must also be set as Environment Variables on
// your host (Vercel/Netlify/etc) for production builds — Vite only
// bakes in the vars that exist at BUILD time.
//   VITE_EMAILJS_SERVICE_ID  → EmailJS dashboard → Email Services
//   VITE_EMAILJS_TEMPLATE_ID → EmailJS dashboard → Email Templates
//   VITE_EMAILJS_PUBLIC_KEY  → EmailJS dashboard → Account → General
//     (this is the PUBLIC key, safe for the browser — never use the
//     private key here)
const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

// Initialize once with the public key (recommended @emailjs/browser
// v4 pattern) instead of passing it into every .send() call.
if (PUBLIC_KEY) {
  emailjs.init({ publicKey: PUBLIC_KEY });
}

function missingEmailjsConfig() {
  const missing = [];
  if (!SERVICE_ID)  missing.push("VITE_EMAILJS_SERVICE_ID");
  if (!TEMPLATE_ID) missing.push("VITE_EMAILJS_TEMPLATE_ID");
  if (!PUBLIC_KEY)  missing.push("VITE_EMAILJS_PUBLIC_KEY");
  return missing;
}

// ── Format a date nicely for email ───────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// ── Core EmailJS sender ────────────────────────────────────────
async function sendEmail({ to_email, to_name, subject, message }) {
  const missing = missingEmailjsConfig();
  if (missing.length) {
    console.warn(
      `[EmailJS] Skipped sending to ${to_email} — missing env var(s): ${missing.join(", ")}.\n` +
      `Add them to your .env file (see .env.example) AND to your hosting ` +
      `provider's Environment Variables, then redeploy. ` +
      `Get the public key from https://dashboard.emailjs.com/admin/account`
    );
    return; // Don't throw — a missing email config should never block a booking.
  }

  console.log("[EmailJS] Sending to:", to_email);
  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      to_email,
      to_name,
      subject,
      message,
      meet_link: "",          // No auto-generated link anymore
      email:         to_email,
      name:          to_name,
      title:         subject,
      student_email: to_email,
    });
  } catch (err) {
    console.error("[EmailJS] Send failed:", err?.text || err?.message || err);
    // Swallow the error so a booking never fails just because email did.
  }
}

// ── Booking confirmation emails ────────────────────────────────
export async function sendBookingEmails({
  studentName, studentEmail, teacher, slot, pkg, amount, desiredDate,
}) {
  const dateLabel = formatDate(desiredDate);

  // Email to student — payment pending verification, no Meet link yet
  await sendEmail({
    to_email:  studentEmail,
    to_name:   studentName,
    subject:   "Your Triangle ESL Booking is Received!",
    message:
      `Hi ${studentName},\n\n` +
      `We've received your booking! Here are your details:\n\n` +
      `📅 Date: ${dateLabel}\n` +
      `⏰ Time: ${slot}\n` +
      `👨‍🏫 Teacher: ${teacher}\n` +
      `📦 Package: ${pkg}\n` +
      `💳 Amount Due: ${amount} (via PayPal)\n\n` +
      `💰 Payment:\n` +
      `Your class will be confirmed once we verify your PayPal payment. If you haven't paid yet, please send ${amount} via PayPal to ${ADMIN_EMAIL || "our PayPal account"}.\n\n` +
      `🎥 Google Meet Link:\n` +
      `Our admin will send you the Google Meet link to this email address once payment is verified.\n\n` +
      `If you have any questions, reply to this email or contact us on Facebook: facebook.com/triangleesl\n\n` +
      `– Triangle ESL Team`,
  });

  // Email to admin — action required: verify PayPal payment + send Meet link
  await sendEmail({
    to_email:  ADMIN_EMAIL,
    to_name:   "Triangle ESL Admin",
    subject:   `New Booking (Payment Pending) – ${studentName}`,
    message:
      `New booking received!\n\n` +
      `Student: ${studentName}\n` +
      `Email: ${studentEmail}\n` +
      `Teacher: ${teacher}\n` +
      `Date: ${dateLabel}\n` +
      `Time: ${slot}\n` +
      `Package: ${pkg}\n` +
      `Amount: ${amount}\n\n` +
      `⚠️ ACTION REQUIRED:\n` +
      `1. Check PayPal for a payment of ${amount} from ${studentEmail} (or matching the student name).\n` +
      `2. Once verified, create a Google Meet session and send the link directly to:\n` +
      `${studentEmail}`,
  });
}

// ── Demo confirmation emails ───────────────────────────────────
export async function sendDemoEmails({
  studentName, studentEmail, slot, level, desiredDate,
}) {
  const dateLabel = formatDate(desiredDate);

  // Email to student — no Meet link yet
  await sendEmail({
    to_email:  studentEmail,
    to_name:   studentName,
    subject:   "Your Free 10-Minute Demo is Booked! – Triangle ESL",
    message:
      `Hi ${studentName},\n\n` +
      `Your FREE 10-minute demo class has been booked! 🎉\n\n` +
      `📅 Date: ${dateLabel}\n` +
      `⏰ Time: ${slot}\n` +
      `🎯 English Level: ${level}\n` +
      `⏱  Duration: 10 minutes\n\n` +
      `🎥 Google Meet Link:\n` +
      `Our admin team will send you the Google Meet link to this email address before your session starts.\n\n` +
      `If you have any questions, reply to this email or message us on Facebook: facebook.com/triangleesl\n\n` +
      `– Triangle ESL Team`,
  });

  // Email to admin — action required
  await sendEmail({
    to_email:  ADMIN_EMAIL,
    to_name:   "Triangle ESL Admin",
    subject:   `New Demo Request – ${studentName}`,
    message:
      `New DEMO REQUEST received!\n\n` +
      `Student: ${studentName}\n` +
      `Email: ${studentEmail}\n` +
      `Date: ${dateLabel}\n` +
      `Time: ${slot}\n` +
      `Level: ${level}\n\n` +
      `⚠️ ACTION REQUIRED:\n` +
      `Please create a Google Meet session and send the link directly to:\n` +
      `${studentEmail}`,
  });
}