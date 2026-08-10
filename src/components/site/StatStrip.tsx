import { ServiceIcon } from "@/components/ui/ServiceIcon";

export type Stat = {
  icon: string;
  value: string;
  label: string;
  /** Renders the icon in amber, for the reviews stat. */
  highlight?: boolean;
};

type Props = {
  stats: Stat[];
  className?: string;
};

/** Compact inline proof points, used under the services hero copy. */
export function StatStrip({ stats, className = "" }: Props) {
  return (
    <dl className={`flex flex-wrap items-center gap-x-8 gap-y-4 ${className}`}>
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-center gap-2.5">
          <ServiceIcon
            name={stat.icon}
            className={`h-5 w-5 ${stat.highlight ? "text-amber-400" : "text-brand-500"}`}
          />
          <div>
            <dt className="sr-only">{stat.label}</dt>
            <dd>
              <span className="block font-[family-name:var(--font-display)] text-[0.9375rem] font-bold leading-tight text-ink-900">
                {stat.value}
              </span>
              <span className="block text-xs text-ink-500">{stat.label}</span>
            </dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
