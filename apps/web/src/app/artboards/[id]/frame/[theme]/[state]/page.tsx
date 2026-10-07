import { notFound } from "next/navigation";
import { artboards, getArtboard, themes } from "@/artboards/registry";

export const instant = false;

export function generateStaticParams() {
  return artboards.flatMap((board) =>
    themes.flatMap((theme) => board.states.map((state) => ({ id: board.id, theme, state }))),
  );
}

export default async function ArtboardFrame({
  params,
}: PageProps<"/artboards/[id]/frame/[theme]/[state]">) {
  const { id, theme, state } = await params;
  const board = getArtboard(id);
  if (!board || !board.states.includes(state) || !(themes as readonly string[]).includes(theme))
    notFound();

  return (
    <div data-theme={theme} className="min-h-dvh bg-canvas text-ink">
      {board.render(state)}
    </div>
  );
}
