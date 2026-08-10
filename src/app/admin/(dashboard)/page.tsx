import Link from "next/link";

import { LeadStatusBadge } from "@/components/admin/LeadStatusBadge";
import { adminSessionOrNull } from "@/lib/admin/auth";
import { RESOURCES } from "@/lib/admin/resources";
import { relativeTime } from "@/lib/format";
import type { Lead, LeadStats } from "@/lib/types";

const EMPTY_STATS: LeadStats = {
  total: 0,
  new_count: 0,
  contacted_count: 0,
  scheduled_count: 0,
  completed_count: 0,
  last_7_days: 0,
  last_30_days: 0,
};

function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "brand" | "mint";
}) {
  const tones = {
    default: "text-ink-900",
    brand: "text-brand-700",
    mint: "text-mint-700",
  } as const;

  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-ink-100">
      <p className="text-sm text-ink-500">{label}</p>
      <p
        className={`mt-1.5 font-[family-name:var(--font-display)] text-3xl font-bold ${tones[tone]}`}
      >
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-ink-500">{hint}</p> : null}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const session = await adminSessionOrNull();
  if (!session) return null; // The layout explains why.
  const { supabase, profile } = session;

  const [statsResult, leadsResult, ...counts] = await Promise.all([
    supabase.from("lead_stats").select("*").maybeSingle(),
    supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8),
    ...RESOURCES.map((resource) =>
      supabase.from(resource.table).select("id", { count: "exact", head: true }),
    ),
  ]);

  const stats = (statsResult.data as LeadStats | null) ?? EMPTY_STATS;
  const leads = (leadsResult.data as Lead[] | null) ?? [];
  const firstName = profile.full_name?.split(" ")[0] ?? "there";

  const conversion =
    stats.total > 0
      ? Math.round(((stats.scheduled_count + stats.completed_count) / stats.total) * 100)
      : 0;

  return (
    <div className="grid gap-8">
      <header>
        <h1 className="text-3xl">Good to see you, {firstName}</h1>
        <p className="mt-2 text-ink-600">
          {stats.new_count > 0 ? (
            <>
              <strong className="text-ink-900">
                {stats.new_count} new{" "}
                {stats.new_count === 1 ? "enquiry" : "enquiries"}
              </strong>{" "}
              waiting for a callback.
            </>
          ) : (
            "No new enquiries waiting — the inbox is clear."
          )}
        </p>
      </header>

      <section>
        <h2 className="sr-only">Lead statistics</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="New enquiries"
            value={stats.new_count}
            hint="Need a callback"
            tone="brand"
          />
          <StatCard label="Last 7 days" value={stats.last_7_days} hint="All statuses" />
          <StatCard
            label="Appointments booked"
            value={stats.scheduled_count + stats.completed_count}
            hint="Scheduled or completed"
            tone="mint"
          />
          <StatCard
            label="Enquiry → appointment"
            value={`${conversion}%`}
            hint={`${stats.total} leads all-time`}
          />
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl">Latest enquiries</h2>
          <Link
            href="/admin/leads"
            className="text-sm font-semibold text-brand-600 hover:underline"
          >
            View all leads →
          </Link>
        </div>

        {leads.length === 0 ? (
          <p className="rounded-2xl bg-white p-8 text-center text-ink-600 ring-1 ring-ink-100">
            No enquiries yet. Once the site is live, appointment requests land
            here.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-ink-100">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-ink-100 bg-ink-50/70 text-xs uppercase tracking-wider text-ink-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Patient</th>
                  <th className="hidden px-5 py-3 font-semibold sm:table-cell">
                    Interested in
                  </th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="transition-colors hover:bg-ink-50/60">
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="font-semibold text-ink-900 hover:text-brand-700"
                      >
                        {lead.name}
                      </Link>
                      <span className="block text-xs text-ink-500">{lead.phone}</span>
                    </td>
                    <td className="hidden px-5 py-3.5 text-ink-600 sm:table-cell">
                      {lead.service ?? "Not specified"}
                    </td>
                    <td className="px-5 py-3.5">
                      <LeadStatusBadge status={lead.status} />
                    </td>
                    <td className="px-5 py-3.5 text-right text-ink-500">
                      {relativeTime(lead.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl">Content</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RESOURCES.map((resource, index) => (
            <Link
              key={resource.key}
              href={`/admin/content/${resource.key}`}
              className="rounded-2xl bg-white p-5 ring-1 ring-ink-100 transition-all hover:-translate-y-0.5 hover:ring-brand-200"
            >
              <div className="flex items-baseline justify-between">
                <p className="font-semibold text-ink-900">{resource.label}</p>
                <span className="font-[family-name:var(--font-display)] text-2xl font-bold text-brand-600">
                  {counts[index]?.count ?? 0}
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                {resource.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
