import Image from "next/image";

import { ClinicScene, type SceneName } from "@/components/site/ClinicScene";

type Props = {
  /** Real photography, when the practice has supplied it. */
  src?: string | null;
  alt: string;
  scene: SceneName;
  priority?: boolean;
  className?: string;
};

/**
 * Hero artwork panel. Prefers a real photograph and falls back to the
 * illustrated scene, so a page never ships with an empty grey box.
 */
export function HeroMedia({
  src,
  alt,
  scene,
  priority = false,
  className = "",
}: Props) {
  return (
    <div
      className={`relative aspect-[16/10] overflow-hidden rounded-2xl bg-ink-100 ring-1 ring-ink-100 shadow-[0_2px_4px_rgba(13,31,45,0.05),0_30px_60px_-32px_rgba(13,31,45,0.35)] ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 560px, 100vw"
          className="object-cover"
        />
      ) : (
        <ClinicScene scene={scene} title={alt} className="h-full w-full" />
      )}
    </div>
  );
}
