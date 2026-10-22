// Writes the checked-in demo parts list as CSV and Excel.
// Usage: node scripts/build-demo-parts.mjs
// Demo data. Emails, phone numbers and URLs use example domains and 555 numbers.
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as XLSX from "xlsx";

const header = [
  "Designator",
  "Manufacturer Part Number",
  "Manufacturer",
  "Description",
  "Quantity",
  "Category",
  "Supplier",
  "Supplier Email",
  "Supplier Phone",
  "Supplier URL",
  "Footprint",
];

// Electrical lines match apps/web/src/fixtures/bom.ts.
const rows = [
  [
    "C1, C4, C7–C12",
    "GRM155R71C104KA88D",
    "Murata",
    "Cap ceramic 0.1 µF 16 V X7R 0402",
    8,
    "Electrical",
    "Murata Electronics",
    "",
    "",
    "https://murata.example",
    "C0402",
  ],
  [
    "U2",
    "TPS62133RGTR",
    "Texas Instruments",
    "Buck converter 3 A 3–17 V VQFN-16",
    1,
    "Electrical",
    "Texas Instruments",
    "",
    "+1 555 0110",
    "https://ti.example",
    "VQFN-16",
  ],
  [
    "L1",
    "XAL4020-222MEB",
    "Coilcraft",
    "Inductor 2.2 µH 5.6 A shielded",
    1,
    "Electrical",
    "Coilcraft",
    "sales@coilcraft.example",
    "+1 555 0123",
    "https://coilcraft.example",
    "XAL4020",
  ],
  [
    "U5",
    "LM1117IMPX-3.3/NOPB",
    "Texas Instruments",
    "LDO 3.3 V 800 mA SOT-223",
    1,
    "Electrical",
    "Texas Instruments",
    "",
    "+1 555 0110",
    "https://ti.example",
    "SOT-223",
  ],
  [
    "Q3",
    "IRLML6402TRPBF",
    "Infineon",
    "MOSFET P-ch 20 V 3.7 A SOT-23",
    1,
    "Electrical",
    "Infineon Technologies",
    "",
    "+1 555 0131",
    "https://infineon.example",
    "SOT-23",
  ],
  [
    "R4, R9",
    "RC0402FR-0710KL",
    "Yageo",
    "Res 10 kΩ 1% 1/16 W 0402",
    2,
    "Electrical",
    "Yageo",
    "",
    "",
    "",
    "R0402",
  ],
  [
    "J1",
    "10118194-0001LF",
    "Amphenol",
    "Micro USB-B receptacle SMT",
    1,
    "Electrical",
    "Amphenol ICC",
    "orders@amphenol-icc.example",
    "",
    "https://amphenol-icc.example",
    "USB-MICRO-B",
  ],
  [
    "D2",
    "SMBJ15A-13-F",
    "Diodes Inc.",
    "TVS 15 V 600 W SMB",
    1,
    "",
    "Diodes Inc.",
    "sales@diodes.example",
    "+1 555 0150",
    "https://diodes.example",
    "SMB",
  ],
  [
    "H1–H4",
    "PMS-M3X6-A2",
    "Northfield Fasteners",
    "Screw, machine, Phillips pan head, M3 × 6 mm, stainless A2",
    4,
    "Mechanical",
    "Northfield Fasteners",
    "orders@northfield.example",
    "+1 555 0170",
    "https://northfield.example",
    "",
  ],
  [
    "SO1–SO4",
    "HSO-M3X10-BR-NI",
    "Calder Standoffs",
    "Standoff, hex, female-female, M3 × 10 mm, brass, nickel plated",
    4,
    "Mechanical",
    "Calder Supply",
    "",
    "+1 555 0182",
    "https://calder.example",
    "",
  ],
  [
    "W1–W4",
    "NW-M3-PA66",
    "Northfield Fasteners",
    "Washer, flat, M3, nylon 6/6",
    4,
    "",
    "Northfield Fasteners",
    "orders@northfield.example",
    "+1 555 0170",
    "https://northfield.example",
    "",
  ],
  [
    "TP1–TP4",
    "",
    "",
    "Test point, bare pad, no part placed",
    4,
    "Electrical",
    "",
    "",
    "",
    "",
    "TP-1.0MM",
  ],
];

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../src/fixtures/parts");
const name = "power-board-rev-c-demo";

const csvCell = (v) => {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const csv = [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n";
writeFileSync(path.join(dir, `${name}.csv`), csv, "utf8");

const sheet = XLSX.utils.aoa_to_sheet([header, ...rows]);
sheet["!cols"] = header.map((h) => ({ wch: Math.max(12, h.length + 2) }));
const book = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(book, sheet, "BOM");
book.Props = { Title: "Power board Rev C, demo", Subject: "Demo data" };
writeFileSync(
  path.join(dir, `${name}.xlsx`),
  XLSX.write(book, { type: "buffer", bookType: "xlsx" }),
);

console.log(`Wrote ${name}.csv and ${name}.xlsx with ${rows.length} lines.`);
