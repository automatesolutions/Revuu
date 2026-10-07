import Link from "next/link";
import { notFound } from "next/navigation";
import { artboards, getArtboard, themes, widths } from "@/artboards/registry";

const SCALE = 0.5;
const FRAME_HEIGHT = 900;

export const instant = false;

export function generateStaticParams() {
  return artboards.map((a) => ({ id: a.id }));
}

export default async function ArtboardCanvas({ params }: PageProps<"/artboards/[id]">) {
  const { id } = await params;
  const board = getArtboard(id);
  if (!board) notFound();

  return (
    <div className="min-h-dvh bg-sunken text-ink">
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-hairline bg-canvas px-6">
        <Link href="/artboards" className="text-ui text-ink-muted hover:text-ink">
          Artboards
        </Link>
        <span aria-hidden className="text-ink-subtle">
          /
        </span>
        <h1 className="font-sans text-label">{board.title}</h1>
        <p className="ml-auto hidden text-ui text-ink-muted md:block">{board.brief}</p>
      </header>

      <main className="grid gap-12 overflow-x-auto px-6 py-8">
        {board.states.map((state) => (
          <section key={state} aria-labelledby={`state-${state}`} className="grid gap-6">
            <h2 id={`state-${state}`} className="font-sans text-label capitalize">
              {state.replace(/-/g, " ")}
            </h2>
            {themes.map((theme) => (
              <div key={theme} className="flex items-start gap-6">
                {widths.map((width) => {
                  const src = `/artboards/${board.id}/frame/${theme}/${state}`;
                  return (
                    <figure key={width} className="grid shrink-0 gap-2">
                      <figcaption className="flex items-center justify-between gap-3 text-caption font-medium text-ink-subtle">
                        <span>
                          {width} px · {theme}
                        </span>
                        <a
                          href={src}
                          target="_blank"
                          rel="noreferrer"
                          className="text-accent hover:underline"
                        >
                          Open
                        </a>
                      </figcaption>
                      <div
                        className="overflow-hidden rounded-md bg-canvas shadow-[0_0_0_1px_var(--color-hairline-strong)]"
                        style={{ width: width * SCALE, height: FRAME_HEIGHT * SCALE }}
                      >
                        <iframe
                          src={src}
                          title={`${board.title}, ${state}, ${theme}, ${width} px`}
                          loading="lazy"
                          width={width}
                          height={FRAME_HEIGHT}
                          style={{ transform: `scale(${SCALE})`, transformOrigin: "0 0" }}
                          className="border-0"
                        />
                      </div>
                    </figure>
                  );
                })}
              </div>
            ))}
          </section>
        ))}
      </main>
    </div>
  );
}
