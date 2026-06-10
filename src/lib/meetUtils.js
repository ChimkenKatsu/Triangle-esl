import emailjs from "@emailjs/browser";

// ── EmailJS Credentials ────────────────────────────────────────
const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

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
  console.log("[EmailJS] Sending to:", to_email);
  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      to_email,
      to_name,
      subject,
      message,
      meet_link: "",          // No auto-generated link anymore
      email:         to_email,
      name:          to_name,
      title:         subject,
      student_email: to_email,
    },
    PUBLIC_KEY
  );
}

// ── Booking confirmation emails ────────────────────────────────
export async function sendBookingEmails({
  studentName, studentEmail, teacher, slot, pkg, amount, desiredDate,
}) {
  const dateLabel = formatDate(desiredDate);

  // Email to student — no Meet link yet, admin will send it manually
  await sendEmail({
    to_email:  studentEmail,
    to_name:   studentName,
    subject:   "Your Triangle ESL Class is Confirmed!",
    message:
      `Hi ${studentName},\n\n` +
      `Your class has been confirmed! Here are your details:\n\n` +
      `📅 Date: ${dateLabel}\n` +
      `⏰ Time: ${slot}\n` +
      `👨‍🏫 Teacher: ${teacher}\n` +
      `📦 Package: ${pkg}\n` +
      `💳 Amount: ${amount}\n\n` +
      `🎥 Google Meet Link:\n` +
      `Our admin will send you the Google Meet link to this email address before your session starts.\n\n` +
      `If you have any questions, reply to this email or contact us on Facebook: facebook.com/triangleesl\n\n` +
      `– Triangle ESL Team`,
  });

  // Email to admin — action required to send Meet link
  await sendEmail({
    to_email:  ADMIN_EMAIL,
    to_name:   "Triangle ESL Admin",
    subject:   `New Booking – ${studentName}`,
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
      `Please create a Google Meet session and send the link directly to:\n` +
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