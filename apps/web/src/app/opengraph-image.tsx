import { ImageResponse } from "next/og";
import { OgCard, ogFonts, ogSize } from "@/lib/og";

export const alt = "Revuu: review the board before it ships";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <OgCard
      title="Review the board before it ships."
      subtitle="Schematic, layout and parts reviews, signed off before release."
    />,
    { ...size, fonts: await ogFonts() },
  );
}
