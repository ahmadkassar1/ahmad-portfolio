import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#111110",
          color: "#f2f0ea",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 9999,
              background: "#4d7cff",
            }}
          />
          <div
            style={{
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#8e8b81",
            }}
          >
            Ahmad Kassar
          </div>
        </div>

        <div
          style={{
            fontSize: 76,
            fontWeight: 600,
            letterSpacing: -2,
            lineHeight: 1.08,
            maxWidth: 950,
            display: "flex",
          }}
        >
          Interfaces that run the business.
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            color: "#a8a59a",
          }}
        >
          <div>Frontend Developer — Angular · React · Next.js</div>
          <div style={{ color: "#7396ff" }}>Beirut, Lebanon</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
