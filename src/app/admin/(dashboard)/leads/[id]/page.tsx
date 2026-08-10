import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteLeadAction, updateLeadNotesAction } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { LeadStatusBadge } from "@/components/admin/LeadStatusBadge";
import { LeadWorkspace } from "@/components/admin/LeadWorkspace";
import { adminSessionOrNull } from "@/lib/admin/auth";
import { formatDate, formatDateTime, telHref, whatsappHref } from "@/lib/format";
import type { Lead } from "@/lib/types";

type Props = {
  params: Promise<{ id: string }>;
};

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-ink-100 py-3 last:border-0 sm:flex-row sm:items-baseline sm:gap-6">
      <dt className="w-40 shrink-0 text-sm text-ink-500">{label}</dt>
      <dd className="min-w-0 flex-1 text-[0.9375rem] text-ink-800">{children}</dd>
    </div>
  );
}

export default async function LeadDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await adminSessionOrNull();
  if (!session) return null; // The layout explains why.
  const { supabase } = session;

  const { data } = await supabase.from("leads").select("*").eq("id", id).maybeSingle();
  const lead = data as Lead | null;

  if (!lead) notFound();

  const tel = telHref(lead.phone);
  const whatsapp = whatsappHref(lead.phone);

  return (
    <div className="grid gap-6">
      <nav>
        <Link
          href="/admin/leads"
          className="text-sm font-medium text-brand-600 hover:underline"
        >
          ← All leads
        </Link>
      </nav>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl">{lead.name}</h1>
            <LeadStatusBadge status={lead.status} />
          </div>
          <p className="mt-2 text-ink-600">
            Enquired {formatDateTime(lead.created_at)}
            {lead.source ? ` · via ${lead.source}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {tel ? (
            <a
              href={tel}
              className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Call {lead.phone}
            </a>
          ) : null}
          {lead.email ? (
            <a
              href={`mailto:${lead.email}?subject=Your%20appointment%20at%20our%20clinic`}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 ring-1 ring-inset ring-brand-200 hover:bg-brand-50"
            >
              Email
            </a>
          ) : null}
          {whatsapp ? (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-mint-700 ring-1 ring-inset ring-mint-200 hover:bg-mint-50"
            >
              WhatsApp
            </a>
          ) : null}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-2xl bg-white p-6 ring-1 ring-ink-100">
          <h2 className="text-lg">Enquiry details</h2>
          <dl className="mt-4">
            <DetailRow label="Phone">
              {tel ? (
                <a href={tel} className="font-medium text-brand-700 hover:underline">
                  {lead.phone}
                </a>
              ) : (
                lead.phone
              )}
            </DetailRow>
            <DetailRow label="Email">
              {lead.email ? (
                <a
                  href={`mailto:${lead.email}`}
                  className="break-all font-medium text-brand-700 hover:underline"
                >
                  {lead.email}
                </a>
              ) : (
                <span className="text-ink-400">Not provided</span>
              )}
            </DetailRow>
            <DetailRow label="Interested in">
              {lead.service ?? <span className="text-ink-400">Not specified</span>}
            </DetailRow>
            <DetailRow label="Preferred date">
              {lead.preferred_date ? (
                formatDate(lead.preferred_date)
              ) : (
                <span className="text-ink-400">No preference</span>
              )}
            </DetailRow>
            <DetailRow label="Preferred time">
              {lead.preferred_time ?? (
                <span className="text-ink-400">No preference</span>
              )}
            </DetailRow>
            <DetailRow label="Submitted from">
              {lead.page_path ? (
                <Link
                  href={lead.page_path}
                  target="_blank"
                  className="font-medium text-brand-700 hover:underline"
                >
                  {lead.page_path}
                </Link>
              ) : (
                <span className="text-ink-400">Unknown</span>
              )}
            </DetailRow>
            <DetailRow label="Last updated">
              {formatDateTime(lead.updated_at)}
            </DetailRow>
          </dl>

          {lead.message ? (
            <div className="mt-5 rounded-xl bg-ink-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                Their message
              </p>
              <p className="mt-2 whitespace-pre-wrap text-[0.9375rem] leading-relaxed text-ink-800">
                {lead.message}
              </p>
            </div>
          ) : null}
        </section>

        <section className="grid gap-6">
          <LeadWorkspace
            lead={lead}
            action={updateLeadNotesAction.bind(null, lead.id)}
          />

          <div className="rounded-2xl bg-white p-6 ring-1 ring-ink-100">
            <h2 className="text-lg">Danger zone</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              Deleting removes this enquiry permanently. If the patient asked you
              to erase their data, this is the button.
            </p>
            <div className="mt-4">
              <DeleteButton
                action={deleteLeadAction.bind(null, lead.id)}
                confirmLabel={`Delete the enquiry from ${lead.name}? This cannot be undone.`}
                label="Delete lead"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
