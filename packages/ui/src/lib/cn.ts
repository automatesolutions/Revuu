import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "display-xl",
        "display-lg",
        "display-md",
        "headline",
        "page-title",
        "title",
        "body-lg",
        "subtitle",
        "body",
        "body-sm",
        "ui",
        "label",
        "button",
        "caption",
        "micro",
        "data",
      ],
      radius: ["xs", "sm", "md", "lg", "xl", "pill", "full"],
      shadow: ["popover", "dialog"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
