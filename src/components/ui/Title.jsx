import C from "../../styles/theme";

export default function Title({ children, light = false, center = false, size = 34 }) {
  return (
    <div style={{
      fontFamily: "'Baloo 2',cursive",
      fontSize:   size,
      fontWeight: 900,
      lineHeight: 1.12,
      color:      light ? "#fff" : C.navy,
      textAlign:  center ? "center" : "left",
      margin:     "10px 0",
    }}>
      {children}
    </div>
  );
}
