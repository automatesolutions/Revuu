import type { Lifecycle, Status } from "@revuu/ui/components/status-chip";

export interface BomLine {
  id: string;
  refs: string;
  mpn: string;
  manufacturer: string;
  description: string;
  qty: number;
  lifecycle: Lifecycle;
  lifecycleSource: string;
  lifecycleAge: string;
  avl: Status;
  stock: number | null;
  unitPrice: number | null;
}

/** Realistic lines from a small buck-converter board. Demo data only. */
export const bomLines: BomLine[] = [
  {
    id: "l1",
    refs: "C1, C4, C7–C12",
    mpn: "GRM155R71C104KA88D",
    manufacturer: "Murata",
    description: "Cap ceramic 0.1 µF 16 V X7R 0402",
    qty: 8,
    lifecycle: "active",
    lifecycleSource: "DigiKey",
    lifecycleAge: "2 h ago",
    avl: "approved",
    stock: 4_812_330,
    unitPrice: 0.0042,
  },
  {
    id: "l2",
    refs: "U2",
    mpn: "TPS62133RGTR",
    manufacturer: "Texas Instruments",
    description: "Buck converter 3 A 3–17 V VQFN-16",
    qty: 1,
    lifecycle: "active",
    lifecycleSource: "Mouser",
    lifecycleAge: "5 h ago",
    avl: "approved",
    stock: 6_204,
    unitPrice: 2.31,
  },
  {
    id: "l3",
    refs: "L1",
    mpn: "XAL4020-222MEB",
    manufacturer: "Coilcraft",
    description: "Inductor 2.2 µH 5.6 A shielded",
    qty: 1,
    lifecycle: "active",
    lifecycleSource: "Mouser",
    lifecycleAge: "5 h ago",
    avl: "pending",
    stock: 1_930,
    unitPrice: 1.12,
  },
  {
    id: "l4",
    refs: "U5",
    mpn: "LM1117IMPX-3.3/NOPB",
    manufacturer: "Texas Instruments",
    description: "LDO 3.3 V 800 mA SOT-223",
    qty: 1,
    lifecycle: "nrnd",
    lifecycleSource: "DigiKey",
    lifecycleAge: "2 h ago",
    avl: "restricted",
    stock: 12_480,
    unitPrice: 0.94,
  },
  {
    id: "l5",
    refs: "Q3",
    mpn: "IRLML6402TRPBF",
    manufacturer: "Infineon",
    description: "MOSFET P-ch 20 V 3.7 A SOT-23",
    qty: 1,
    lifecycle: "eol",
    lifecycleSource: "DigiKey",
    lifecycleAge: "1 d ago",
    avl: "warning",
    stock: 820,
    unitPrice: 0.38,
  },
  {
    id: "l6",
    refs: "R4, R9",
    mpn: "RC0402FR-0710KL",
    manufacturer: "Yageo",
    description: "Res 10 kΩ 1% 1/16 W 0402",
    qty: 2,
    lifecycle: "active",
    lifecycleSource: "LCSC CSV",
    lifecycleAge: "3 d ago",
    avl: "approved",
    stock: 9_870_000,
    unitPrice: 0.0011,
  },
  {
    id: "l7",
    refs: "J1",
    mpn: "10118194-0001LF",
    manufacturer: "Amphenol",
    description: "Micro USB-B receptacle SMT",
    qty: 1,
    lifecycle: "obsolete",
    lifecycleSource: "Mouser",
    lifecycleAge: "5 h ago",
    avl: "rejected",
    stock: 0,
    unitPrice: null,
  },
  {
    id: "l8",
    refs: "D2",
    mpn: "SMBJ15A-13-F",
    manufacturer: "Diodes Inc.",
    description: "TVS 15 V 600 W SMB",
    qty: 1,
    lifecycle: "unknown",
    lifecycleSource: "Not checked",
    lifecycleAge: "",
    avl: "proposed",
    stock: null,
    unitPrice: null,
  },
];
