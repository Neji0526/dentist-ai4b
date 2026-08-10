import { Container } from "@/components/ui/Container";
import { ServiceIcon } from "@/components/ui/ServiceIcon";

export type FeatureItem = {
  icon: string;
  title: string;
  copy: string;
};

type Props = {
  items: FeatureItem[];
  /**
   * "band"     — full-width tinted strip
   * "card"     — inline white card
   * "panel"    — inline tinted panel, as on the services page
   * "floating" — elevated white card straddling two sections, as on the homepage
   */
  variant?: "band" | "card" | "panel" | "floating";
  className?: string;
};

/**
 * The four-across reassurance strip. Appears with different copy on the
 * homepage, services, doctors and appointment pages.
 */
export function FeatureBar({ items, variant = "band", className = "" }: Props) {
  // The "card" variant stays undivided — the doctors design shows the four
  // credentials separated by white space alone.
  const divided = variant === "floating" || variant === "panel";

  const list = (
    <ul
      className={`grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4 ${
        divided
          ? variant === "panel"
            ? "lg:divide-x lg:divide-brand-100"
            : "lg:divide-x lg:divide-ink-100"
          : ""
      }`}
    >
      {items.map((item, index) => (
        <li
          key={item.title}
          className={`flex items-start gap-3.5 ${
            divided && index > 0 ? "lg:pl-8" : ""
          }`}
        >
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-brand-600 ${
              variant === "panel" ? "bg-white" : "bg-brand-50"
            }`}
          >
            <ServiceIcon name={item.icon} className="h-[22px] w-[22px]" />
          </span>
          <div className="min-w-0">
            <p className="font-semibold leading-snug text-ink-900">{item.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-600">{item.copy}</p>
          </div>
        </li>
      ))}
    </ul>
  );

  if (variant === "floating") {
    return (
      <div className={`relative z-10 -mt-10 ${className}`}>
        <Container width="wide">
          <div className="rounded-2xl bg-white p-6 shadow-[0_2px_4px_rgba(13,31,45,0.04),0_24px_48px_-24px_rgba(13,31,45,0.28)] ring-1 ring-ink-100 sm:p-7">
            {list}
          </div>
        </Container>
      </div>
    );
  }

  if (variant === "panel") {
    return (
      <div className={`rounded-2xl bg-brand-50/60 p-6 sm:p-7 ${className}`}>
        {list}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={`rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(13,31,45,0.04),0_18px_40px_-28px_rgba(13,31,45,0.25)] ring-1 ring-ink-100/80 sm:p-7 ${className}`}
      >
        {list}
      </div>
    );
  }

  return (
    <section className={`border-y border-ink-100 bg-brand-50/40 py-9 ${className}`}>
      <Container width="wide">{list}</Container>
    </section>
  );
}
