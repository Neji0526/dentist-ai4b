import Link from "next/link";

import { LeadStatusBadge } from "@/components/admin/LeadStatusBadge";
import { adminSessionOrNull } from "@/lib/admin/auth";
import { formatDateTime, relativeTime, telHref } from "@/lib/format";
import { LEAD_STATUSES, LEAD_STATUS_LABELS, type Lead, type LeadStatus } from "@/lib/types";

type Props = {
  searchParams: Promise<{ status?: string; q?: string; deleted?: string }>;
};

const PAGE_SIZE = 50;

function isLeadStatus(value: string | undefined): value is LeadStatus {
  return Boolean(value && (LEAD_STATUSES as readonly string[]).includes(value));
}

export default async function AdminLeadsPage({ searchParams }: Props) {
  const { status, q, deleted } = await searchParams;
  const session = await adminSessionOrNull();
  if (!session) return null; // The layout explains why.
  const { supabase } = session;

  let query = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(PAGE_SIZE);

  if (isLeadStatus(status)) query = query.eq("status", status);

  if (q) {
    // Escape the PostgREST or() delimiters before interpolating user input.
    const term = q.replace(/[,()]/g, " ").trim();
    if (term) {
      query = query.or(
        `name.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%`,
      );
    }
  }

  const { data, error } = await query;
  const leads = (data as Lead[] | null) ?? [];

  const filters: { label: string; value: string | undefined }[] = [
    { label: "All", value: undefined },
    ...LEAD_STATUSES.map((value) => ({
      label: LEAD_STATUS_LABELS[value],
      value,
    })),
  ];

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl">Leads</h1>
          <p className="mt-2 text-ink-600">
            Every appointment request and contact form submission from the
            website.
          </p>
        </div>
        <span className="rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-ink-600 ring-1 ring-ink-100">
          Showing {leads.length}
          {leads.length === PAGE_SIZE ? ` (newest ${PAGE_SIZE})` : ""}
        </span>
      </header>

      {deleted ? (
        <p className="rounded-xl bg-mint-50 px-4 py-3 text-sm text-mint-800 ring-1 ring-inset ring-mint-100">
          Lead deleted.
        </p>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const active = (filter.value ?? undefined) === (isLeadStatus(status) ? status : undefined);
            const href = filter.value
              ? `/admin/leads?status=${filter.value}`
              : "/admin/leads";

            return (
              <Link
                key={filter.label}
                href={href}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-600 text-white"
                    : "bg-white text-ink-600 ring-1 ring-ink-100 hover:bg-ink-50"
                }`}
              >
                {filter.label}
              </Link>
            );
          })}
        </div>

        <form className="flex gap-2" action="/admin/leads">
          {isLeadStatus(status) ? (
            <input type="hidden" name="status" value={status} />
          ) : null}
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search name, phone or email"
            className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100 sm:w-64"
          />
          <button
            type="submit"
            className="rounded-xl bg-ink-900 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-800"
          >
            Search
          </button>
        </form>
      </div>

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-inset ring-red-100">
          Could not load leads: {error.message}
        </p>
      ) : null}

      {leads.length === 0 ? (
        <p className="rounded-2xl bg-white p-10 text-center text-ink-600 ring-1 ring-ink-100">
          {q || status
            ? "No leads match that filter."
            : "No enquiries yet. They will appear here the moment someone submits the appointment form."}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-ink-100">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink-100 bg-ink-50/70 text-xs uppercase tracking-wider text-ink-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Patient</th>
                <th className="px-5 py-3 font-semibold">Contact</th>
                <th className="hidden px-5 py-3 font-semibold lg:table-cell">
                  Interested in
                </th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {leads.map((lead) => {
                const tel = telHref(lead.phone);

                return (
                  <tr key={lead.id} className="transition-colors hover:bg-ink-50/60">
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="font-semibold text-ink-900 hover:text-brand-700"
                      >
                        {lead.name}
                      </Link>
                      {lead.preferred_time ? (
                        <span className="block text-xs text-ink-500">
                          Prefers: {lead.preferred_time}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-5 py-3.5">
                      {tel ? (
                        <a
                          href={tel}
                          className="font-medium text-brand-700 hover:underline"
                        >
                          {lead.phone}
                        </a>
                      ) : (
                        lead.phone
                      )}
                      {lead.email ? (
                        <a
                          href={`mailto:${lead.email}`}
                          className="block truncate text-xs text-ink-500 hover:text-brand-600"
                        >
                          {lead.email}
                        </a>
                      ) : null}
                    </td>
                    <td className="hidden px-5 py-3.5 text-ink-600 lg:table-cell">
                      {lead.service ?? "Not specified"}
                    </td>
                    <td className="px-5 py-3.5">
                      <LeadStatusBadge status={lead.status} />
                    </td>
                    <td
                      className="px-5 py-3.5 text-right text-ink-500"
                      title={formatDateTime(lead.created_at)}
                    >
                      {relativeTime(lead.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
