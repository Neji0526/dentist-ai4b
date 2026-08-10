type Props = {
  className?: string;
};

/** Tooth mark in the brand blue, with a mint highlight. */
export function Logo({ className = "h-9 w-9" }: Props) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="12" fill="var(--color-brand-600)" />
      <path
        d="M20 10.2c-2.2 0-3.4 1-5.3 1-1.4 0-2.5-.7-3.8-.3-2 .8-3.2 3.6-2.7 7.1.3 2.5 1.3 3.9 1.9 6.4.6 2.3.5 4.4 1 7.2.4 2 1.2 3.6 2.5 3.6 1.6 0 1.9-2.3 2.4-5 .4-2.5.7-4.7 2.8-4.7s2.4 2.2 2.8 4.7c.4 2.7.7 5 2.4 5 1.3 0 2.1-1.6 2.5-3.6.5-2.8.4-4.9 1-7.2.6-2.5 1.6-3.9 1.9-6.4.5-3.5-.7-6.3-2.7-7.1-1.3-.4-2.4.3-3.8.3-1.9 0-3.1-1-5.3-1z"
        fill="#ffffff"
      />
      <circle cx="27.5" cy="14.5" r="2.6" fill="var(--color-mint-400)" />
    </svg>
  );
}
