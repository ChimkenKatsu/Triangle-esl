import { useState, useEffect } from "react";

/** Animated count-up number */
export default function Counter({ end, suffix = "" }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let n = 0;
    const step = Math.ceil(end / 55);
    const t = setInterval(() => {
      n = Math.min(n + step, end);
      setV(n);
      if (n >= end) clearInterval(t);
    }, 22);
    return () => clearInterval(t);
  }, [end]);
  return <>{v}{suffix}</>;
}
