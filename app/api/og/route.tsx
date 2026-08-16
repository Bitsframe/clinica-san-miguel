import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "64px 96px",
            border: "10px solid #C1001F",
            borderRadius: "24px",
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#19192C",
              textAlign: "center",
              lineHeight: 1.1,
            }}
          >
            Clinica San Miguel
          </div>
          <div
            style={{
              marginTop: 28,
              width: 120,
              height: 8,
              backgroundColor: "#C1001F",
              borderRadius: 4,
            }}
          />
          <div
            style={{
              marginTop: 28,
              fontSize: 34,
              color: "#3D3D3C",
              textAlign: "center",
            }}
          >
            Affordable Family Medicine in Texas
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 28,
              color: "#C1001F",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            Office visits starting at $19 · Walk-ins welcome
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
