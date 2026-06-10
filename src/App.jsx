import { useState, useEffect } from "react";
  import Navbar      from "./components/layout/Navbar";
  import Footer      from "./components/layout/Footer";
  import DemoModal   from "./components/sections/DemoModal";
  import HomePage    from "./pages/HomePage";
  import TeachersPage from "./pages/TeachersPage";
  import PricingPage  from "./pages/PricingPage";
  import BookingPage  from "./pages/BookingPage";
  import AdminPage    from "./pages/AdminPage";
  import { FALLBACK_BOOKINGS } from "./data/constants";

  const ADMIN_SECRET = "staff-portal-t7r2m";

  export default function App() {
    // ── Routing ──
    const [page, setPage] = useState("home");

    // ── Shared state ──
    const [showDemo,      setShowDemo]      = useState(false);
    const [bookingTeacher, setBookingTeacher] = useState("");
    const [localBookings,  setLocalBookings]  = useState(FALLBACK_BOOKINGS);

    // ── Check for secret admin hash on load and hash change ──
    useEffect(() => {
      const check = () => {
        const hash = window.location.hash.replace("#", "");
        if (hash === ADMIN_SECRET) {
          setPage("admin");
        }
      };
      check();
      window.addEventListener("hashchange", check);
      return () => window.removeEventListener("hashchange", check);
    }, []);

    // Navigate and scroll to top
    const go = (p) => {
      setPage(p);
      // Clear the secret hash when navigating away from admin
      if (p !== "admin") window.location.hash = "";
      window.scrollTo(0, 0);
    };

    // "Book this teacher" — pre-fills teacher on booking page
    const onBookTeacher = (name) => {
      setBookingTeacher(name);
      go("booking");
    };

    // Called by BookingPage after a booking is saved
    const onNewBooking = (record) => {
      setLocalBookings(prev => [{ ...record, id: prev.length + 1 }, ...prev]);
    };

    return (
      <div style={{ fontFamily: "'Nunito','Segoe UI',sans-serif", background: "#FFFCF0", minHeight: "100vh", overflowX: "hidden", maxWidth: "100vw" }}>

        {/* ── Navigation ── */}
        <Navbar page={page} go={go} onDemo={() => setShowDemo(true)} />

        {/* ── Page content ── */}
        <main style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(12px,4vw,24px)" }}>

          {page === "home"     && <HomePage    go={go} onDemo={() => setShowDemo(true)} />}
          {page === "teachers" && <TeachersPage onBook={onBookTeacher} />}
          {page === "pricing"  && <PricingPage  go={go} />}
          {page === "booking"  && (
            <div style={{ paddingTop: 40, paddingBottom: 16 }}>
              <div style={{ textAlign: "center", marginBottom: 40 }}>
                <span style={{ display:"inline-block", background:"#FFF0C8", color:"#B87200", fontSize:11, fontWeight:800, padding:"4px 14px", borderRadius:100, letterSpacing:".08em", textTransform:"uppercase" }}>
                  Enroll Now
                </span>
                <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:38, fontWeight:900, color:"#0E1829", margin:"10px 0" }}>
                  Book a Class
                </div>
                <p style={{ fontSize:15, color:"#7A8599", fontWeight:600 }}>
                  Complete the 4 quick steps below. Takes less than 3 minutes!
                </p>
              </div>
              <BookingPage prefill={bookingTeacher} onNewBooking={onNewBooking} />
            </div>
          )}
          {page === "admin" && (
            <div style={{ paddingTop: 40, paddingBottom: 16 }}>
              <div style={{ textAlign: "center", marginBottom: 36 }}>
                <span style={{ display:"inline-block", background:"#FFF0C8", color:"#B87200", fontSize:11, fontWeight:800, padding:"4px 14px", borderRadius:100, letterSpacing:".08em", textTransform:"uppercase" }}>
                  Staff Only
                </span>
                <div style={{ fontFamily:"'Baloo 2',cursive", fontSize:38, fontWeight:900, color:"#0E1829", margin:"10px 0" }}>
                  Admin Dashboard
                </div>
                <p style={{ fontSize:15, color:"#7A8599", fontWeight:600 }}>
                </p>
              </div>
              <AdminPage localBookings={localBookings} />
            </div>
          )}

        </main>

        {/* ── Footer ── */}
        <Footer go={go} />

        {/* ── Demo modal (global, triggered from navbar or hero) ── */}
        {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}

      </div>
    );
  }