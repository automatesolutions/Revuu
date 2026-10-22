import { connection } from "next/server";
import { readDemoFile } from "@/lib/parts/parse-file";

const types = {
  csv: "text/csv; charset=utf-8",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
} as const;

/** Downloads the checked-in demo parts list, so an engineer can try the upload path with it. */
export async function GET(request: Request) {
  await connection();
  const format = new URL(request.url).searchParams.get("format") === "csv" ? "csv" : "xlsx";
  const { name, bytes } = await readDemoFile(format);
  return new Response(bytes, {
    headers: {
      "Content-Type": types[format],
      "Content-Disposition": `attachment; filename="${name}"`,
    },
  });
}
