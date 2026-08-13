import C from "../../styles/theme";

export default function Field({ label, error, children, half = false }) {
  return (
    <div style={{ marginBottom: 16, gridColumn: half ? "span 1" : "span 2" }}>
      <label style={{
        display: "block", fontSize: 11, fontWeight: 800,
        textTransform: "uppercase", letterSpacing: ".07em",
        color: C.muted, marginBottom: 6,
      }}>
        {label}
      </label>
      {children}
      {error && (
        <span style={{ color: "#E04040", fontSize: 12, fontWeight: 700, display: "block", marginTop: 4 }}>
          ⚠ {error}
        </span>
      )}
    </div>
  );
}
