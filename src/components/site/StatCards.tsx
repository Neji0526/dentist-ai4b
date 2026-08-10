import { ServiceIcon } from "@/components/ui/ServiceIcon";

export type StatCard = {
  icon: string;
  value: string;
  label: string;
};

type Props = {
  stats: StatCard[];
  className?: string;
};

/** 2×2 grid of white stat tiles, paired with the "why choose us" copy. */
export function StatCards({ stats, className = "" }: Props) {
  return (
    <dl className={`grid gap-5 sm:grid-cols-2 ${className}`}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-ink-100"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <ServiceIcon name={stat.icon} className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <dt className="sr-only">{stat.label}</dt>
            <dd>
              <span className="block font-[family-name:var(--font-display)] text-2xl font-bold leading-tight text-ink-900">
                {stat.value}
              </span>
              <span className="mt-0.5 block text-sm text-ink-600">{stat.label}</span>
            </dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
