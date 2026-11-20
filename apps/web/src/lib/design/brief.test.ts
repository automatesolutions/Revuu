import { describe, expect, it } from "vitest";
import { cleanRequest, comparisonPrompt, validateRequest } from "@/lib/parts/request";
import { cleanBrief, designPrompt, emptyBrief, validateBrief, type DesignBrief } from "./brief";

const complete: DesignBrief = {
  ...emptyBrief(),
  title: "Sensor hub",
  description: "Reads 4 sensors.",
  specification: "24 V in.",
  outputs: ["schematic", "document"],
  provider: "openai",
};

describe("design brief", () => {
  it("refuses an empty brief and names every missing field", () => {
    expect(Object.keys(validateBrief(emptyBrief())).sort()).toEqual(
      ["description", "outputs", "provider", "specification", "title"].sort(),
    );
  });

  it("asks only for what the chosen outputs need", () => {
    expect(validateBrief(complete)).toEqual({});
    const pcb = validateBrief({ ...complete, outputs: ["pcb"] });
    expect(Object.keys(pcb).sort()).toEqual(["layers", "partLimits", "pcbSize"]);
    const enclosure = validateBrief({ ...complete, outputs: ["enclosure"] });
    expect(Object.keys(enclosure).sort()).toEqual(["enclosureSize", "pcbSize"]);
  });

  it("needs stack-up notes for impedance and a standard for safety", () => {
    const errors = validateBrief({
      ...complete,
      outputs: ["pcb"],
      pcbSize: "80 × 50 mm",
      layers: "4",
      partLimits: "0402 min",
      focus: ["impedance", "safety"],
    });
    expect(Object.keys(errors).sort()).toEqual(["stackup", "standards"]);
  });

  it("drops unknown values from untrusted input", () => {
    const brief = cleanBrief({
      title: "  Hub  ",
      outputs: ["pcb", "firmware", "pcb"],
      standards: ["IEC 62368-1", "Made up"],
      provider: "revuu",
      apiKey: "sk-should-not-survive",
    });
    expect(brief.title).toBe("Hub");
    expect(brief.outputs).toEqual(["pcb"]);
    expect(brief.standards).toEqual(["IEC 62368-1"]);
    expect(brief.provider).toBeNull();
    expect(JSON.stringify(brief)).not.toContain("sk-should-not-survive");
  });

  it("puts every field and the design checks in one prompt", () => {
    const prompt = designPrompt({ ...complete, pcbSize: "80 × 50 mm" });
    for (const text of ["Sensor hub", "80 × 50 mm", "KiCad schematic", "Creepage", "DRC"]) {
      expect(prompt).toContain(text);
    }
    expect(prompt).not.toContain("Onshape enclosure");
  });
});

describe("comparison request", () => {
  it("needs an MPN and maker for every part, and no repeated MPN", () => {
    const request = cleanRequest({
      original: { mpn: "IRLML6402TRPBF", maker: "Infineon" },
      candidates: [
        { mpn: "irlml6402trpbf", maker: "Infineon" },
        { mpn: "", maker: "" },
      ],
    });
    expect(validateRequest(request)).toEqual({
      "candidates.0.mpn": "irlml6402trpbf is already in this comparison.",
      "candidates.1.mpn": "Enter the MPN of candidate 2.",
      "candidates.1.maker": "Enter the maker of candidate 2.",
    });
  });

  it("keeps at most 4 candidates and asks for page-cited numbers", () => {
    const request = cleanRequest({
      original: { mpn: "A", maker: "M" },
      candidates: Array.from({ length: 6 }, (_, i) => ({ mpn: `C${i}`, maker: "M" })),
    });
    expect(request.candidates).toHaveLength(4);
    const prompt = comparisonPrompt(request);
    expect(prompt).toContain("Cite the document and page for every number.");
    expect(prompt).toContain("Drop-in, Rework or Not acceptable");
  });
});
