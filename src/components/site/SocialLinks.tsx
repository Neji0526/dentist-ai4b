import type { ReactNode } from "react";

import type { SiteSettings } from "@/lib/types";

type Props = {
  settings: SiteSettings;
};

const ICONS: Record<string, ReactNode> = {
  facebook: (
    <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.8-.1-1.7-.15-2.5-.15-2.5 0-4.2 1.5-4.2 4.3v2.15H8.3V13h3.2v8z" />
  ),
  instagram: (
    <>
      <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.9" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.9" cy="7.1" r="1.2" />
    </>
  ),
  google: (
    <path d="M12 10.2v3.7h5.2c-.2 1.3-1.6 3.9-5.2 3.9a5.8 5.8 0 0 1 0-11.6c1.7 0 2.9.7 3.6 1.4l2.5-2.4A9.2 9.2 0 0 0 12 3a9 9 0 1 0 0 18c5.2 0 8.7-3.6 8.7-8.8 0-.6-.1-1.1-.2-1.6z" />
  ),
  yelp: (
    <path d="M11.1 3.4v7.9c0 .9-1 1.4-1.7.9L4.9 9.4c-.6-.4-.6-1.3 0-1.8a11 11 0 0 1 4.7-2.4h.1c.7-.2 1.4.3 1.4 1.1zM10.3 13.9c.5-.5 1.4-.2 1.5.5l.6 4.9c.1.8-.6 1.4-1.3 1.2a11 11 0 0 1-3.5-1.7c-.6-.4-.6-1.3 0-1.8zm3.4-1.2 4.8-1.2c.7-.2 1.4.4 1.3 1.1a11 11 0 0 1-1.3 4c-.4.6-1.2.7-1.7.2l-3.4-3.1c-.5-.5-.3-1.4.3-1.5zm.7 3.7 3 3.8c.4.6.2 1.4-.5 1.6-1.3.4-2.7.5-4 .3-.7-.1-1.2-.8-1-1.5l1.1-4c.2-.7 1.1-.8 1.4-.2zM13.6 10.6l2.7-4c.4-.6 1.3-.6 1.7 0 .9 1.1 1.5 2.4 1.7 3.8.1.7-.5 1.3-1.2 1.2l-4.3-.4c-.7-.1-1-.9-.6-1.5z" />
  ),
};

const LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  google: "Google Business Profile",
  yelp: "Yelp",
};

/** Only renders the networks the practice has actually filled in. */
export function SocialLinks({ settings }: Props) {
  const links = [
    { key: "facebook", href: settings.facebook_url },
    { key: "instagram", href: settings.instagram_url },
    { key: "google", href: settings.google_reviews_url },
    { key: "yelp", href: settings.yelp_url },
  ].filter((link): link is { key: string; href: string } => Boolean(link.href));

  if (links.length === 0) return null;

  return (
    <ul className="flex items-center gap-2.5">
      {links.map((link) => (
        <li key={link.key}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={LABELS[link.key] ?? link.key}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink-600 ring-1 ring-ink-200 transition-colors hover:text-brand-700 hover:ring-brand-200"
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
              {ICONS[link.key] ?? ICONS.google}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
