import type { ElementType, ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  width?: "default" | "narrow" | "wide";
};

const WIDTHS = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
} as const;

export function Container({
  children,
  className = "",
  as: Tag = "div",
  width = "default",
}: ContainerProps) {
  return (
    <Tag
      className={`mx-auto w-full ${WIDTHS[width]} px-5 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </Tag>
  );
}
