import { Button } from "@revuu/ui/components/button";
import { Input } from "@revuu/ui/components/field";
import { Icon, type IconName } from "@revuu/ui/components/icon";
import { cn } from "@revuu/ui/lib/cn";
import { panel } from "./parts/parts-ui";

const keys: { id: string; name: string; use: string; icon: IconName; placeholder: string }[] = [
  {
    id: "anthropic",
    name: "Anthropic API key",
    use: "Part comparison. Reads datasheet pages and writes the judgement.",
    icon: "git-compare",
    placeholder: "sk-ant-…",
  },
  {
    id: "openai",
    name: "OpenAI API key",
    use: "Hardware design runs.",
    icon: "circuit-board",
    placeholder: "sk-…",
  },
  {
    id: "astra",
    name: "Astra MCP or API key",
    use: "Hardware design runs.",
    icon: "circuit-board",
    placeholder: "Astra key or MCP token",
  },
];

/** /app/settings: where model keys connect. Key storage is not built yet, so nothing saves. */
export function Settings() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="grid max-w-[46rem] gap-1">
        <h1 className="text-page-title">Settings</h1>
        <p className="text-body-sm text-ink-muted">
          Your own model keys pay for comparisons and design runs. Revuu never runs a design on a
          key that Revuu owns.
        </p>
      </div>

      <section aria-labelledby="keys-title" className={cn(panel, "max-w-[46rem]")}>
        <div className="grid gap-1 border-b border-hairline px-4 py-3 sm:px-5">
          <h2 id="keys-title" className="text-[0.9375rem] font-bold">
            Model keys
          </h2>
          <p className="text-caption font-medium text-ink-subtle">
            Keys go to Secret Manager on Revuu&rsquo;s server. They never reach this page again, and
            Revuu never logs them.
          </p>
        </div>
        <ul className="divide-y divide-hairline">
          {keys.map((key) => (
            <li key={key.id} className="grid gap-3 px-4 py-4 sm:px-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="grid gap-0.5">
                  <p className="flex items-center gap-2 text-ui font-semibold">
                    <Icon name={key.icon} className="text-ink-subtle" />
                    {key.name}
                  </p>
                  <p className="text-caption font-medium text-ink-subtle">{key.use}</p>
                </div>
                <span className="inline-flex h-[1.375rem] items-center gap-1 rounded-xs bg-sunken px-2 text-label text-ink-muted">
                  <Icon name="circle-dashed" className="size-3.5" />
                  Not connected
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <label htmlFor={`key-${key.id}`} className="sr-only">
                  {key.name}
                </label>
                <Input
                  id={`key-${key.id}`}
                  type="password"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder={key.placeholder}
                  disabled
                  aria-describedby="keys-blocked"
                  className="min-w-0 flex-1 basis-60 font-mono"
                />
                <Button icon="lock" disabled aria-describedby="keys-blocked">
                  Save key
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <p
          id="keys-blocked"
          className="flex items-start gap-2 border-t border-hairline bg-surface px-4 py-3 text-caption font-medium text-ink-muted sm:px-5"
        >
          <Icon name="info" className="mt-px size-3.5" />
          Key storage is not live in the demo workspace. Until it is, Revuu calls no model, so no
          key is needed to try the comparison and the design wizard.
        </p>
      </section>
    </div>
  );
}
