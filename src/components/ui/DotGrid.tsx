type Props = {
  className?: string;
  /** Unique when two grids appear on one page; harmless to repeat otherwise. */
  id?: string;
};

/** Decorative dotted panel used behind hero artwork. */
export function DotGrid({ className = "", id = "dot-grid" }: Props) {
  return (
    <svg className={className} aria-hidden="true">
      <defs>
        <pattern
          id={id}
          width="18"
          height="18"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2.5" cy="2.5" r="2.5" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
