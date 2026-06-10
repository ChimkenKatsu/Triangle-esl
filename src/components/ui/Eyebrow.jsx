import C from "../../styles/theme";

export default function Eyebrow({ children, light = false }) {
  return (
    <span style={{
      display: "inline-block",
      background: light ? "rgba(245,166,35,.2)" : C.goldLight,
      color:      light ? C.gold : C.goldDark,
      fontSize: 11, fontWeight: 800,
      padding: "4px 14px", borderRadius: 100,
      letterSpacing: ".08em", textTransform: "uppercase",
    }}>
      {children}
    </span>
  );
}
