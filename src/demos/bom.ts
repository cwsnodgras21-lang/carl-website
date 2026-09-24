import type { RawBomLine, Stock } from "./bom-data";

/**
 * BOM Processor — the actual transformation, no DOM, deterministic.
 *
 *   raw BOM → normalize → aggregate → check inventory → calculate demand
 */

export const BOM_STAGES = ["Raw BOM", "Normalize", "Aggregate", "Inventory", "Demand", "Purchase list"] as const;

export type BomGroup = {
  part: string;
  description: string;
  /** Raw line ids that consolidated into this part, in BOM order. */
  lines: number[];
  assemblies: string[];
  required: number;
  onHand: number;
  fromStock: number;
  toBuy: number;
};

export type BomResult = {
  /** Raw line id → normalized part number. */
  normalized: Record<number, string>;
  /** Raw line ids dropped as reference-only (qty 0). */
  dropped: number[];
  groups: BomGroup[];
  /** Raw line id → the part it consolidated into. */
  groupOf: Record<number, string>;
  stats: {
    rawLines: number;
    referenceLines: number;
    uniqueParts: number;
    linesConsolidated: number;
    partsFromStock: number;
    partsToBuy: number;
    unitsFromStock: number;
    unitsToBuy: number;
  };
};

/** "hw 1042 " / "HW1042" / "hw-1042" → "HW-1042". */
export function normalizePart(raw: string): string {
  const compact = raw.trim().toUpperCase().replace(/[\s_-]+/g, "");
  const match = compact.match(/^([A-Z]+)(\d+)$/);
  return match ? `${match[1]}-${match[2]}` : compact;
}

export function processBom(lines: RawBomLine[], stock: Stock): BomResult {
  const normalized: Record<number, string> = {};
  const dropped: number[] = [];
  const byPart = new Map<string, BomGroup>();
  const groupOf: Record<number, string> = {};

  for (const line of lines) {
    const part = normalizePart(line.part);
    normalized[line.id] = part;
    if (line.qty <= 0) {
      dropped.push(line.id);
      continue;
    }
    let group = byPart.get(part);
    if (!group) {
      group = {
        part,
        description: line.description,
        lines: [],
        assemblies: [],
        required: 0,
        onHand: 0,
        fromStock: 0,
        toBuy: 0,
      };
      byPart.set(part, group);
    }
    group.lines.push(line.id);
    if (!group.assemblies.includes(line.assembly)) group.assemblies.push(line.assembly);
    group.required += line.qty;
    groupOf[line.id] = part;
  }

  const groups = [...byPart.values()];
  for (const group of groups) {
    group.onHand = stock[group.part] ?? 0;
    group.fromStock = Math.min(group.required, group.onHand);
    group.toBuy = group.required - group.fromStock;
  }

  const kept = lines.length - dropped.length;
  return {
    normalized,
    dropped,
    groups,
    groupOf,
    stats: {
      rawLines: lines.length,
      referenceLines: dropped.length,
      uniqueParts: groups.length,
      linesConsolidated: kept - groups.length,
      partsFromStock: groups.filter((g) => g.toBuy === 0).length,
      partsToBuy: groups.filter((g) => g.toBuy > 0).length,
      unitsFromStock: groups.reduce((sum, g) => sum + g.fromStock, 0),
      unitsToBuy: groups.reduce((sum, g) => sum + g.toBuy, 0),
    },
  };
}
