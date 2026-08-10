import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "accent";
type Size = "sm" | "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none whitespace-nowrap";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white shadow-[0_8px_20px_-8px_rgba(20,102,205,0.6)] hover:bg-brand-700 hover:shadow-[0_12px_28px_-10px_rgba(20,102,205,0.65)] active:translate-y-px",
  accent:
    "bg-mint-600 text-white shadow-[0_8px_20px_-8px_rgba(18,133,91,0.55)] hover:bg-mint-700 active:translate-y-px",
  secondary:
    "bg-white text-brand-700 ring-1 ring-inset ring-brand-200 hover:bg-brand-50 hover:ring-brand-300",
  ghost: "text-ink-700 hover:bg-ink-100 hover:text-ink-900",
};

const SIZES: Record<Size, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-[0.95rem] px-5 py-2.5",
  lg: "text-base px-7 py-3.5",
};

function classes(variant: Variant, size: Size, className: string) {
  return `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  return <button className={classes(variant, size, className)} {...props} />;
}

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  external?: boolean;
  prefetch?: boolean;
  "aria-label"?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  external,
  prefetch,
  ...rest
}: ButtonLinkProps) {
  const isExternal = external ?? /^(https?:|tel:|mailto:)/i.test(href);

  if (isExternal) {
    return (
      <a
        href={href}
        className={classes(variant, size, className)}
        {...(href.startsWith("http") ? { rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={classes(variant, size, className)}
      {...rest}
    >
      {children}
    </Link>
  );
}
