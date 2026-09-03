import type { CalcResult, FormValues, HelperDef } from "@/lib/helpers/types";

export function CalcResults({
  helper,
  values,
  print,
}: {
  helper: HelperDef;
  values: FormValues;
  print?: boolean;
}) {
  if (!helper.compute) return null;
  const rows = helper.compute(values);
  if (rows.length === 0) {
    return print ? null : (
      <p className="text-sm text-subtle">Fill the numbers — the math shows up here.</p>
    );
  }
  return (
    <section className={print ? "mt-5" : "rounded-lg border border-accent/25 bg-wash p-4 sm:p-5"}>
      <h3 className={print ? "mb-2 text-sm font-semibold uppercase tracking-wide" : "font-display text-lg text-ink"}>
        The math
      </h3>
      <dl className={print ? "grid grid-cols-2 gap-x-6 gap-y-2 text-sm" : "mt-3 grid gap-3 sm:grid-cols-2"}>
        {rows.map((row) => (
          <ResultRow key={row.id} row={row} print={print} />
        ))}
      </dl>
    </section>
  );
}

function ResultRow({ row, print }: { row: CalcResult; print?: boolean }) {
  return (
    <div className={print ? "" : "min-h-11"}>
      <dt className={print ? "text-neutral-500" : "text-xs uppercase tracking-widest text-muted"}>{row.label}</dt>
      <dd className={print ? "font-semibold" : "mt-0.5 font-display text-xl text-ink tabular-nums"}>{row.value}</dd>
      {row.hint ? <p className={print ? "text-xs text-neutral-500" : "mt-1 text-xs text-subtle"}>{row.hint}</p> : null}
    </div>
  );
}
