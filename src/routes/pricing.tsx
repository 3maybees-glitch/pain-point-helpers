import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PLANS, SOLO_BUNDLE_VALUE, type PlanId } from "@/lib/helpers/plans";
import { Button } from "@/components/ui/button";
import { useMembership } from "@/hooks/use-membership";
import { activateMembership } from "@/lib/server/membership";
import { toast } from "sonner";

export const Route = createFileRoute("/pricing")({ component: Pricing });

function Pricing() {
  const { user, isMember, member } = useMembership();
  const navigate = useNavigate();
  const [busy, setBusy] = useState<PlanId | null>(null);

  async function activate(plan: PlanId) {
    if (!user) {
      await navigate({ to: "/login", search: { redirect: "/pricing" } });
      return;
    }
    setBusy(plan);
    try {
      await activateMembership({ data: plan });
      toast.success("All-access is on. The drawer is yours.");
      await navigate({ to: "/helpers" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not activate");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 pb-28">
      <p className="text-xs font-medium uppercase tracking-widest text-accent">All-access</p>
      <h1 className="mt-2 max-w-xl font-display text-4xl text-ink">One membership. Every kit and calc.</h1>
      <p className="mt-4 max-w-xl text-muted">
        Fill any helper online, print a clean PDF, share a link, or keep a library. Sold one-by-one the drawer is $
        {SOLO_BUNDLE_VALUE.toLocaleString()}+.
      </p>
      {isMember ? (
        <p className="mt-4 text-sm text-accent">You’re on {member?.plan} all-access.</p>
      ) : null}

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {PLANS.map((plan, i) => (
          <div
            key={plan.id}
            className={`rounded-xl border bg-surface p-5 shadow-[var(--shadow-card)] ${i === 1 ? "border-accent" : "border-line"}`}
          >
            <p className="text-xs uppercase tracking-widest text-accent">{plan.name}</p>
            <p className="mt-3 font-display text-4xl text-ink">
              ${plan.price}
              <span className="text-lg text-muted">{plan.period}</span>
            </p>
            <p className="mt-3 text-sm text-muted">{plan.blurb}</p>
            <Button className="mt-6 w-full" disabled={busy === plan.id} onClick={() => activate(plan.id)}>
              {busy === plan.id ? "Activating…" : isMember ? "Switch to this plan" : "Get all-access"}
            </Button>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-subtle">
        Preview checkout is instant (no card). On a live Vercel deploy, connect Stripe and a Neon database so membership
        persists. <Link to="/helpers" className="underline-offset-2 hover:underline">Browse first</Link> — filling is free.
      </p>
    </div>
  );
}
