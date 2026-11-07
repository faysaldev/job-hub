import { ImageResponse } from "next/og";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", background: "#f6f8fb", display: "flex", flexDirection: "column", justifyContent: "center", padding: "90px", color: "#162839", fontFamily: "sans-serif" }}>
    <div style={{ display: "flex", gap: "14px", alignItems: "center", fontSize: "38px", fontWeight: 700, color: "#163b5c" }}><div style={{ width: 40, height: 40, borderRadius: 10, background: "#163b5c" }} />JobHub</div>
    <div style={{ display: "flex", fontSize: "65px", fontWeight: 700, lineHeight: 1.15, marginTop: "50px", letterSpacing: "-2px" }}>Find jobs. Build your next chapter.</div>
    <div style={{ fontSize: "27px", color: "#516c83", marginTop: "28px" }}>A better way to search and hire.</div>
  </div>, size);
}
