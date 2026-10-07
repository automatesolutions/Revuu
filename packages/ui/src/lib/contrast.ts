function channel(hex: string, start: number): number {
  const value = parseInt(hex.slice(start, start + 2), 16) / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

export function parseHex(hex: string): string {
  const match = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match?.[1]) throw new Error(`Expected a 6-digit hex color, got "${hex}"`);
  return `#${match[1].toLowerCase()}`;
}

export function luminance(hex: string): number {
  const h = parseHex(hex);
  return 0.2126 * channel(h, 1) + 0.7152 * channel(h, 3) + 0.0722 * channel(h, 5);
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}
