import Image from "next/image";

import { initials } from "@/lib/format";

type Props = {
  name: string;
  src?: string | null;
  size?: number;
  className?: string;
  rounded?: "full" | "card";
};

/**
 * Doctor / patient portrait. Falls back to initials on a soft clinical
 * gradient so the layout never breaks before photos are uploaded to Storage.
 */
export function Avatar({
  name,
  src,
  size = 96,
  className = "",
  rounded = "full",
}: Props) {
  const radius = rounded === "full" ? "rounded-full" : "rounded-2xl";

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={size}
        height={size}
        className={`${radius} object-cover ${className}`}
        sizes={`${size}px`}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: Math.round(size / 2.8) }}
      className={`${radius} flex items-center justify-center bg-gradient-to-br from-brand-100 via-brand-50 to-mint-100 font-semibold text-brand-700 ring-1 ring-inset ring-white/70 ${className}`}
    >
      {initials(name)}
    </div>
  );
}
