/**
 * Synthetic engineering BOM for the BOM Processor demo. Invented parts,
 * invented quantities, invented stock — deliberately messy the way real
 * exports are: the same part typed several ways, the same part on several
 * assemblies, and reference-only lines with zero quantity.
 */

export type RawBomLine = {
  id: number;
  assembly: string;
  /** As exported — inconsistent formatting on purpose. */
  part: string;
  description: string;
  qty: number;
};

export type Stock = Record<string, number>;

// [assembly, part as typed, description, qty]
const rows: [string, string, string, number][] = [
  ["100 Frame", "HW-1042", "Hex bolt M10x30, zinc", 48],
  ["100 Frame", "hw-1043", "Hex nut M10, zinc", 48],
  ["100 Frame", "HW1050", "Flat washer M10", 96],
  ["100 Frame", "ST-4410", "Angle 2x2x1/4, 20 ft", 6],
  ["100 Frame", "st-4420", "Flat bar 3x1/4, 20 ft", 4],
  ["100 Frame", "BR-3301", "Pillow block bearing 1-7/16", 4],
  ["100 Frame", "HW-2210", "SHCS M8x20", 32],
  ["100 Frame", "HW-1042 ", "HEX BOLT M10X30 ZN", 24],
  ["100 Frame", "EL-6601", "Prox sensor 18mm", 2],
  ["100 Frame", "ST-4430", "Sheet 12ga 4x8", 0],
  ["200 Drive", "MT-5501", "Gearmotor 1 HP 480V", 2],
  ["200 Drive", "BR-3302", "Flange bearing 1-7/16", 4],
  ["200 Drive", "br3301", "Pillow block brg 1-7/16", 2],
  ["200 Drive", "HW-1042", "Hex bolt M10x30, zinc", 16],
  ["200 Drive", "HW-1043", "Hex nut M10, zinc", 16],
  ["200 Drive", "hw-2210", "SHCS M8x20", 24],
  ["200 Drive", "MT-5510", "Motor starter 1 HP", 2],
  ["200 Drive", "ST-4420", "Flat bar 3x1/4, 20 ft", 2],
  ["200 Drive", "HW-1050", "Flat washer M10", 32],
  ["200 Drive", "EL-6610", "Cordset 4-pin 5m", 2],
  ["300 Guarding", "GD-7701", "Mesh guard panel 4x6", 14],
  ["300 Guarding", "GD-7710", "Guard post 6 ft", 12],
  ["300 Guarding", "hw-1042", "Hex bolt M10x30", 56],
  ["300 Guarding", "HW-1043", "Hex nut M10", 56],
  ["300 Guarding", "HW 1050", "Flat washer M10", 112],
  ["300 Guarding", "ST-4410", "Angle 2x2x1/4, 20 ft", 3],
  ["300 Guarding", "gd-7701", "MESH PANEL 4X6", 2],
  ["300 Guarding", "EL-6630", "E-stop pushbutton", 2],
  ["300 Guarding", "ST-4430", "Sheet 12ga 4x8", 2],
  ["400 Controls", "EL-6601", "Prox sensor 18 mm", 6],
  ["400 Controls", "el-6610", "Cordset, 4-pin, 5 m", 8],
  ["400 Controls", "EL-6620", "Cable tray 4 in, 10 ft", 12],
  ["400 Controls", "EL-6630", "E-stop PB", 3],
  ["400 Controls", "MT-5510", "Motor starter 1HP", 1],
  ["400 Controls", "HW-2210", "SHCS M8x20", 16],
  ["400 Controls", "EL6620", "Cable tray 4in 10ft", 4],
  ["400 Controls", "EL-6601", "Prox sensor 18mm", 0],
  ["400 Controls", "HW-1043", "Hex nut M10", 12],
  ["400 Controls", "HW-1042", "Hex bolt M10x30", 12],
  ["400 Controls", "GD-7710", "Guard post 6 ft", 2],
  ["400 Controls", "ST-4430", "Sheet 12 ga 4x8", 1],
  ["400 Controls", "BR-3302", "Flange brg 1-7/16", 2],
];

export const rawBom: RawBomLine[] = rows.map(([assembly, part, description, qty], i) => ({
  id: i + 1,
  assembly,
  part,
  description,
  qty,
}));

/** On hand in the (synthetic) warehouse. */
export const stock: Stock = {
  "HW-1042": 400,
  "HW-1043": 120,
  "HW-1050": 1000,
  "HW-2210": 60,
  "BR-3301": 2,
  "BR-3302": 0,
  "ST-4410": 6,
  "ST-4420": 0,
  "ST-4430": 3,
  "MT-5501": 0,
  "MT-5510": 1,
  "EL-6601": 12,
  "EL-6610": 5,
  "EL-6620": 0,
  "EL-6630": 4,
  "GD-7701": 0,
  "GD-7710": 2,
};
