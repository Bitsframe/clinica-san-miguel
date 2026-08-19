import { ImageResponse } from "next/og";

export const runtime = "edge";

const MAX_TITLE = 90;

/**
 * Dynamic Open Graph card.
 *
 * Query params (all optional):
 *   title   - page-specific headline; falls back to the brand name
 *   locale  - "es" switches the tagline/strapline to Spanish
 *
 * Rendered at the 1200x630 Open Graph standard. Pages declare matching
 * og:image:width/height so scrapers (notably WhatsApp) can lay out the
 * preview without fetching the bytes first.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const isEs = searchParams.get("locale") === "es";
  const rawTitle = (searchParams.get("title") || "").trim();
  const title =
    rawTitle.length > MAX_TITLE ? `${rawTitle.slice(0, MAX_TITLE - 1)}…` : rawTitle;

  const brand = isEs ? "Clínica San Miguel" : "Clinica San Miguel";
  const tagline = isEs
    ? "Medicina Familiar Asequible en Texas"
    : "Affordable Family Medicine in Texas";
  const strapline = isEs
    ? "Consultas desde $19 · Sin cita previa"
    : "Office visits from $19 · Walk-ins welcome";

  // With a page title, the brand becomes the eyebrow and the title leads.
  const headline = title || brand;
  const eyebrow = title ? brand : null;
  const headlineSize = headline.length > 46 ? 52 : headline.length > 28 ? 64 : 76;

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
            justifyContent: "center",
            padding: "56px 88px",
            margin: "0 56px",
            border: "10px solid #C1001F",
            borderRadius: "24px",
          }}
        >
          {eyebrow ? (
            <div
              style={{
                fontSize: 26,
                fontWeight: 600,
                color: "#C1001F",
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 18,
                textAlign: "center",
              }}
            >
              {eyebrow}
            </div>
          ) : null}

          <div
            style={{
              fontSize: headlineSize,
              fontWeight: 700,
              color: "#19192C",
              textAlign: "center",
              lineHeight: 1.12,
            }}
          >
            {headline}
          </div>

          <div
            style={{
              marginTop: 26,
              width: 120,
              height: 8,
              backgroundColor: "#C1001F",
              borderRadius: 4,
            }}
          />

          {!title ? (
            <div
              style={{
                marginTop: 26,
                fontSize: 34,
                color: "#3D3D3C",
                textAlign: "center",
              }}
            >
              {tagline}
            </div>
          ) : null}

          <div
            style={{
              marginTop: 16,
              fontSize: 28,
              color: "#C1001F",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            {strapline}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
