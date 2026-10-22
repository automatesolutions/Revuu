import { ImageResponse } from "next/og";
import { OgCard, ogFonts, ogSize } from "@/lib/og";

export const alt = "Revuu: compare every part before you order";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <OgCard
      title="Compare every part before you order."
      subtitle="BOM import and alternate comparison for electrical and mechanical parts."
    />,
    { ...size, fonts: await ogFonts() },
  );
}
