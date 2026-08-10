import Link from "next/link";
import { notFound } from "next/navigation";

import { PublishToggle } from "@/components/admin/PublishToggle";
import { adminSessionOrNull } from "@/lib/admin/auth";
import { getResource, type ListColumn } from "@/lib/admin/resources";
import { formatDate, formatPrice, truncate } from "@/lib/format";

type Props = {
  params: Promise<{ resource: string }>;
  searchParams: Promise<{ created?: string; updated?: string; deleted?: string }>;
};


function Cell({
  column,
  row,
  resourceKey,
}: {
  column: ListColumn;
  row: Record<string, unknown>;
  resourceKey: string;
}) {
  const value = row[column.name];

  switch (column.type) {
    case "boolean":
      return (
        <PublishToggle
          resourceKey={resourceKey}
          id={String(row.id)}
          field={column.name}
          value={Boolean(value)}
        />
      );

    case "date":
      return (
        <span className="text-ink-600">
          {value ? formatDate(String(value)) : "—"}
        </span>
      );

    case "number":
      if (value == null) return <span className="text-ink-400">—</span>;
      return (
        <span className="text-ink-700">
          {column.name === "price_from"
            ? formatPrice(Number(value))
            : String(value)}
        </span>
      );

    case "rating":
      return (
        <span className="whitespace-nowrap text-amber-500" aria-label={`${value} stars`}>
          {"★".repeat(Number(value) || 0)}
          <span className="text-ink-200">{"★".repeat(5 - (Number(value) || 0))}</span>
        </span>
      );

    case "badge":
      return value ? (
        <span className="rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-700">
          {String(value)}
        </span>
      ) : (
        <span className="text-ink-400">—</span>
      );

    default:
      return value ? (
        <span className="text-ink-700">{truncate(String(value), 70)}</span>
      ) : (
        <span className="text-ink-400">—</span>
      );
  }
}

export default async function ResourceListPage({ params, searchParams }: Props) {
  const { resource: resourceKey } = await params;
  const { created, updated, deleted } = await searchParams;

  const resource = getResource(resourceKey);
  if (!resource) notFound();

  const session = await adminSessionOrNull();
  if (!session) return null; // The layout explains why.
  const { supabase } = session;

  const { data, error } = await supabase
    .from(resource.table)
    .select("*")
    .order(resource.orderBy.column, {
      ascending: resource.orderBy.ascending,
      nullsFirst: false,
    });

  const rows = (data as Record<string, unknown>[] | null) ?? [];

  const flash = created
    ? `${resource.singular[0].toUpperCase()}${resource.singular.slice(1)} created.`
    : updated
      ? "Changes saved."
      : deleted
        ? "Deleted."
        : null;

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl">{resource.label}</h1>
          <p className="mt-2 max-w-2xl text-ink-600">{resource.description}</p>
        </div>
        <Link
          href={`/admin/content/${resource.key}/new`}
          className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Add {resource.singular}
        </Link>
      </header>

      {flash ? (
        <p className="rounded-xl bg-mint-50 px-4 py-3 text-sm text-mint-800 ring-1 ring-inset ring-mint-100">
          {flash}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-inset ring-red-100">
          Could not load {resource.label.toLowerCase()}: {error.message}
        </p>
      ) : null}

      {rows.length === 0 && !error ? (
        <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-ink-100">
          <p className="text-ink-600">
            Nothing here yet. Add your first {resource.singular} to see it on the
            website.
          </p>
          <Link
            href={`/admin/content/${resource.key}/new`}
            className="mt-5 inline-flex rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Add {resource.singular}
          </Link>
        </div>
      ) : null}

      {rows.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-ink-100">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink-100 bg-ink-50/70 text-xs uppercase tracking-wider text-ink-500">
              <tr>
                {resource.listColumns.map((column) => (
                  <th key={column.name} className="px-5 py-3 font-semibold">
                    {column.label}
                  </th>
                ))}
                <th className="px-5 py-3 text-right font-semibold">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {rows.map((row) => (
                <tr
                  key={String(row.id)}
                  className="transition-colors hover:bg-ink-50/60"
                >
                  {resource.listColumns.map((column, index) => (
                    <td key={column.name} className="px-5 py-3.5">
                      {index === 0 ? (
                        <Link
                          href={`/admin/content/${resource.key}/${row.id}`}
                          className="font-semibold text-ink-900 hover:text-brand-700"
                        >
                          {truncate(String(row[column.name] ?? "Untitled"), 70)}
                        </Link>
                      ) : (
                        <Cell
                          column={column}
                          row={row}
                          resourceKey={resource.key}
                        />
                      )}
                    </td>
                  ))}
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/content/${resource.key}/${row.id}`}
                      className="text-sm font-semibold text-brand-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
