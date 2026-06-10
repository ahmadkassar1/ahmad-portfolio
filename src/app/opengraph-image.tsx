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
          background: "#faf9f7",
          color: "#1a1c21",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 9999,
              background: "#12399a",
            }}
          />
          <div
            style={{
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#83878f",
            }}
          >
            Ahmad Kassar
          </div>
        </div>

        <div
          style={{
            fontSize: 72,
            fontWeight: 600,
            letterSpacing: -2,
            lineHeight: 1.12,
            maxWidth: 980,
          }}
        >
          Building the front end of software that runs real businesses.
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            color: "#4b4f57",
          }}
        >
          <div>Frontend Developer — Angular · React · Next.js</div>
          <div style={{ color: "#12399a" }}>Beirut, Lebanon</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
