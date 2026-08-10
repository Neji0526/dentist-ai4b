import Link from "next/link";
import { notFound } from "next/navigation";

import { createRowAction } from "@/app/admin/actions";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { adminSessionOrNull } from "@/lib/admin/auth";
import { getResource } from "@/lib/admin/resources";

type Props = {
  params: Promise<{ resource: string }>;
};


/** Sensible starting values so a new row does not begin as an invisible draft. */
const DEFAULTS: Record<string, Record<string, unknown>> = {
  services: { is_published: true, sort_order: 100, icon: "tooth" },
  doctors: { is_published: true, sort_order: 100 },
  testimonials: { is_published: true, sort_order: 100, rating: 5 },
  blogs: { is_published: false, read_minutes: 5 },
  faq: { is_published: true, sort_order: 100, category: "General" },
};

export default async function NewResourcePage({ params }: Props) {
  const { resource: resourceKey } = await params;

  const resource = getResource(resourceKey);
  if (!resource) notFound();

  // Gate the page itself, not just the action behind it.
  if (!(await adminSessionOrNull())) return null;

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

      <header>
        <h1 className="text-3xl">Add {resource.singular}</h1>
        <p className="mt-2 text-ink-600">{resource.description}</p>
      </header>

      <ResourceForm
        resource={resource}
        row={DEFAULTS[resource.key] ?? {}}
        action={createRowAction.bind(null, resource.key)}
      />
    </div>
  );
}
