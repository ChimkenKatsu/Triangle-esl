import C from "../../styles/theme";

export default function Card({ children, style: st = {}, pad = 36 }) {
  return (
    <div style={{
      background:   "#fff",
      border:       `2px solid ${C.border}`,
      borderRadius: 22,
      padding:      pad,
      boxShadow:    "0 2px 18px rgba(14,24,41,.06)",
      ...st,
    }}>
      {children}
    </div>
  );
}
