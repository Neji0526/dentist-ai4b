import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2" | "h3";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
  as: Tag = "h2",
}: Props) {
  const alignment =
    align === "center" ? "text-center mx-auto items-center" : "text-left items-start";

  return (
    <div className={`flex flex-col ${alignment} max-w-2xl ${className}`}>
      {eyebrow ? (
        <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">
          {eyebrow}
        </span>
      ) : null}
      <Tag
        className={
          Tag === "h1"
            ? "text-4xl leading-[1.1] sm:text-5xl"
            : "text-3xl leading-tight sm:text-[2.5rem]"
        }
      >
        {title}
      </Tag>
      {description ? (
        <p className="mt-4 text-lg leading-relaxed text-ink-600">{description}</p>
      ) : null}
    </div>
  );
}
