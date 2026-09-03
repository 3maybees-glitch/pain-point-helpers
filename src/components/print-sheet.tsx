import { formatMoneyExact, parseMoney } from "@/lib/utils";
import type { FormValues, HelperDef } from "@/lib/helpers/types";
import { categoryOf } from "@/lib/helpers/catalog";
import { checksMap, tableRows, sumColumn } from "@/lib/helpers/values";

export function PrintSheet({
  helper,
  values,
}: {
  helper: HelperDef;
  values: FormValues;
}) {
  const cat = categoryOf(helper.category);
  return (
    <article className="print-sheet mx-auto max-w-[8.5in] bg-white text-black">
      <header className="flex items-start justify-between gap-4 border-b-2 border-black pb-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-neutral-500">
            Pain Point Helpers · {cat.label} · #{String(helper.n).padStart(2, "0")}
          </p>
          <h1 className="mt-1 font-display text-2xl leading-tight">{helper.title}</h1>
          <p className="mt-1 text-sm text-neutral-600">{helper.blurb}</p>
        </div>
        <div className="text-right text-xs text-neutral-600">
          <p>{String(values.preparedBy ?? "")}</p>
          <p>{String(values.preparedOn ?? values.date ?? "")}</p>
        </div>
      </header>

      {(helper.identity ?? [])
        .filter((f) => !["preparedBy", "preparedOn"].includes(f.id) && String(values[f.id] ?? "").trim())
        .length > 0 && (
        <section className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
          {(helper.identity ?? [])
            .filter((f) => !["preparedBy", "preparedOn"].includes(f.id))
            .map((f) => (
              <p key={f.id}>
                <span className="text-neutral-500">{f.label}: </span>
                {String(values[f.id] ?? "")}
              </p>
            ))}
        </section>
      )}

      {helper.blocks.map((block, i) => {
        if (block.kind === "fields") {
          return (
            <section key={i} className="mt-5">
              {block.title ? <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide">{block.title}</h2> : null}
              <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                {block.fields.map((f) => (
                  <div key={f.id} className={f.span === 2 ? "col-span-2" : ""}>
                    <dt className="text-neutral-500">{f.label}</dt>
                    <dd className="whitespace-pre-wrap">{String(values[f.id] ?? "")}</dd>
                  </div>
                ))}
              </dl>
            </section>
          );
        }
        if (block.kind === "table") {
          const rows = tableRows(values, block.id);
          const total = block.sum ? sumColumn(values, block.id, block.sum) : null;
          return (
            <section key={block.id} className="mt-5">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide">{block.title}</h2>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-black">
                    {block.columns.map((c) => (
                      <th key={c.id} className="py-1 font-medium">
                        {c.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, ri) => (
                    <tr key={ri} className="border-b border-neutral-200">
                      {block.columns.map((c) => (
                        <td key={c.id} className="py-1">
                          {c.type === "currency" ? formatMoneyExact(parseMoney(row[c.id])) : String(row[c.id] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {total != null ? <p className="mt-2 text-right text-sm font-semibold">Total {formatMoneyExact(total)}</p> : null}
            </section>
          );
        }
        if (block.kind === "checks") {
          const map = checksMap(values, block.id);
          return (
            <section key={block.id} className="mt-5">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide">{block.title}</h2>
              <ul className="grid gap-1 text-sm">
                {block.items.map((item) => (
                  <li key={item.id}>
                    {map[item.id] ? "☑" : "☐"} {item.label}
                  </li>
                ))}
              </ul>
            </section>
          );
        }
        if (block.kind === "prompts") {
          return (
            <section key={i} className="mt-5">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide">{block.title}</h2>
              <ol className="list-decimal space-y-1 pl-5 text-sm">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </section>
          );
        }
        return (
          <p key={i} className="mt-5 text-sm italic text-neutral-600">
            {block.body}
          </p>
        );
      })}
    </article>
  );
}
