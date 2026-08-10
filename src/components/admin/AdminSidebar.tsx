"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/site/Logo";
import { RESOURCES } from "@/lib/admin/resources";

type Props = {
  clinicName: string;
  email: string | null;
  newLeadCount: number;
  signOut: () => Promise<void>;
};

const OVERVIEW = [
  { href: "/admin", label: "Dashboard", icon: "grid" },
  { href: "/admin/leads", label: "Leads", icon: "inbox" },
];

function Icon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    grid: (
      <>
        <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
      </>
    ),
    inbox: (
      <>
        <path d="M3.5 13.5h4l1.5 2.5h6l1.5-2.5h4" />
        <path d="M5.5 4.5h13l2 9v4a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-4l2-9z" />
      </>
    ),
    doc: (
      <>
        <path d="M6 3.5h7l5 5v12a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 20.5V5A1.5 1.5 0 0 1 6.5 3.5z" />
        <path d="M13 3.5V9h5M8.5 13h7M8.5 17h5" />
      </>
    ),
    cog: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3.5v2M12 18.5v2M4.9 7.6l1.7 1M17.4 15.4l1.7 1M4.9 16.4l1.7-1M17.4 8.6l1.7-1M3.5 12h2M18.5 12h2" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] ?? paths.doc}
    </svg>
  );
}

export function AdminSidebar({ clinicName, email, newLeadCount, signOut }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const linkClass = (href: string) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive(href)
        ? "bg-brand-50 text-brand-700"
        : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
    }`;

  const nav = (
    <nav className="flex h-full flex-col gap-6" aria-label="Admin">
      <div className="grid gap-1">
        <p className="px-3 pb-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-400">
          Overview
        </p>
        {OVERVIEW.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={linkClass(item.href)}
            onClick={() => setOpen(false)}
          >
            <Icon name={item.icon} />
            <span className="flex-1">{item.label}</span>
            {item.href === "/admin/leads" && newLeadCount > 0 ? (
              <span className="rounded-full bg-mint-500 px-2 py-0.5 text-[0.6875rem] font-bold text-white">
                {newLeadCount}
              </span>
            ) : null}
          </Link>
        ))}
      </div>

      <div className="grid gap-1">
        <p className="px-3 pb-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-400">
          Content
        </p>
        {RESOURCES.map((resource) => (
          <Link
            key={resource.key}
            href={`/admin/content/${resource.key}`}
            className={linkClass(`/admin/content/${resource.key}`)}
            onClick={() => setOpen(false)}
          >
            <Icon name="doc" />
            {resource.label}
          </Link>
        ))}
      </div>

      <div className="grid gap-1">
        <p className="px-3 pb-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-400">
          Configuration
        </p>
        <Link
          href="/admin/settings"
          className={linkClass("/admin/settings")}
          onClick={() => setOpen(false)}
        >
          <Icon name="cog" />
          Clinic & SEO
        </Link>
      </div>

      <div className="mt-auto border-t border-ink-100 pt-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 pb-3 text-sm font-medium text-brand-600 hover:underline"
        >
          View live site ↗
        </Link>
        <p className="truncate px-3 text-xs text-ink-500">{email}</p>
        <form action={signOut}>
          <button
            type="submit"
            className="mt-2 w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-ink-600 transition-colors hover:bg-ink-50 hover:text-ink-900"
          >
            Sign out
          </button>
        </form>
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile header */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-ink-100 bg-white px-4 py-3 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          <span className="font-[family-name:var(--font-display)] font-bold text-ink-900">
            {clinicName}
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-ink-700 hover:bg-ink-50"
          aria-expanded={open}
          aria-label={open ? "Close admin menu" : "Open admin menu"}
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
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open ? (
        <div className="border-b border-ink-100 bg-white px-4 py-4 lg:hidden">{nav}</div>
      ) : null}

      {/* Desktop rail */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-ink-100 bg-white px-4 py-6 lg:block">
        <Link href="/admin" className="mb-8 flex items-center gap-2.5 px-2">
          <Logo className="h-9 w-9" />
          <span className="flex flex-col leading-none">
            <span className="font-[family-name:var(--font-display)] text-[0.9375rem] font-bold text-ink-900">
              {clinicName}
            </span>
            <span className="mt-1 text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-brand-600">
              Admin
            </span>
          </span>
        </Link>
        <div className="h-[calc(100vh-8rem)]">{nav}</div>
      </aside>
    </>
  );
}
