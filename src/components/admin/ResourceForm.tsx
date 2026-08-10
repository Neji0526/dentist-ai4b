"use client";

import { useActionState, type ReactNode } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";

import { ImageField } from "@/components/admin/ImageField";
import { initialActionState, type ActionState } from "@/lib/admin/action-state";
import type { Field, Resource } from "@/lib/admin/resources";

type Row = Record<string, unknown>;

type Props = {
  resource: Resource;
  row?: Row;
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
  deleteButton?: ReactNode;
};

const INPUT =
  "w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-[0.9375rem] text-ink-900 placeholder:text-ink-400 transition-colors hover:border-ink-300 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100";
const LABEL = "mb-1.5 block text-sm font-medium text-ink-800";
const HELP = "mt-1.5 text-xs leading-relaxed text-ink-500";

function toInputValue(field: Field, value: unknown): string {
  if (value == null) return "";

  if (field.type === "list") {
    return Array.isArray(value) ? value.join("\n") : String(value);
  }

  if (field.type === "datetime" || field.type === "date") {
    const date = new Date(String(value));
    if (Number.isNaN(date.getTime())) return "";
    // datetime-local wants YYYY-MM-DDTHH:mm in local time.
    const offset = date.getTimezoneOffset() * 60_000;
    const local = new Date(date.getTime() - offset).toISOString();
    return field.type === "date" ? local.slice(0, 10) : local.slice(0, 16);
  }

  return String(value);
}

function FieldControl({ field, row }: { field: Field; row: Row }) {
  const value = toInputValue(field, row[field.name]);
  const id = `field-${field.name}`;

  if (field.type === "image") {
    return (
      <ImageField
        name={field.name}
        label={field.label}
        bucket={field.bucket ?? "services"}
        defaultValue={value}
        help={field.help}
      />
    );
  }

  if (field.type === "boolean") {
    return (
      <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-ink-50 px-4 py-3">
        <input
          id={id}
          name={field.name}
          type="checkbox"
          defaultChecked={Boolean(row[field.name])}
          className="mt-0.5 h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-200"
        />
        <span>
          <span className="text-sm font-medium text-ink-800">{field.label}</span>
          {field.help ? <span className={`${HELP} block`}>{field.help}</span> : null}
        </span>
      </label>
    );
  }

  const control = (() => {
    switch (field.type) {
      case "textarea":
      case "markdown":
        return (
          <textarea
            id={id}
            name={field.name}
            rows={field.rows ?? 4}
            defaultValue={value}
            required={field.required}
            placeholder={field.placeholder}
            className={`${INPUT} resize-y ${
              field.type === "markdown" ? "font-mono text-sm leading-relaxed" : ""
            }`}
          />
        );

      case "select":
        return (
          <select
            id={id}
            name={field.name}
            defaultValue={value}
            required={field.required}
            className={INPUT}
          >
            <option value="">—</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "list":
        return (
          <textarea
            id={id}
            name={field.name}
            rows={field.rows ?? 4}
            defaultValue={value}
            placeholder="One per line"
            className={`${INPUT} resize-y font-mono text-sm`}
          />
        );

      case "number":
        return (
          <input
            id={id}
            name={field.name}
            type="number"
            defaultValue={value}
            required={field.required}
            min={field.min}
            max={field.max}
            step={field.step ?? "any"}
            className={INPUT}
          />
        );

      case "datetime":
        return (
          <input
            id={id}
            name={field.name}
            type="datetime-local"
            defaultValue={value}
            className={INPUT}
          />
        );

      case "date":
        return (
          <input
            id={id}
            name={field.name}
            type="date"
            defaultValue={value}
            className={INPUT}
          />
        );

      default:
        return (
          <input
            id={id}
            name={field.name}
            type="text"
            defaultValue={value}
            required={field.required}
            placeholder={field.placeholder}
            className={INPUT}
          />
        );
    }
  })();

  return (
    <div>
      <label className={LABEL} htmlFor={id}>
        {field.label}
        {field.required ? <span className="text-red-500"> *</span> : null}
      </label>
      {control}
      {field.help ? <p className={HELP}>{field.help}</p> : null}
    </div>
  );
}

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

export function ResourceForm({ resource, row = {}, action, deleteButton }: Props) {
  const [state, formAction] = useActionState(action, initialActionState);
  const isNew = !row.id;

  return (
    <form action={formAction} className="grid gap-6">
      {state.status === "error" && state.message ? (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-inset ring-red-100"
        >
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-5 rounded-2xl bg-white p-6 ring-1 ring-ink-100 sm:grid-cols-2">
        {resource.fields.map((field) => (
          <div
            key={field.name}
            className={field.wide || field.type === "image" ? "sm:col-span-2" : ""}
          >
            <FieldControl field={field} row={row} />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <SaveButton label={isNew ? `Create ${resource.singular}` : "Save changes"} />
          <Link
            href={`/admin/content/${resource.key}`}
            className="rounded-full px-4 py-2.5 text-sm font-medium text-ink-600 hover:bg-ink-50"
          >
            Cancel
          </Link>
        </div>
        {deleteButton}
      </div>
    </form>
  );
}
