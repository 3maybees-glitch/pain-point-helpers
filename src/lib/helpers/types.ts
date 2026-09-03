export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
export type FormValues = { [key: string]: Json };

export type FieldType =
  | "text"
  | "textarea"
  | "currency"
  | "number"
  | "percent"
  | "date"
  | "month"
  | "select"
  | "email"
  | "tel"
  | "url";

export type Field = {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  options?: string[];
  span?: 1 | 2;
  rows?: number;
};

export type TableCol = { id: string; label: string; type: FieldType; width?: string };

export type Block =
  | { kind: "fields"; title?: string; fields: Field[] }
  | { kind: "table"; id: string; title: string; columns: TableCol[]; minRows?: number; sum?: string }
  | { kind: "checks"; id: string; title: string; items: { id: string; label: string }[] }
  | { kind: "prompts"; title: string; items: string[] }
  | { kind: "note"; body: string };

export type CategoryMeta = {
  id: string;
  label: string;
  kicker: string;
  range: string;
};

export type HelperDef = {
  id: string;
  n: number;
  title: string;
  blurb: string;
  category: string;
  identity?: Field[];
  blocks: Block[];
  sample: FormValues;
};
