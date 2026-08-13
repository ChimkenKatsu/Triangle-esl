import C from "../../styles/theme";

export default function Subtitle({ children, light = false, center = false }) {
  return (
    <p style={{
      fontSize:   15,
      lineHeight: 1.78,
      fontWeight: 600,
      color:      light ? "rgba(255,255,255,.62)" : C.muted,
      textAlign:  center ? "center" : "left",
      maxWidth:   center ? 540 : "none",
      margin:     center ? "0 auto" : 0,
    }}>
      {children}
    </p>
  );
}
