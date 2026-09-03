import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText, Printer, Share2 } from "lucide-react";
import { CATEGORIES, HELPERS } from "@/lib/helpers/catalog";
import { PLANS, SOLO_BUNDLE_VALUE } from "@/lib/helpers/plans";
import { PAGE_GUIDES } from "@/lib/helpers/guides";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mark } from "@/components/site-chrome";
import { MascotTip } from "@/components/mascot";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const featured = [...HELPERS.slice(0, 4), ...HELPERS.filter((h) => h.category === "calcs").slice(0, 2)];
  return (
    <div>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-16 lg:pb-24">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-accent">
            {HELPERS.length} kits. One membership. Meet Maybee.
          </p>
          <h1 className="mt-4 max-w-xl font-display text-4xl leading-tight text-ink sm:text-5xl">
            A friendly drawer of kits that delete a Sunday-night task.
          </h1>
          <p className="mt-5 max-w-lg text-xl leading-relaxed text-muted">
            Not “be more organized.” Stop reinventing this spreadsheet. Fill a kit or run a family, work, and life calc —
            then print a clean PDF, share it, or save it. Maybee, our house bee, explains every page.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/helpers">
                Browse the drawer
                <ArrowRight className="size-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/pricing">All-access from ${PLANS[0]!.price} / mo</Link>
            </Button>
          </div>
          <p className="mt-4 text-base text-subtle">
            Bought separately these kits run ${SOLO_BUNDLE_VALUE.toLocaleString()}+. All-access is the whole drawer.
          </p>
        </div>
        <div className="relative">
          <MascotTip pose="wave" size="lg" className="mb-4 bg-wash">
            {PAGE_GUIDES.home}
          </MascotTip>
          <div className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Mark className="size-8" />
                <span className="font-display text-lg text-ink">Sinking-funds + bill calendar</span>
              </div>
              <Badge tone="accent">01 / {String(HELPERS.length).padStart(2, "0")}</Badge>
            </div>
            <dl className="mt-4 grid gap-3 text-base">
              <div className="flex justify-between border-b border-dotted border-line pb-2">
                <dt className="text-muted">Car insurance</dt>
                <dd className="tabular-nums">$120 / mo</dd>
              </div>
              <div className="flex justify-between border-b border-dotted border-line pb-2">
                <dt className="text-muted">Christmas</dt>
                <dd className="tabular-nums">$75 / mo</dd>
              </div>
              <div className="flex justify-between border-b border-dotted border-line pb-2">
                <dt className="text-muted">Vet / pets</dt>
                <dd className="tabular-nums">$40 / mo</dd>
              </div>
              <div className="flex justify-between pt-1 font-medium">
                <dt>This month’s set-aside</dt>
                <dd className="tabular-nums">$235</dd>
              </div>
            </dl>
            <p className="mt-5 text-base text-subtle">A filled helper, ready to print or send.</p>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
          {[
            { icon: FileText, title: "Fill online", body: "Real fields, running totals, checklists. Not a locked PDF you have to print blank." },
            { icon: Printer, title: "Print or save PDF", body: "A clean letter-size sheet. Use the browser’s Save as PDF. Take it to the meeting." },
            { icon: Share2, title: "Share or keep", body: "Email, text, or a private link. Signed-in members keep a library across devices." },
          ].map((item) => (
            <div key={item.title} className="flex gap-3">
              <item.icon className="mt-1 size-6 shrink-0 text-accent" />
              <div>
                <h2 className="font-display text-xl text-ink">{item.title}</h2>
                <p className="mt-1 text-base text-muted">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-accent">A sample of the drawer</p>
            <h2 className="mt-2 font-display text-3xl text-ink">Start with a specific pain.</h2>
          </div>
          <Button asChild variant="secondary">
            <Link to="/helpers">All kits</Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((h) => (
            <Link
              key={h.id}
              to="/helpers/$slug"
              params={{ slug: h.id }}
              className="rounded-xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] hover:border-line-strong"
            >
              <p className="text-sm text-subtle">{String(h.n).padStart(2, "0")} · {CATEGORIES.find((c) => c.id === h.category)?.label}</p>
              <h3 className="mt-2 font-display text-xl text-ink">{h.title}</h3>
              <p className="mt-1 line-clamp-3 text-base text-muted">{h.blurb}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
