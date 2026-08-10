import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { telHref } from "@/lib/format";

type Props = {
  phone: string | null;
  title?: string;
  description?: string;
  /** Icon shown in the white circle on the left. Pass null for a text-only band. */
  icon?: string | null;
  primaryLabel?: string;
  primaryHref?: string;
};

export function CtaBand({
  phone,
  title = "Ready to book? It takes under a minute",
  description = "Request an appointment online and we'll call you back within one business hour — or speak to us now.",
  icon = "clock",
  primaryLabel = "Book an appointment",
  primaryHref = "/appointment",
}: Props) {
  const tel = telHref(phone);

  return (
    <section className="py-4">
      <Container width="wide">
        <div className="relative overflow-hidden rounded-3xl bg-brand-700 px-6 py-10 sm:px-10 sm:py-11">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-brand-600/60 blur-2xl" />
            <div className="absolute -bottom-28 left-10 h-64 w-64 rounded-full bg-mint-500/20 blur-2xl" />
          </div>

          <div className="relative flex flex-col items-start gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-5">
              {icon ? (
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-inset ring-white/25">
                  <ServiceIcon name={icon} className="h-7 w-7" />
                </span>
              ) : null}
              <div className="max-w-xl">
                <h2 className="text-[1.5rem] leading-tight text-white sm:text-[1.75rem]">
                  {title}
                </h2>
                <p className="mt-2 text-[1.0625rem] leading-relaxed text-brand-100">
                  {description}
                </p>
              </div>
            </div>

            {/* Dedicated on-brand variants, so these never fight the default
                primary styling for specificity. */}
            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <ButtonLink href={primaryHref} size="lg" variant="onBrand">
                <ServiceIcon name="calendar" className="h-[18px] w-[18px]" />
                {primaryLabel}
              </ButtonLink>
              {tel ? (
                <ButtonLink href={tel} size="lg" variant="onBrandOutline">
                  <ServiceIcon name="phone" className="h-[18px] w-[18px]" />
                  Call {phone}
                </ButtonLink>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
