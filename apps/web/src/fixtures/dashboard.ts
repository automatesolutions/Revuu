import type { Lifecycle, Status } from "@revuu/ui/components/status-chip";

export const workspace = { name: "Demo workspace", plan: "Free" };
export const currentUser = { name: "Ana Reyes", role: "Reviewer" };

export interface Assignment {
  id: string;
  review: string;
  project: string;
  revision: string;
  requestedBy: string;
  due: string;
  overdue?: boolean;
  openItems: number;
  status: Status;
}

export const assignments: Assignment[] = [
  {
    id: "a1",
    review: "Parts review",
    project: "Power board",
    revision: "Rev C",
    requestedBy: "Mara Lin",
    due: "Today",
    openItems: 4,
    status: "pending",
  },
  {
    id: "a2",
    review: "Schematic review",
    project: "Motor driver",
    revision: "Rev A",
    requestedBy: "Sam Patel",
    due: "Yesterday",
    overdue: true,
    openItems: 7,
    status: "warning",
  },
  {
    id: "a3",
    review: "PCB layout review",
    project: "Sensor hub",
    revision: "Rev B",
    requestedBy: "Theo Okafor",
    due: "Fri 9 Oct",
    openItems: 11,
    status: "pending",
  },
];

export interface RevisionRow {
  id: string;
  project: string;
  revision: string;
  schematic: Status;
  layout: Status;
  parts: Status;
  signoff: Status;
  updated: string;
}

export const revisions: RevisionRow[] = [
  {
    id: "r1",
    project: "Power board",
    revision: "Rev C",
    schematic: "approved",
    layout: "approved",
    parts: "pending",
    signoff: "pending",
    updated: "12 min ago",
  },
  {
    id: "r2",
    project: "Motor driver",
    revision: "Rev A",
    schematic: "warning",
    layout: "pending",
    parts: "pending",
    signoff: "pending",
    updated: "2 h ago",
  },
  {
    id: "r3",
    project: "Sensor hub",
    revision: "Rev B",
    schematic: "approved",
    layout: "pending",
    parts: "approved",
    signoff: "pending",
    updated: "Yesterday",
  },
  {
    id: "r4",
    project: "USB-C dock",
    revision: "Rev D",
    schematic: "approved",
    layout: "approved",
    parts: "approved",
    signoff: "approved",
    updated: "Mon 5 Oct",
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
  revisions: number;
}

export const partAlerts: PartAlert[] = [
  {
    id: "p1",
    mpn: "IRLML6402TRPBF",
    manufacturer: "Infineon",
    from: "nrnd",
    to: "eol",
    source: "DigiKey",
    age: "1 d ago",
    revisions: 2,
  },
  {
    id: "p2",
    mpn: "LM1117IMPX-3.3/NOPB",
    manufacturer: "Texas Instruments",
    from: "active",
    to: "nrnd",
    source: "DigiKey",
    age: "2 d ago",
    revisions: 3,
  },
  {
    id: "p3",
    mpn: "10118194-0001LF",
    manufacturer: "Amphenol",
    from: "eol",
    to: "obsolete",
    source: "Mouser",
    age: "4 d ago",
    revisions: 1,
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
    who: "Mara Lin",
    action: "approved",
    target: "Schematic review, Power board Rev C",
    when: "12 min ago",
  },
  {
    id: "e2",
    who: "Theo Okafor",
    action: "replaced Q3 with DMP2035U-7 on",
    target: "Power board Rev C",
    when: "40 min ago",
  },
  {
    id: "e3",
    who: "Sam Patel",
    action: "requested a schematic review on",
    target: "Motor driver Rev A",
    when: "2 h ago",
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
    who: "Theo Okafor",
    action: "signed off",
    target: "USB-C dock Rev D",
    when: "Mon 5 Oct",
  },
];
