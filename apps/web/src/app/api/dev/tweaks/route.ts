import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { TweakValues } from "@revuu/ui/tweakable";

const tweaksFile = path.join(process.cwd(), "tweaks.json");
const allowedName = /^--[a-z0-9-]+$/;
const allowedValue = /^(#[0-9a-fA-F]{6}|-?\d+(\.\d+)?(px|rem))$/;

function devOnly() {
  return process.env.NODE_ENV === "development"
    ? null
    : Response.json({ error: "Tweaks are only available in development." }, { status: 404 });
}

export async function GET() {
  const blocked = devOnly();
  if (blocked) return blocked;
  try {
    return Response.json(JSON.parse(await readFile(tweaksFile, "utf8")));
  } catch {
    return Response.json({ light: {}, dark: {} } satisfies TweakValues);
  }
}

export async function POST(request: Request) {
  const blocked = devOnly();
  if (blocked) return blocked;

  const body = (await request.json()) as Partial<TweakValues>;
  const clean: TweakValues = { light: {}, dark: {} };
  for (const theme of ["light", "dark"] as const) {
    for (const [name, value] of Object.entries(body[theme] ?? {})) {
      if (!allowedName.test(name) || typeof value !== "string" || !allowedValue.test(value)) {
        return Response.json(
          { error: `Rejected ${theme} ${name}: ${String(value)}` },
          { status: 400 },
        );
      }
      clean[theme][name] = value;
    }
  }

  await writeFile(tweaksFile, `${JSON.stringify(clean, null, 2)}\n`);
  return Response.json({ saved: Object.keys(clean.light).length + Object.keys(clean.dark).length });
}
