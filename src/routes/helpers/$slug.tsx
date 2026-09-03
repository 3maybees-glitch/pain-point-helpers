import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Printer, Save, Share2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { HELPER_BY_ID, categoryOf } from "@/lib/helpers/catalog";
import { emptyValues } from "@/lib/helpers/values";
import type { FormValues } from "@/lib/helpers/types";
import { loadDraft, saveDraft } from "@/lib/drafts";
import { HelperForm } from "@/components/helper-form";
import { PrintSheet } from "@/components/print-sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMembership } from "@/hooks/use-membership";
import { getSave, upsertSave } from "@/lib/server/saves";

export const Route = createFileRoute("/helpers/$slug")({
  validateSearch: (s: Record<string, unknown>): { save?: string } => {
    const out: { save?: string } = {};
    if (typeof s.save === "string") out.save = s.save;
    return out;
  },
  component: HelperPage,
});

function HelperPage() {
  const { slug } = Route.useParams();
  const { save: saveId } = Route.useSearch();
  const helper = HELPER_BY_ID[slug];
  const { user, isMember, ready } = useMembership();
  const navigate = useNavigate();
  const [values, setValues] = useState<FormValues>({});
  const [currentSave, setCurrentSave] = useState<string | undefined>(saveId);
  const loaded = useRef(false);
  const userId = user?.id ?? null;

  useEffect(() => {
    loaded.current = false;
    if (!helper) return;
    let cancelled = false;
    (async () => {
      if (saveId && userId) {
        try {
          const row = await getSave({ data: saveId });
          if (!cancelled && row) {
            setValues(row.values);
            setCurrentSave(row.id);
            loaded.current = true;
            return;
          }
        } catch {
          /* fall through to draft */
        }
      }
      const draft = loadDraft(helper.id);
      if (!cancelled) {
        setValues(draft ?? emptyValues(helper));
        loaded.current = true;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [helper?.id, saveId, userId]);

  useEffect(() => {
    if (!helper || !loaded.current) return;
    saveDraft(helper.id, values);
  }, [helper, values]);

  if (!helper) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16">
        <h1 className="font-display text-2xl">That helper isn’t in the drawer.</h1>
        <Button asChild className="mt-6">
          <Link to="/helpers">Back to the kits</Link>
        </Button>
      </main>
    );
  }

  const cat = categoryOf(helper.category);

  function fillSample() {
    setValues({ ...emptyValues(helper), ...helper.sample });
  }

  async function onSave() {
    if (!ready) return;
    if (!user) {
      await navigate({ to: "/login", search: { redirect: `/helpers/${helper.id}` } });
      return;
    }
    if (!isMember) {
      toast.error("All-access is required to save to your library.");
      await navigate({ to: "/pricing" });
      return;
    }
    try {
      const row = await upsertSave({
        data: {
          id: currentSave,
          helperId: helper.id,
          title: helper.title,
          values,
        },
      });
      setCurrentSave(row.id);
      toast.success("Saved to your library");
      await navigate({ to: "/helpers/$slug", params: { slug: helper.id }, search: { save: row.id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    }
  }

  async function onShare() {
    if (!ready) return;
    if (!isMember) {
      toast.error("All-access is required to share.");
      await navigate({ to: "/pricing" });
      return;
    }
    try {
      const row = await upsertSave({
        data: { id: currentSave, helperId: helper.id, title: helper.title, values },
      });
      setCurrentSave(row.id);
      const url = `${window.location.origin}/s/${row.shareToken}`;
      await navigator.clipboard.writeText(url);
      toast.success("Share link copied");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not share");
    }
  }

  function onPrint() {
    if (!ready) return;
    if (!isMember) {
      toast.error("All-access is required to print.");
      void navigate({ to: "/pricing" });
      return;
    }
    window.print();
  }

  function onEmail() {
    const subject = encodeURIComponent(helper.title);
    const body = encodeURIComponent(`Filled with Pain Point Helpers:\n${window.location.href}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-36 lg:pb-28">
      <p className="text-xs uppercase tracking-widest text-accent">
        {cat.label} · #{String(helper.n).padStart(2, "0")}
      </p>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <h1 className="font-display text-3xl text-ink">{helper.title}</h1>
        <Badge tone="accent">{cat.kicker}</Badge>
      </div>
      <p className="mt-3 text-muted">{helper.blurb}</p>

      <div className="no-print mt-6 flex flex-wrap gap-2">
        <Button type="button" variant="secondary" onClick={fillSample}>
          <Sparkles className="size-4" />
          Fill sample
        </Button>
        <Button type="button" variant="secondary" onClick={onPrint} disabled={!ready}>
          <Printer className="size-4" />
          Print / PDF
        </Button>
        <Button type="button" variant="secondary" onClick={onEmail}>
          Email
        </Button>
        <Button type="button" variant="secondary" onClick={onShare} disabled={!ready}>
          <Share2 className="size-4" />
          Copy share link
        </Button>
        <Button type="button" onClick={onSave} disabled={!ready}>
          <Save className="size-4" />
          Save
        </Button>
      </div>
      {!isMember ? (
        <p className="no-print mt-3 text-sm text-subtle">
          Filling is free. Saving, printing, and sharing need{" "}
          <Link to="/pricing" className="text-accent underline-offset-2 hover:underline">
            all-access
          </Link>
          .
        </p>
      ) : null}

      <div className="no-print mt-8 rounded-xl border border-line bg-surface p-4 sm:p-6">
        <HelperForm helper={helper} values={values} onChange={setValues} />
      </div>

      {isMember ? (
        <div className="mt-10 hidden print:block">
          <PrintSheet helper={helper} values={values} />
        </div>
      ) : null}
    </div>
  );
}
