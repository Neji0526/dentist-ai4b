type Props = {
  rating: number;
  className?: string;
  label?: string;
};

export function Stars({ rating, className = "", label }: Props) {
  const rounded = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <span
      className={`inline-flex items-center gap-0.5 ${className}`}
      role="img"
      aria-label={label ?? `${rounded} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <svg
          key={index}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${index < rounded ? "text-amber-400" : "text-ink-200"}`}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 1.6l2.6 5.3 5.8.85-4.2 4.1 1 5.75L10 14.9l-5.2 2.7 1-5.75-4.2-4.1 5.8-.85L10 1.6z" />
        </svg>
      ))}
    </span>
  );
}
