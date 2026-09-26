import { ImageResponse } from "next/og";
import { layers } from "@/content/career";
import { site } from "@/content/site";

/**
 * The link-preview card (LinkedIn, Slack, iMessage, X…). Built from the site's
 * own tokens and statement: the hero's connection — a square origin, a copper
 * line, a terminal — above the headline. Static; rendered at build time.
 */

export const alt = `${site.name} — ${site.statement}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const color = {
  background: "#1e1e1b",
  foreground: "#ecebe5",
  muted: "#9b988e",
  border: "#4c4b44",
  accent: "#e3733d",
  technical: "#86958f",
};

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: color.background,
          color: color.foreground,
        }}
      >
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 6, color: color.technical }}>
          {site.name.toUpperCase()}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 48 }}>
            <div style={{ width: 16, height: 16, background: color.accent }} />
            <div style={{ width: 520, height: 2, background: color.accent }} />
            <div style={{ width: 14, height: 14, borderRadius: 7, background: color.accent }} />
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: -3,
              maxWidth: 900,
            }}
          >
            {site.statement}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: `1px solid ${color.border}`,
            paddingTop: 28,
            fontSize: 24,
            color: color.muted,
          }}
        >
          <span>{layers.join(" → ")}</span>
          <span style={{ color: color.foreground }}>{new URL(site.url).host}</span>
        </div>
      </div>
    ),
    size,
  );
}
