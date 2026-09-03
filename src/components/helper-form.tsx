import type { Block, Field, FormValues, HelperDef, Json } from "@/lib/helpers/types";
import { checksMap, sumColumn, tableRows } from "@/lib/helpers/values";
import { formatMoneyExact } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalcResults } from "@/components/calc-results";

function setAt(values: FormValues, id: string, next: Json): FormValues {
  return { ...values, [id]: next };
}

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: Json;
  onChange: (v: Json) => void;
}) {
  const common = {
    id: field.id,
    value: value == null ? "" : String(value),
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
    placeholder: field.placeholder,
  };
  if (field.type === "textarea") {
    return <Textarea rows={field.rows ?? 3} {...common} />;
  }
  if (field.type === "select") {
    return (
      <select
        id={field.id}
        className="h-11 w-full rounded-md border border-line bg-surface px-3 text-sm"
        value={common.value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select</option>
        {(field.options ?? []).map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  }
  const inputType =
    field.type === "currency" || field.type === "number" || field.type === "percent"
      ? "text"
      : field.type;
  return <Input type={inputType} inputMode={field.type === "currency" || field.type === "number" ? "decimal" : undefined} {...common} />;
}

function FieldsBlock({
  title,
  fields,
  values,
  onChange,
}: {
  title?: string;
  fields: Field[];
  values: FormValues;
  onChange: (next: FormValues) => void;
}) {
  return (
    <section className="grid gap-4">
      {title ? <h3 className="font-display text-lg text-ink">{title}</h3> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.id} className={f.span === 2 ? "sm:col-span-2" : ""}>
            <Label htmlFor={f.id}>{f.label}</Label>
            <div className="mt-1.5">
              <FieldControl field={f} value={values[f.id] ?? ""} onChange={(v) => onChange(setAt(values, f.id, v))} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TableBlock({
  block,
  values,
  onChange,
}: {
  block: Extract<Block, { kind: "table" }>;
  values: FormValues;
  onChange: (next: FormValues) => void;
}) {
  const rows = tableRows(values, block.id);
  const setRows = (next: Array<Record<string, Json>>) => onChange(setAt(values, block.id, next));
  const total = block.sum ? sumColumn(values, block.id, block.sum) : null;
  return (
    <section className="grid gap-3">
      <div className="flex items-end justify-between gap-3">
        <h3 className="font-display text-lg text-ink">{block.title}</h3>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => {
            const row: Record<string, Json> = {};
            for (const c of block.columns) row[c.id] = "";
            setRows([...rows, row]);
          }}
        >
          Add row
        </Button>
      </div>
      <div className="overflow-x-auto rounded-md border border-line">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="bg-wash/60 text-muted">
            <tr>
              {block.columns.map((c) => (
                <th key={c.id} className="px-2 py-2 font-medium">
                  {c.label}
                </th>
              ))}
              <th className="w-12 px-2 py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-line">
                {block.columns.map((c) => (
                  <td key={c.id} className="p-1">
                    <Input
                      value={row[c.id] == null ? "" : String(row[c.id])}
                      onChange={(e) => {
                        const next = rows.map((r, idx) => (idx === i ? { ...r, [c.id]: e.target.value } : r));
                        setRows(next);
                      }}
                    />
                  </td>
                ))}
                <td className="p-1">
                  <button
                    type="button"
                    className="grid size-11 place-items-center text-subtle hover:text-mark"
                    aria-label="Remove row"
                    onClick={() => setRows(rows.filter((_, idx) => idx !== i))}
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {total != null ? (
        <p className="text-right text-sm font-medium tabular-nums text-ink">
          Total {formatMoneyExact(total)}
        </p>
      ) : null}
    </section>
  );
}

export function HelperForm({
  helper,
  values,
  onChange,
}: {
  helper: HelperDef;
  values: FormValues;
  onChange: (next: FormValues) => void;
}) {
  return (
    <div className="grid gap-8">
      {(helper.identity ?? []).length > 0 ? (
        <FieldsBlock fields={helper.identity ?? []} values={values} onChange={onChange} />
      ) : null}
      {helper.blocks.map((block, i) => {
        if (block.kind === "fields") {
          return <FieldsBlock key={i} title={block.title} fields={block.fields} values={values} onChange={onChange} />;
        }
        if (block.kind === "table") {
          return <TableBlock key={block.id} block={block} values={values} onChange={onChange} />;
        }
        if (block.kind === "checks") {
          const map = checksMap(values, block.id);
          return (
            <section key={block.id} className="grid gap-3">
              <h3 className="font-display text-lg text-ink">{block.title}</h3>
              <ul className="grid gap-2">
                {block.items.map((item) => (
                  <li key={item.id}>
                    <label className="flex min-h-11 items-center gap-3 text-sm">
                      <input
                        type="checkbox"
                        className="size-4 accent-accent"
                        checked={Boolean(map[item.id])}
                        onChange={(e) =>
                          onChange(setAt(values, block.id, { ...map, [item.id]: e.target.checked }))
                        }
                      />
                      {item.label}
                    </label>
                  </li>
                ))}
              </ul>
            </section>
          );
        }
        if (block.kind === "prompts") {
          return (
            <section key={i} className="rounded-lg border border-line bg-surface p-4">
              <h3 className="font-display text-lg text-ink">{block.title}</h3>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </section>
          );
        }
        return (
          <p key={i} className="text-sm text-muted">
            {block.body}
          </p>
        );
      })}
      <CalcResults helper={helper} values={values} />
    </div>
  );
}
