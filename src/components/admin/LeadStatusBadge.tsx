import { LEAD_STATUS_LABELS, type LeadStatus } from "@/lib/types";

const STYLES: Record<LeadStatus, string> = {
  new: "bg-brand-50 text-brand-700 ring-brand-100",
  contacted: "bg-amber-50 text-amber-700 ring-amber-100",
  appointment_scheduled: "bg-mint-50 text-mint-700 ring-mint-100",
  completed: "bg-ink-100 text-ink-600 ring-ink-200",
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${STYLES[status]}`}
    >
      {LEAD_STATUS_LABELS[status]}
    </span>
  );
}
