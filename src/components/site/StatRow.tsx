export type RowStat = {
  value: string;
  label: string;
};

type Props = {
  stats: RowStat[];
  className?: string;
};

/** Divided proof row that closes the "why choose us" band. */
export function StatRow({ stats, className = "" }: Props) {
  return (
    <dl
      className={`grid gap-y-8 border-t border-ink-200/70 pt-10 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-ink-200/70 ${className}`}
    >
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <dt className="sr-only">{stat.label}</dt>
          <dd>
            <span className="block font-[family-name:var(--font-display)] text-[1.75rem] font-bold leading-tight text-brand-700">
              {stat.value}
            </span>
            <span className="mt-1 block text-sm text-ink-600">{stat.label}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
