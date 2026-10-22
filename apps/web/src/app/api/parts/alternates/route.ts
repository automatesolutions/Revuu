import { findAlternates, findRecord, vendorRecords } from "@/fixtures/parts/records";
import { compareAlternates } from "@/lib/parts/compare";
import type { VendorContact } from "@/lib/parts/types";

function cleanVendors(input: unknown): VendorContact[] {
  if (!Array.isArray(input)) return [];
  const text = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
  return input.flatMap((v) => {
    const name = text(v?.name);
    return name ? [{ name, email: text(v.email), phone: text(v.phone), url: text(v.url) }] : [];
  });
}

/**
 * Compares a part with its alternates from the demo part records. Vendor contacts from the
 * imported list come in the body and take precedence over the vendor record. No distributor or
 * model is called.
 */
export async function POST(request: Request) {
  let body: { mpn?: unknown; vendors?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Revuu could not read the request." }, { status: 400 });
  }
  if (typeof body.mpn !== "string" || !body.mpn.trim()) {
    return Response.json({ error: "Revuu needs an MPN to find alternates." }, { status: 400 });
  }
  const record = findRecord(body.mpn);
  const alternates = findAlternates(body.mpn);
  const comparison =
    record && alternates.length
      ? compareAlternates(record, alternates, cleanVendors(body.vendors), vendorRecords)
      : null;
  return Response.json({ record, comparison, demo: true });
}
