import Link from "next/link";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/site/Logo";
import { getSiteSettings } from "@/lib/data";
import { telHref } from "@/lib/format";

const LINKS = [
  { href: "/services", label: "Our services" },
  { href: "/doctors", label: "Our dentists" },
  { href: "/faq", label: "Patient FAQ" },
  { href: "/contact", label: "Contact us" },
];

export default async function NotFound() {
  const settings = await getSiteSettings();
  const tel = telHref(settings.phone);

  return (
    <main className="flex min-h-screen items-center bg-white py-16">
      <Container width="narrow">
        <div className="text-center">
          <Link href="/" className="inline-flex">
            <Logo className="h-12 w-12" />
          </Link>

          <p className="mt-8 font-semibold uppercase tracking-[0.16em] text-brand-600">
            404
          </p>
          <h1 className="mt-3 text-4xl">We couldn’t find that page</h1>
          <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-ink-600">
            The link may be out of date. Everything you need is a click away — or
            call us and we’ll point you in the right direction.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/" size="lg">
              Back to homepage
            </ButtonLink>
            {tel ? (
              <ButtonLink href={tel} variant="secondary" size="lg">
                Call {settings.phone}
              </ButtonLink>
            ) : null}
          </div>

          <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[0.9375rem]">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-medium text-brand-600 hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </main>
  );
}
