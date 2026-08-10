import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteRowAction, updateRowAction } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { adminSessionOrNull } from "@/lib/admin/auth";
import { getResource } from "@/lib/admin/resources";
import { formatDateTime } from "@/lib/format";

type Props = {
  params: Promise<{ resource: string; id: string }>;
};


/** Public URL of the row being edited, when it has one. */
function livePath(resourceKey: string, row: Record<string, unknown>) {
  const slug = typeof row.slug === "string" ? row.slug : null;
  if (!slug) return null;

  if (resourceKey === "services") return `/services/${slug}`;
  if (resourceKey === "doctors") return `/doctors/${slug}`;
  if (resourceKey === "blogs") return `/blog/${slug}`;
  return null;
}

export default async function EditResourcePage({ params }: Props) {
  const { resource: resourceKey, id } = await params;

  const resource = getResource(resourceKey);
  if (!resource) notFound();

  const session = await adminSessionOrNull();
  if (!session) return null; // The layout explains why.
  const { supabase } = session;

  const { data } = await supabase
    .from(resource.table)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const row = data as Record<string, unknown> | null;
  if (!row) notFound();

  const title = String(row[resource.titleField] ?? "Untitled");
  const preview = livePath(resource.key, row);

  return (
    <div className="grid gap-6">
      <nav>
        <Link
          href={`/admin/content/${resource.key}`}
          className="text-sm font-medium text-brand-600 hover:underline"
        >
          ← {resource.label}
        </Link>
      </nav>

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl">{title}</h1>
          <p className="mt-2 text-sm text-ink-500">
            Last updated{" "}
            {row.updated_at ? formatDateTime(String(row.updated_at)) : "—"}
          </p>
        </div>
        {preview ? (
          <Link
            href={preview}
            target="_blank"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-700 ring-1 ring-inset ring-brand-200 hover:bg-brand-50"
          >
            View on site ↗
          </Link>
        ) : null}
      </header>

      <ResourceForm
        resource={resource}
        row={row}
        action={updateRowAction.bind(null, resource.key, id)}
        deleteButton={
          <DeleteButton
            action={deleteRowAction.bind(null, resource.key, id)}
            confirmLabel={`Delete “${title}”? This cannot be undone.`}
            label={`Delete ${resource.singular}`}
          />
        }
      />
    </div>
  );
}
