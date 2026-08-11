import Image from "next/image";
import Link from "next/link";

import { ClinicScene } from "@/components/site/ClinicScene";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate } from "@/lib/format";
import type { BlogPost, Doctor } from "@/lib/types";

type Props = {
  post: BlogPost;
  /** Wide layout with the image alongside the copy and a corner ribbon. */
  featured?: boolean;
  /** Resolved from the doctors table so the byline can show a face and role. */
  author?: Doctor | null;
  /** Swap the author byline for a date + Read more footer. */
  showAuthor?: boolean;
  /**
   * Puts the tag on the cover photo and drops the date / read-time row, as the
   * homepage design does.
   */
  overlayTag?: boolean;
};

/** Rotates the illustrated fallback so a grid of posts is not identical. */
const FALLBACK_SCENES = ["hygiene", "tooth-model", "operatory", "reception"] as const;

function fallbackScene(slug: string) {
  const sum = [...slug].reduce((total, char) => total + char.charCodeAt(0), 0);
  return FALLBACK_SCENES[sum % FALLBACK_SCENES.length];
}

export function BlogCard({
  post,
  featured = false,
  author,
  showAuthor = true,
  overlayTag = false,
}: Props) {
  const published = post.published_at ?? post.created_at;

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-ink-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(13,31,45,0.05),0_24px_44px_-24px_rgba(13,31,45,0.28)] hover:ring-brand-200 ${
        featured ? "lg:flex-row" : ""
      }`}
    >
      {featured ? (
        <span className="absolute right-0 top-0 z-10 overflow-hidden">
          <span className="block translate-x-[30%] translate-y-[45%] rotate-45 bg-brand-600 px-8 py-1 text-[0.625rem] font-bold uppercase tracking-[0.1em] text-white">
            Featured
          </span>
        </span>
      ) : null}

      <div
        className={`relative shrink-0 overflow-hidden bg-ink-100 ${
          featured ? "aspect-[16/10] lg:aspect-auto lg:w-[42%]" : "aspect-[16/9]"
        }`}
      >
        {post.cover_image_url ? (
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            sizes={
              featured
                ? "(min-width: 1024px) 480px, 100vw"
                : "(min-width: 640px) 360px, 100vw"
            }
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <ClinicScene
            scene={fallbackScene(post.slug)}
            title={post.title}
            className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}

        {overlayTag && post.tags[0] ? (
          <span className="absolute bottom-3 left-3 z-10 rounded-md bg-white/95 px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-[0.08em] text-brand-700 shadow-sm backdrop-blur-sm">
            {post.tags[0]}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        {overlayTag ? null : (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-500">
            {post.tags[0] ? (
              <span className="rounded-full bg-brand-50 px-2.5 py-1 font-semibold text-brand-700">
                {post.tags[0]}
              </span>
            ) : null}
            <time dateTime={published}>{formatDate(published)}</time>
            <span aria-hidden="true" className="text-ink-300">
              ·
            </span>
            <span>{post.read_minutes} min read</span>
          </div>
        )}

        <h3
          className={`leading-snug ${overlayTag ? "" : "mt-3"} ${
            featured ? "text-[1.5rem]" : "text-[1.0625rem]"
          }`}
        >
          <Link href={`/blog/${post.slug}`} className="hover:text-brand-700">
            <span className="absolute inset-0" aria-hidden="true" />
            {post.title}
          </Link>
        </h3>

        {post.excerpt ? (
          <p
            className={`mt-2.5 flex-1 leading-relaxed text-ink-600 ${
              featured ? "text-[0.9375rem]" : "text-[0.875rem]"
            }`}
          >
            {post.excerpt}
          </p>
        ) : null}

        {showAuthor && post.author_name ? (
          <div className="mt-6 flex items-center justify-between gap-4 border-t border-ink-100 pt-4">
            <div className="flex items-center gap-2.5">
              <Avatar
                name={post.author_name}
                src={author?.photo_url ?? null}
                size={34}
              />
              <div className="min-w-0">
                <p className="truncate text-[0.8125rem] font-semibold text-ink-900">
                  By {post.author_name}
                </p>
                {author?.title ? (
                  <p className="truncate text-xs text-ink-500">{author.title}</p>
                ) : null}
              </div>
            </div>

            <span className="hidden shrink-0 items-center gap-1.5 text-[0.8125rem] font-semibold text-brand-600 sm:inline-flex">
              Read more
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </span>
          </div>
        ) : (
          <div className="mt-6 flex items-center justify-between gap-4 border-t border-ink-100 pt-4 text-[0.8125rem]">
            <time dateTime={published} className="text-ink-500">
              {formatDate(published)}
            </time>
            <span className="inline-flex items-center gap-1.5 font-semibold text-brand-600">
              Read more
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
