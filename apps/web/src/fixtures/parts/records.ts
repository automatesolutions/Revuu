/**
 * Demo data. Part records, alternates and vendor records for "Power board Rev C, demo".
 * Every email, phone number and URL uses a reserved example domain or a 555 number.
 * Server-only: imported by route handlers and artboards, never by client components.
 * Dimensions and functional specs are demo values. Check the manufacturer datasheet before use.
 */
import { bomLines } from "@/fixtures/bom";
import type { PartRecord, VendorRecord } from "@/lib/parts/compare";

const electricalRecords: PartRecord[] = bomLines
  .filter((line) => line.refs !== "Q3")
  .map((line) => ({
    mpn: line.mpn,
    manufacturer: line.manufacturer,
    category: "electrical",
    specs: {},
    lifecycle: line.lifecycle,
    stock: line.stock,
    unitPrice: line.unitPrice,
    datasheet: null,
    vendor: null,
    source: line.lifecycle === "unknown" ? "Not checked" : "Vendor record",
    age: line.lifecycleAge,
  }));

const q3: PartRecord = {
  mpn: "IRLML6402TRPBF",
  manufacturer: "Infineon",
  category: "electrical",
  specs: {
    voltage: "−20 V",
    current: "−3.7 A",
    resistance: "65 mΩ",
    tolerance: null,
    polarity: "P-channel",
    package: "SOT-23",
    pins: 3,
    bodyLength: "2.9 mm",
    bodyWidth: "1.3 mm",
    height: "1.1 mm",
    pitch: "0.95 mm",
    threshold: "−1.2 V",
    gateCharge: "8.0 nC",
    power: "1.3 W",
    temperature: "−55 to 150 °C",
  },
  labels: {
    voltage: "Vds",
    current: "Current (Id)",
    resistance: "Rds(on)",
    threshold: "Vgs(th), max",
    gateCharge: "Gate charge (Qg)",
    power: "Power (Pd)",
  },
  checks: {
    voltage: "Confirm the gate threshold at your gate drive voltage.",
    resistance: "Confirm conduction loss at the load current.",
  },
  lifecycle: "eol",
  stock: 820,
  unitPrice: 0.38,
  datasheet: "IRLML6402PbF.pdf",
  vendor: "Infineon Technologies",
  source: "Vendor record",
  age: "1 d ago",
};

const standoff: PartRecord = {
  mpn: "HSO-M3X10-BR-NI",
  manufacturer: "Calder Standoffs",
  category: "mechanical",
  specs: {
    thread: "M3 × 0.5",
    length: "10 mm",
    material: "Brass",
    finish: "Nickel plated",
    drive: "Female-female, hex",
    acrossFlats: "5.5 mm",
    threadDepth: "4 mm",
    torque: "0.6 N·m",
  },
  lifecycle: "active",
  stock: 14_200,
  unitPrice: 0.21,
  datasheet: "HSO-M3-series.pdf",
  vendor: "Calder Supply",
  source: "Vendor record",
  age: "3 d ago",
};

const screw: PartRecord = {
  mpn: "PMS-M3X6-A2",
  manufacturer: "Northfield Fasteners",
  category: "mechanical",
  specs: {
    thread: "M3 × 0.5",
    length: "6 mm",
    material: "Stainless steel A2",
    finish: "Plain",
    drive: "Phillips pan head",
  },
  lifecycle: "active",
  stock: 52_000,
  unitPrice: 0.04,
  datasheet: null,
  vendor: "Northfield Fasteners",
  source: "Vendor record",
  age: "3 d ago",
};

export const partRecords: PartRecord[] = [...electricalRecords, q3, standoff, screw];

