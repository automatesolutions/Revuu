import type { Lifecycle } from "@revuu/ui/components/status-chip";

/** Demo data for the dashboard. */
export const workspace = { name: "Demo workspace", plan: "Free" };
export const currentUser = { name: "Ana Reyes", role: "Component engineer" };

export interface PartsListRow {
  id: string;
  name: string;
  file: string;
  lines: number;
  electrical: number;
  mechanical: number;
  skipped: number;
  needAlternate: number;
  imported: string;
}

export const partsLists: PartsListRow[] = [
  {
    id: "pl1",
    name: "Power board Rev C",
    file: "power-board-rev-c-demo.xlsx",
    lines: 12,
    electrical: 8,
    mechanical: 3,
    skipped: 1,
    needAlternate: 3,
    imported: "12 min ago",
  },
  {
    id: "pl2",
    name: "Motor driver Rev A",
    file: "motor-driver-rev-a.xlsx",
    lines: 64,
    electrical: 51,
    mechanical: 13,
    skipped: 0,
    needAlternate: 2,
    imported: "2 h ago",
  },
  {
    id: "pl3",
    name: "Sensor hub Rev B",
    file: "sensor-hub-rev-b.csv",
    lines: 40,
    electrical: 30,
    mechanical: 8,
    skipped: 2,
    needAlternate: 1,
    imported: "Yesterday",
  },
  {
    id: "pl4",
    name: "Enclosure Rev A",
    file: "enclosure-rev-a.csv",
    lines: 22,
    electrical: 0,
    mechanical: 22,
    skipped: 0,
    needAlternate: 0,
    imported: "Mon 5 Oct",
  },
];

export interface NeedsAlternateRow {
  id: string;
  designator: string;
  mpn: string;
  manufacturer: string;
  lifecycle: Lifecycle;
  age: string;
  alternates: number;
  list: string;
}

export const needsAlternate: NeedsAlternateRow[] = [
  {
    id: "n1",
    designator: "Q3",
    mpn: "IRLML6402TRPBF",
    manufacturer: "Infineon",
    lifecycle: "eol",
    age: "1 d ago",
    alternates: 3,
    list: "Power board Rev C",
  },
  {
    id: "n2",
    designator: "U5",
    mpn: "LM1117IMPX-3.3/NOPB",
    manufacturer: "Texas Instruments",
    lifecycle: "nrnd",
    age: "2 h ago",
    alternates: 0,
    list: "Power board Rev C",
  },
  {
    id: "n3",
    designator: "J1",
    mpn: "10118194-0001LF",
    manufacturer: "Amphenol",
    lifecycle: "obsolete",
    age: "5 h ago",
    alternates: 0,
    list: "Power board Rev C",
  },
];

export interface PartAlert {
  id: string;
  mpn: string;
  manufacturer: string;
  from: Lifecycle;
  to: Lifecycle;
  source: string;
  age: string;
  lists: number;
}

export const partAlerts: PartAlert[] = [
  {
    id: "p1",
    mpn: "IRLML6402TRPBF",
    manufacturer: "Infineon",
    from: "nrnd",
    to: "eol",
    source: "Vendor record",
    age: "1 d ago",
    lists: 2,
  },
  {
    id: "p2",
    mpn: "LM1117IMPX-3.3/NOPB",
    manufacturer: "Texas Instruments",
    from: "active",
    to: "nrnd",
    source: "Vendor record",
    age: "2 d ago",
    lists: 3,
  },
  {
    id: "p3",
    mpn: "10118194-0001LF",
    manufacturer: "Amphenol",
    from: "eol",
    to: "obsolete",
    source: "Vendor record",
    age: "4 d ago",
    lists: 1,
  },
];

export interface ActivityItem {
  id: string;
  who: string;
  action: string;
  target: string;
  when: string;
}

export const activity: ActivityItem[] = [
  {
    id: "e1",
    who: "Theo Okafor",
    action: "imported",
    target: "power-board-rev-c-demo.xlsx, 11 parts",
    when: "12 min ago",
  },
  {
    id: "e2",
    who: "Ana Reyes",
    action: "set D2 to Electrical on",
    target: "Power board Rev C",
    when: "12 min ago",
  },
  {
    id: "e3",
    who: "Mara Lin",
    action: "compared IRLML6402TRPBF with",
    target: "3 alternates",
    when: "40 min ago",
  },
  {
    id: "e4",
    who: "Ana Reyes",
    action: "rejected AO3401A for",
    target: "the Approved Parts List",
    when: "Yesterday",
  },
  {
    id: "e5",
    who: "Sam Patel",
    action: "imported",
    target: "enclosure-rev-a.csv, 22 parts",
    when: "Mon 5 Oct",
  },
];
