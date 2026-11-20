import { ImageResponse } from "next/og";
import { OgCard, ogFonts, ogSize } from "@/lib/og";

export const alt = "Revuu: hardware design and parts comparison";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <OgCard
      title="Hardware design and parts comparison."
      subtitle="Replacement judgement for any part, and one design run from a complete brief."
    />,
    { ...size, fonts: await ogFonts() },
  );
}
