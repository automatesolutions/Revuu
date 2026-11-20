import {
  cleanBrief,
  deliverableFiles,
  designPrompt,
  validateBrief,
  type DesignRun,
} from "@/lib/design/brief";
import { estimateTokens } from "@/lib/parts/request";

/**
 * Checks a design brief and builds the run prompt on the server. In this milestone no key is
 * stored and no model is called: the run returns the deliverable list with no files. Nothing in
 * the brief is logged.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Revuu could not read the brief." }, { status: 400 });
  }
  const brief = cleanBrief(body);
  const errors = validateBrief(brief);
  if (Object.keys(errors).length || !brief.provider) {
    return Response.json(
      { error: "The brief is missing required fields. Revuu did not start a run.", errors },
      { status: 422 },
    );
  }
  const run: DesignRun = {
    id: crypto.randomUUID(),
    title: brief.title,
    createdAt: new Date().toISOString(),
    provider: brief.provider,
    promptTokens: estimateTokens(designPrompt(brief)),
    modelCalled: false,
    deliverables: brief.outputs.map((output) => ({ output, files: deliverableFiles[output] })),
  };
  return Response.json({ run, demo: true });
}
