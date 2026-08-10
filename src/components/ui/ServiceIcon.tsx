import type { ReactNode } from "react";

type Props = {
  name?: string | null;
  className?: string;
};

/**
 * Line icons drawn on a 24-unit grid, 1.6 stroke, so every service card looks
 * like it came from the same set. `name` maps to services.icon in the CMS.
 */
const PATHS: Record<string, ReactNode> = {
  tooth: (
    <path d="M12 3.2c-1.5 0-2.3.7-3.6.7-1 0-1.7-.5-2.6-.2C4.4 4.3 3.6 6.2 3.9 8.6c.2 1.7.9 2.7 1.3 4.4.4 1.6.3 3 .7 4.9.3 1.4.8 2.5 1.7 2.5 1.1 0 1.3-1.6 1.6-3.4.3-1.7.5-3.2 1.9-3.2s1.6 1.5 1.9 3.2c.3 1.8.5 3.4 1.6 3.4.9 0 1.4-1.1 1.7-2.5.4-1.9.3-3.3.7-4.9.4-1.7 1.1-2.7 1.3-4.4.3-2.4-.5-4.3-1.9-4.9-.9-.3-1.6.2-2.6.2-1.3 0-2.1-.7-3.6-.7z" />
  ),
  sparkle: (
    <>
      <path d="M12 3v4M12 17v4M5.5 5.5l2.8 2.8M15.7 15.7l2.8 2.8M3 12h4M17 12h4M5.5 18.5l2.8-2.8M15.7 8.3l2.8-2.8" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
  implant: (
    <>
      <path d="M12 3.5c-1.9 0-3.2 1.3-3.2 3 0 1.2.6 1.9 1.2 2.6" />
      <path d="M12 3.5c1.9 0 3.2 1.3 3.2 3 0 1.2-.6 1.9-1.2 2.6" />
      <path d="M9 10.5h6M9.6 13.5h4.8M10.2 16.5h3.6M12 9.2V21" />
    </>
  ),
  smile: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8 13.5c.9 1.8 2.3 2.7 4 2.7s3.1-.9 4-2.7" />
      <path d="M9 9.2v.6M15 9.2v.6" />
    </>
  ),
  aligner: (
    <>
      <path d="M4.5 8.5c2.4-1.4 4.9-2.1 7.5-2.1s5.1.7 7.5 2.1c-.4 4.4-2.2 7.6-4.4 9.2-1 .7-2 1-3.1 1s-2.1-.3-3.1-1c-2.2-1.6-4-4.8-4.4-9.2z" />
      <path d="M8.2 7.4v9.3M12 6.5V18M15.8 7.4v9.3M5.2 11.4h13.6" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.2l7 2.6v5.5c0 4.2-2.8 7.4-7 9.5-4.2-2.1-7-5.3-7-9.5V5.8l7-2.6z" />
      <path d="M9.2 11.9l2 2 3.6-3.7" />
    </>
  ),
  child: (
    <>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5.5 20.5c0-3.3 2.9-5.9 6.5-5.9s6.5 2.6 6.5 5.9" />
      <path d="M9.6 7.6v.4M14.4 7.6v.4M10.7 10.2c.8.6 1.8.6 2.6 0" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.4V12l3.2 2" />
    </>
  ),
  heart: (
    <path d="M12 19.8s-7.2-4.1-7.2-9A3.9 3.9 0 0 1 12 8.4a3.9 3.9 0 0 1 7.2 2.4c0 4.9-7.2 9-7.2 9z" />
  ),
  card: (
    <>
      <rect x="3.2" y="6" width="17.6" height="12" rx="2.4" />
      <path d="M3.2 10.2h17.6M6.6 14.4h3.4" />
    </>
  ),
  users: (
    <>
      <circle cx="9.2" cy="9" r="3.2" />
      <path d="M3.6 19.4c0-3 2.5-5.4 5.6-5.4s5.6 2.4 5.6 5.4" />
      <path d="M16 6.2a3.2 3.2 0 0 1 0 5.8M17.4 14.4c1.8.8 3 2.6 3 4.6" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="9.5" r="5.3" />
      <path d="M9 14.2L7.8 21l4.2-2.2 4.2 2.2-1.2-6.8" />
    </>
  ),
};

export function ServiceIcon({ name, className = "h-6 w-6" }: Props) {
  const icon = (name && PATHS[name]) || PATHS.tooth;

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icon}
    </svg>
  );
}
