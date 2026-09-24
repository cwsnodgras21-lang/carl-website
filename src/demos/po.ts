import { normalizePart } from "./bom";
import { rawBom } from "./bom-data";

/**
 * PO Builder — manual purchase-order lines → validated, formatted,
 * export-ready rows. Synthetic data; no real ERP template.
 *
 *   manual entry → validate → format → export-ready
 */

export const PO_STAGES = ["Manual entry", "Validate", "Format", "Export-ready"] as const;

export type ManualPoLine = {
  id: number;
  vendor: string;
  item: string;
  description: string;
  qty: string;
  uom: string;
  needBy: string;
};

// Typed in by hand, from wherever the request came from.
export const manualPoLines: ManualPoLine[] = [
  { id: 1, vendor: "v102", item: "hw-1042", description: "hex bolt m10x30", qty: "400", uom: "ea", needBy: "3/14/26" },
  { id: 2, vendor: "V-102", item: "HW 1043", description: "hex nut m10", qty: "350 ea", uom: "", needBy: "3/14/26" },
  { id: 3, vendor: "V-215", item: "br-3302", description: "flange brg 1-7/16", qty: "4", uom: "EA", needBy: "03-20-2026" },
  { id: 4, vendor: "", item: "st-4420", description: "flat bar 3x1/4 20'", qty: "8", uom: "lengths", needBy: "3/21/26" },
  { id: 5, vendor: "V-340", item: "EL6620", description: "cable tray 4in 10ft", qty: "12", uom: "ea", needBy: "3/18/26" },
  { id: 6, vendor: "v340", item: "EL-6620", description: "Cable tray 4 in 10 ft", qty: "12", uom: "EA", needBy: "3/18/26" },
  { id: 7, vendor: "V-418", item: "mt-5501", description: "gearmotor 1hp 480v", qty: "two", uom: "ea", needBy: "3/28/26" },
  { id: 8, vendor: "V-522", item: "GD-7701", description: "mesh guard panel 4x6", qty: "14", uom: "ea", needBy: "3/21/26" },
  { id: 9, vendor: "V-215", item: "BR-331", description: "pillow block 1-7/16", qty: "2", uom: "ea", needBy: "3/20/26" },
];

/** The item master the lines are checked against: the same synthetic parts as the BOM demo. */
const itemMaster = new Map<string, string>();
for (const line of rawBom) {
  const part = normalizePart(line.part);
  if (!itemMaster.has(part)) itemMaster.set(part, line.description);
}

export type Check = { id: "required" | "qty" | "item" | "duplicate"; ok: boolean; note: string };

export type ImportRow = {
  line: number;
  vendor: string;
  item: string;
  description: string;
  qty: number | null;
  uom: string;
  needBy: string;
};

export type PoLineResult = {
  id: number;
  checks: Check[];
  ready: boolean;
  /** Why it's held back, if it is. */
  held?: string;
  formatted: ImportRow;
  /** Fields whose formatted value differs from what was typed. */
  changed: (keyof ImportRow)[];
};

export type PoResult = {
  lines: PoLineResult[];
  stats: { entered: number; ready: number; held: number };
};

const normalizeVendor = (raw: string) => {
  const m = raw.trim().toUpperCase().replace(/[\s-]+/g, "").match(/^V(\d+)$/);
  return m ? `V-${m[1]}` : raw.trim().toUpperCase();
};

/** Leading whole number, allowing a trailing unit ("350 ea"). */
function parseQty(raw: string): { qty: number | null; unit?: string } {
  const m = raw.trim().match(/^(\d+)\s*([a-z]*)$/i);
  if (!m) return { qty: null };
  const qty = Number(m[1]);
  return qty > 0 ? { qty, unit: m[2] || undefined } : { qty: null };
}

const UOM: Record<string, string> = { ea: "EA", each: "EA", lengths: "LG", length: "LG", ft: "FT" };

function isoDate(raw: string): string {
  const m = raw.trim().match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2}|\d{4})$/);
  if (!m) return "";
  const year = m[3].length === 2 ? 2000 + Number(m[3]) : Number(m[3]);
  return `${year}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`;
}

export function buildImport(lines: ManualPoLine[]): PoResult {
  const seen = new Map<string, number>();
  const results: PoLineResult[] = lines.map((line) => {
    const vendor = normalizeVendor(line.vendor);
    const typedItem = line.item.trim();
    const normalizedItem = normalizePart(typedItem);
    const known = itemMaster.get(normalizedItem);
    // Only reformat item numbers we can match; an unknown one stays as typed.
    const item = known ? normalizedItem : typedItem.toUpperCase();
    const { qty, unit } = parseQty(line.qty);
    const uomRaw = (line.uom || unit || "").toLowerCase();
    const needBy = isoDate(line.needBy);

    const missing = [!vendor && "vendor", !typedItem && "item", !line.qty.trim() && "qty", !needBy && "date"].filter(Boolean);
    const key = `${vendor}|${item}|${qty}|${needBy}`;
    const firstSeen = seen.get(key);
    if (firstSeen === undefined) seen.set(key, line.id);

    const checks: Check[] = [
      { id: "required", ok: missing.length === 0, note: missing.length ? `Missing ${missing.join(", ")}` : "Required fields" },
      { id: "qty", ok: qty !== null, note: qty !== null ? "Quantity valid" : `Quantity "${line.qty}" isn't a number` },
      { id: "item", ok: !!known, note: known ? "Item in item master" : `Item "${typedItem}" not in item master` },
      {
        id: "duplicate",
        ok: firstSeen === undefined,
        note: firstSeen === undefined ? "Not a duplicate" : `Duplicate of line ${firstSeen}`,
      },
    ];
    const failed = checks.find((c) => !c.ok);

    const formatted: ImportRow = {
      line: line.id,
      vendor,
      item,
      description: known ?? line.description,
      qty,
      uom: UOM[uomRaw] ?? (uomRaw ? uomRaw.toUpperCase() : "EA"),
      needBy,
    };
    const typed: Record<string, string> = {
      vendor: line.vendor,
      item: line.item,
      description: line.description,
      qty: line.qty,
      uom: line.uom,
      needBy: line.needBy,
    };
    const changed = (["vendor", "item", "description", "qty", "uom", "needBy"] as const).filter(
      (k) => String(formatted[k] ?? "") !== typed[k],
    );

    return { id: line.id, checks, ready: !failed, held: failed?.note, formatted, changed };
  });

  const ready = results.filter((r) => r.ready).length;
  return { lines: results, stats: { entered: lines.length, ready, held: lines.length - ready } };
}
