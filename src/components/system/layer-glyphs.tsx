import type { SystemLayer } from "@/content/types";

/**
 * Technical drawings for the career layers. Each glyph lives in a 200×120
 * box and the "wire" always enters at (0,60) and leaves at (200,60), so
 * glyphs can be chained into one continuous line — a wire becomes a
 * drawing becomes a ladder rung becomes a data path.
 */

export const GLYPH_W = 200;
export const GLYPH_H = 120;

type GlyphLayer = Extract<SystemLayer, "electrical" | "mechanical" | "controls" | "software">;

const label = { fontSize: 9, letterSpacing: "0.1em" } as const;

function Electrical() {
  const outlet = (cy: number) => (
    <g key={cy}>
      <rect x={87} y={cy - 9} width={3.5} height={10} />
      <rect x={109.5} y={cy - 10} width={3.5} height={12} />
      <path d={`M97 ${cy + 5} h6 v3 a3 3 0 0 1 -6 0 z`} />
    </g>
  );
  return (
    <g data-glyph="electrical">
      <path d="M0 60 H60" className="stroke-accent" strokeWidth={2} />
      <path d="M140 60 H200" className="stroke-accent" strokeWidth={2} />
      <rect x={60} y={18} width={80} height={84} rx={6} strokeWidth={1.5} />
      {outlet(42)}
      {outlet(80)}
      <circle cx={100} cy={61} r={2} />
      <text x={60} y={12} className="fill-technical stroke-none font-mono" style={label}>
        15A · 120V
      </text>
    </g>
  );
}

function Mechanical() {
  return (
    <g data-glyph="mechanical">
      <path d="M0 60 H200" strokeDasharray="14 4 2 4" strokeWidth={0.9} />
      <path d="M100 20 V100" strokeDasharray="14 4 2 4" strokeWidth={0.9} />
      <rect x={50} y={32} width={100} height={56} strokeWidth={1.75} />
      <circle cx={100} cy={60} r={14} strokeWidth={1.5} />
      {/* dimension */}
      <path d="M50 30 V12 M150 30 V12" strokeWidth={0.75} />
      <path d="M50 16 H150" strokeWidth={0.75} />
      <path d="M50 16 l6 -2.5 v5 z M150 16 l-6 -2.5 v5 z" className="fill-technical" stroke="none" />
      <text x={100} y={10} textAnchor="middle" className="fill-technical stroke-none font-mono" style={label}>
        4.000
      </text>
      <text x={120} y={108} className="fill-technical stroke-none font-mono" style={label}>
        Ø1.125
      </text>
    </g>
  );
}

function Controls() {
  return (
    <g data-glyph="controls">
      <path d="M8 18 V102 M192 18 V102" strokeWidth={1.75} />
      <path d="M0 60 H8 M192 60 H200" />
      <path d="M8 60 H46 M60 60 H86 M100 60 H140 M166 60 H192" />
      {/* normally open contact */}
      <path d="M46 48 V72 M60 48 V72" strokeWidth={1.5} />
      {/* normally closed contact */}
      <path d="M86 48 V72 M100 48 V72 M83 72 L103 48" strokeWidth={1.5} />
      {/* coil */}
      <path d="M146 47 Q136 60 146 73 M160 47 Q170 60 160 73" strokeWidth={1.5} />
      <path d="M140 60 H141 M165 60 H166" />
      {[
        ["X1", 53],
        ["X2", 93],
        ["Y1", 153],
      ].map(([text, x]) => (
        <text key={text} x={x} y={40} textAnchor="middle" className="fill-technical stroke-none font-mono" style={label}>
          {text}
        </text>
      ))}
      <path d="M8 96 H192" strokeDasharray="2 5" strokeWidth={0.75} />
    </g>
  );
}

function Software() {
  return (
    <g data-glyph="software">
      <path d="M0 60 H28 M56 60 H76 V32 H96 M76 60 V88 H96 M124 32 H146 V60 M124 88 H146 V60 M178 60 H200" />
      <rect x={28} y={48} width={28} height={24} strokeWidth={1.5} />
      <rect x={96} y={22} width={28} height={20} strokeWidth={1.25} />
      <rect x={96} y={78} width={28} height={20} strokeWidth={1.25} />
      <ellipse cx={162} cy={48} rx={16} ry={5} strokeWidth={1.25} />
      <path d="M146 48 V72 A16 5 0 0 0 178 72 V48" strokeWidth={1.25} />
      <text x={28} y={40} className="fill-technical stroke-none font-mono" style={label}>
        API
      </text>
      <circle cx={146} cy={60} r={2.5} className="fill-accent" stroke="none" />
    </g>
  );
}

const glyphs: Record<GlyphLayer, () => React.JSX.Element> = {
  electrical: Electrical,
  mechanical: Mechanical,
  controls: Controls,
  software: Software,
};

export const glyphLayers = Object.keys(glyphs) as GlyphLayer[];

export const hasGlyph = (layer: SystemLayer): layer is GlyphLayer => layer in glyphs;

/** A single layer drawing, standalone. */
export function LayerGlyph({ layer, className }: { layer: GlyphLayer; className?: string }) {
  const Glyph = glyphs[layer];
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${GLYPH_W} ${GLYPH_H}`}
      className={className}
      fill="none"
    >
      <g className="stroke-technical" strokeWidth={1.25}>
        <Glyph />
      </g>
    </svg>
  );
}

/** All layers chained on one continuous wire (desktop journey). */
export function LayerStrip({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${GLYPH_W * glyphLayers.length} ${GLYPH_H}`}
      className={className}
      fill="none"
      data-layer-strip
    >
      <g className="stroke-technical" strokeWidth={1.25}>
        {glyphLayers.map((layer, i) => {
          const Glyph = glyphs[layer];
          return (
            <g key={layer} transform={`translate(${i * GLYPH_W} 0)`}>
              <Glyph />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
