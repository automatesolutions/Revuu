import {
  cleanRequest,
  comparisonPrompt,
  estimateTokens,
  partsToFetch,
  validateRequest,
} from "@/lib/parts/request";

/**
 * Checks a comparison request and builds its prompt on the server. In this milestone no key is
 * stored, no datasheet is read and no model is called. Nothing in the request is logged.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Revuu could not read the comparison." }, { status: 400 });
  }
  const comparison = cleanRequest(body);
  const errors = validateRequest(comparison);
  if (Object.keys(errors).length) {
    return Response.json(
      {
        error: "Some parts are missing an MPN or maker. Revuu did not start a comparison.",
        errors,
      },
      { status: 422 },
    );
  }
  return Response.json({
    ready: true,
    modelCalled: false,
    promptTokens: estimateTokens(comparisonPrompt(comparison)),
    toFetch: partsToFetch(comparison).map((p) => p.mpn),
    demo: true,
  });
}
