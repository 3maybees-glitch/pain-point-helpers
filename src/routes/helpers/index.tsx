import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CATEGORIES, HELPERS } from "@/lib/helpers/catalog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/helpers/")({
  validateSearch: (s: Record<string, unknown>): { cat?: string; q?: string } => {
    const out: { cat?: string; q?: string } = {};
    if (typeof s.cat === "string") out.cat = s.cat;
    if (typeof s.q === "string") out.q = s.q;
    return out;
  },
  component: HelpersIndex,
});

function HelpersIndex() {
  const { cat, q } = Route.useSearch();
  const navigate = useNavigate();
  const [draft, setDraft] = useState(q ?? "");
  const query = draft.trim().toLowerCase();
  const list = HELPERS.filter((h) => {
    if (cat && h.category !== cat) return false;
    if (!query) return true;
    return `${h.title} ${h.blurb} ${h.id}`.toLowerCase().includes(query);
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 pb-28">
      <p className="text-xs font-medium uppercase tracking-widest text-accent">The drawer</p>
      <h1 className="mt-2 font-display text-4xl text-ink">The 50</h1>
      <p className="mt-3 max-w-xl text-muted">Each one deletes a specific Sunday-night task. Fill it, print it, keep it.</p>

      <label className="mt-6 block max-w-md">
        <span className="sr-only">Search helpers</span>
        <Input
          type="search"
          value={draft}
          placeholder="Search the drawer — invoice, sleep, school…"
          autoComplete="off"
          onChange={(e) => {
            const next = e.target.value;
            setDraft(next);
            void navigate({
              to: "/helpers",
              search: { cat, q: next.trim() ? next : undefined },
            });
          }}
        />
      </label>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          to="/helpers"
          search={{ q }}
          className={`rounded-full px-3 py-2 text-sm ${!cat ? "bg-accent text-accent-fg" : "bg-ink/5 text-muted hover:text-ink"}`}
        >
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            to="/helpers"
            search={{ cat: c.id, q }}
            className={`rounded-full px-3 py-2 text-sm ${cat === c.id ? "bg-accent text-accent-fg" : "bg-ink/5 text-muted hover:text-ink"}`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-10">
        {CATEGORIES.filter((c) => !cat || c.id === cat).map((c) => {
          const items = list.filter((h) => h.category === c.id);
          if (items.length === 0) return null;
          return (
            <section key={c.id}>
              <div className="mb-4 flex items-baseline justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-accent">{c.kicker}</p>
                  <h2 className="font-display text-2xl text-ink">{c.label}</h2>
                </div>
                <Badge>{c.range}</Badge>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {items.map((h) => (
                  <Link
                    key={h.id}
                    to="/helpers/$slug"
                    params={{ slug: h.id }}
                    className="rounded-xl border border-line bg-surface p-4 hover:border-line-strong"
                  >
                    <p className="text-xs text-subtle">{String(h.n).padStart(2, "0")}</p>
                    <h3 className="mt-1 font-display text-lg text-ink">{h.title}</h3>
                    <p className="mt-1 text-sm text-muted">{h.blurb}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      {list.length === 0 ? (
        <p className="mt-10 text-muted">Nothing in the drawer matches that. Try another word, or clear search.</p>
      ) : null}
    </div>
  );
}
