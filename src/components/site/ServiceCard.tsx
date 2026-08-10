import Image from "next/image";
import Link from "next/link";

import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { formatPrice } from "@/lib/format";
import type { Service } from "@/lib/types";

type Props = {
  service: Service;
  priority?: boolean;
  /** Hides the image even when one is set, for tight 4-across grids. */
  compact?: boolean;
  /** Hides the price / duration line, as on the homepage grid. */
  showMeta?: boolean;
};

export function ServiceCard({
  service,
  priority = false,
  compact = false,
  showMeta = true,
}: Props) {
  const price = formatPrice(service.price_from);
  const showImage = Boolean(service.image_url) && !compact;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-ink-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(13,31,45,0.05),0_24px_44px_-24px_rgba(13,31,45,0.28)] hover:ring-brand-200">
      {showImage ? (
        <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
          <Image
            src={service.image_url as string}
            alt={service.title}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-100">
            <ServiceIcon name={service.icon} className="h-[22px] w-[22px]" />
          </span>

          {service.badge ? (
            <span className="rounded-full bg-mint-50 px-2.5 py-1 text-[0.6875rem] font-semibold text-mint-700 ring-1 ring-inset ring-mint-100">
              {service.badge}
            </span>
          ) : null}
        </div>

        <h3 className="mt-4 text-[1.0625rem] leading-snug">
          <Link href={`/services/${service.slug}`} className="hover:text-brand-700">
            <span className="absolute inset-0" aria-hidden="true" />
            {service.title}
          </Link>
        </h3>

        {service.short_description ? (
          <p className="mt-2 flex-1 text-[0.875rem] leading-relaxed text-ink-600">
            {service.short_description}
          </p>
        ) : null}

        {showMeta ? (
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem]">
          {price ? (
            <span className="font-semibold text-ink-900">From {price}</span>
          ) : null}
          {price && service.duration ? (
            <span aria-hidden="true" className="text-ink-300">
              ·
            </span>
          ) : null}
          {service.duration ? (
            <span className="text-ink-500">{service.duration}</span>
          ) : null}
        </div>
        ) : null}

        <span className="mt-4 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-brand-600">
          Learn more
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h13M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </article>
  );
}