export const alternateRecords: Record<string, PartRecord[]> = {
  IRLML6402TRPBF: [
    {
      mpn: "DMP2035U-7",
      manufacturer: "Diodes Inc.",
      category: "electrical",
      specs: {
        voltage: "−20 V",
        current: "−3.6 A",
        resistance: "35 mΩ",
        tolerance: null,
        polarity: "P-channel",
        package: "SOT-23",
        pins: 3,
        bodyLength: "2.9 mm",
        bodyWidth: "1.3 mm",
        height: "1.1 mm",
        pitch: "0.95 mm",
        threshold: "−1.0 V",
        gateCharge: "9.6 nC",
        power: "0.8 W",
        temperature: "−55 to 150 °C",
      },
      lifecycle: "active",
      stock: 61_200,
      unitPrice: 0.12,
      datasheet: "DMP2035U.pdf",
      vendor: "Diodes Inc.",
      source: "Vendor record",
      age: "2 d ago",
    },
    {
      mpn: "SI2343CDS-T1-GE3",
      manufacturer: "Vishay",
      category: "electrical",
      specs: {
        voltage: "−30 V",
        current: "−4.0 A",
        resistance: "0.045 Ω",
        tolerance: null,
        polarity: "P-channel",
        package: "SOT-23",
        pins: 3,
        bodyLength: "2.9 mm",
        bodyWidth: "1.3 mm",
        height: "1.1 mm",
        pitch: "0.95 mm",
        threshold: "−2.5 V",
        gateCharge: "11 nC",
        power: "1.25 W",
        temperature: "−55 to 150 °C",
      },
      lifecycle: "active",
      stock: 18_450,
      unitPrice: 0.31,
      datasheet: "Si2343CDS.pdf",
      vendor: "Vishay",
      source: "Vendor record",
      age: "2 d ago",
    },
    {
      mpn: "AO3401A",
      manufacturer: "Alpha & Omega",
      category: "electrical",
      specs: {
        voltage: "−30 V",
        current: "−4.0 A",
        resistance: "50 mΩ",
        tolerance: null,
        polarity: "P-channel",
        package: "SOT-23",
        pins: 3,
        bodyLength: "2.9 mm",
        bodyWidth: "1.3 mm",
        height: "1.1 mm",
        pitch: "0.95 mm",
        threshold: "−1.3 V",
        gateCharge: "7.0 nC",
        power: "1.4 W",
        temperature: "−55 to 150 °C",
      },
      lifecycle: "active",
      stock: 212_000,
      unitPrice: 0.07,
      datasheet: "AO3401A.pdf",
      vendor: "Alpha & Omega",
      source: "Vendor record",
      age: "4 d ago",
    },
  ],
  "HSO-M3X10-BR-NI": [
    {
      mpn: "HSO-M3X12-BR-NI",
      manufacturer: "Calder Standoffs",
      category: "mechanical",
      specs: {
        thread: "M3 × 0.5",
        length: "12 mm",
        material: "Brass",
        finish: "Nickel plated",
        drive: "Female-female, hex",
        acrossFlats: "5.5 mm",
        threadDepth: "4 mm",
        torque: "0.6 N·m",
      },
      lifecycle: "active",
      stock: 9_800,
      unitPrice: 0.23,
      datasheet: "HSO-M3-series.pdf",
      vendor: "Calder Supply",
      source: "Vendor record",
      age: "3 d ago",
    },
    {
      mpn: "HSO-M3X10-AL-CA",
      manufacturer: "Calder Standoffs",
      category: "mechanical",
      specs: {
        thread: "M3 x 0.5",
        length: "10.0 mm",
        material: "Aluminum",
        finish: "Clear anodized",
        drive: "Female-female, hex",
        acrossFlats: "5.5 mm",
        threadDepth: "4 mm",
        torque: "0.4 N·m",
      },
      lifecycle: "active",
      stock: 3_150,
      unitPrice: 0.34,
      datasheet: "HSO-M3-series.pdf",
      vendor: "Northfield Fasteners",
      source: "Vendor record",
      age: "3 d ago",
    },
  ],
};

export const vendorRecords: VendorRecord[] = [
  { name: "Diodes Inc.", email: null, phone: "+1 555 0150", url: "https://diodes.example" },
  { name: "Vishay", email: "sales@vishay.example", phone: null, url: "https://vishay.example" },
  { name: "Alpha & Omega", email: null, phone: null, url: "https://aosmd.example" },
  {
    name: "Calder Supply",
    email: "quotes@calder.example",
    phone: "+1 555 0182",
    url: "https://calder.example",
  },
  {
    name: "Northfield Fasteners",
    email: null,
    phone: "+1 555 0170",
    url: "https://northfield.example",
  },
];

export function findRecord(mpn: string) {
  const key = mpn.trim().toUpperCase();
  return partRecords.find((r) => r.mpn.toUpperCase() === key) ?? null;
}

export function findAlternates(mpn: string) {
  return alternateRecords[mpn.trim().toUpperCase()] ?? [];
}
