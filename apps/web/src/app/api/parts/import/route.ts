import { guessMapping } from "@/lib/parts/fields";
import {
  importFailedDescription,
  importFailedTitle,
  maxUploadBytes,
  tooLargeMessage,
  wrongFileMessage,
} from "@/lib/parts/messages";
import { parsePartsFile, readDemoFile } from "@/lib/parts/parse-file";

const importFailed = `${importFailedTitle} ${importFailedDescription}`;

/**
 * Reads a parts list and returns its header, rows and a guessed column mapping. Nothing is
 * created here: the engineer confirms the mapping first. `?demo=xlsx|csv` reads the checked-in
 * demo list instead of an upload.
 */
export async function POST(request: Request) {
  const demo = new URL(request.url).searchParams.get("demo");
  let fileName: string;
  let bytes: Uint8Array;

  if (demo === "xlsx" || demo === "csv") {
    ({ name: fileName, bytes } = await readDemoFile(demo));
  } else {
    let file: FormDataEntryValue | null = null;
    try {
      file = (await request.formData()).get("file");
    } catch {
      file = null;
    }
    if (!(file instanceof File)) return Response.json({ error: importFailed }, { status: 400 });
    if (file.size > maxUploadBytes)
      return Response.json({ error: tooLargeMessage }, { status: 413 });
    fileName = file.name;
    bytes = new Uint8Array(await file.arrayBuffer());
  }

  const result = parsePartsFile(fileName, bytes, demo !== null);
  if (!result.ok) {
    return result.reason === "wrong-type"
      ? Response.json({ error: wrongFileMessage }, { status: 415 })
      : Response.json({ error: importFailed }, { status: 422 });
  }
  return Response.json({ sheet: result.sheet, mapping: guessMapping(result.sheet.headers) });
}
