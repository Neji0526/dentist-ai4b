"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/site/Logo";
import { telHref } from "@/lib/format";

type Props = {
  clinicName: string;
  phone: string | null;
  city: string | null;
};

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/doctors", label: "Our Dentists" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ clinicName, phone, city }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const tel = telHref(phone);

  // Route change closes the mobile drawer.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Utility bar: phone number above the fold on every page. */}
      <div className="hidden bg-brand-700 text-white lg:block">
        <Container width="wide">
          <div className="flex h-10 items-center justify-between text-[0.8125rem]">
            <p className="flex items-center gap-2 text-brand-50">
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              {city ? `Serving ${city} and the surrounding area` : "Now welcoming new patients"}
            </p>
            <div className="flex items-center gap-5">
              <span className="text-brand-100">New patients welcome</span>
              {tel ? (
                <a
                  href={tel}
                  className="font-semibold text-white transition-opacity hover:opacity-80"
                >
                  Call {phone}
                </a>
              ) : null}
            </div>
          </div>
        </Container>
      </div>

      <header
        className={`sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md transition-shadow ${
          scrolled ? "border-ink-100 shadow-[0_4px_20px_-12px_rgba(13,31,45,0.25)]" : "border-transparent"
        }`}
      >
        <Container width="wide">
          <nav className="flex h-18 items-center justify-between gap-6 py-3" aria-label="Main">
            <Link
              href="/"
              className="flex items-center gap-2.5"
              aria-label={`${clinicName} — home`}
            >
              <Logo className="h-9 w-9" />
              <span className="flex flex-col leading-none">
                <span className="font-[family-name:var(--font-display)] text-[1.0625rem] font-bold tracking-tight text-ink-900">
                  {clinicName}
                </span>
                <span className="mt-1 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-brand-600">
                  Dental Clinic
                </span>
              </span>
            </Link>

            <ul className="hidden items-center gap-1 lg:flex">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={`rounded-full px-3.5 py-2 text-[0.9375rem] font-medium transition-colors ${
                      isActive(link.href)
                        ? "bg-brand-50 text-brand-700"
                        : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="hidden items-center gap-3 lg:flex">
              {tel ? (
                <ButtonLink href={tel} variant="secondary" size="sm">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3 5.7 2 2 0 0 1 5 3.5z" />
                  </svg>
                  {phone}
                </ButtonLink>
              ) : null}
              <ButtonLink href="/appointment" size="sm">
                Book appointment
              </ButtonLink>
            </div>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-xl text-ink-700 hover:bg-ink-50 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                {open ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </nav>
        </Container>

        {open ? (
          <div
            id="mobile-menu"
            className="border-t border-ink-100 bg-white lg:hidden"
          >
            <Container width="wide">
              <ul className="flex flex-col py-2">
                {LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={isActive(link.href) ? "page" : undefined}
                      className={`block rounded-xl px-3 py-3 text-base font-medium ${
                        isActive(link.href)
                          ? "bg-brand-50 text-brand-700"
                          : "text-ink-700"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="grid gap-3 pb-5 pt-2">
                <ButtonLink href="/appointment" size="lg" className="w-full">
                  Book appointment
                </ButtonLink>
                {tel ? (
                  <ButtonLink
                    href={tel}
                    variant="secondary"
                    size="lg"
                    className="w-full"
                  >
                    Call {phone}
                  </ButtonLink>
                ) : null}
              </div>
            </Container>
          </div>
        ) : null}
      </header>
    </>
  );
}
