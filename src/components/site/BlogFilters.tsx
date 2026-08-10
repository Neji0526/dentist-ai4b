import Link from "next/link";

import { ServiceIcon } from "@/components/ui/ServiceIcon";

export type BlogCategory = {
  label: string;
  /** Matched case-insensitively against a post's tags. */
  tag?: string;
  icon?: string;
};

type Props = {
  categories: BlogCategory[];
  activeTag?: string;
  query?: string;
};

/**
 * Server-driven filters: each pill is a plain link and the search box is a GET
 * form, so filtering costs no client JavaScript and every view is linkable.
 */
export function BlogFilters({ categories, activeTag, query }: Props) {
  const hrefFor = (tag?: string) => {
    const params = new URLSearchParams();
    if (tag) params.set("tag", tag);
    if (query) params.set("q", query);
    const search = params.toString();
    return search ? `/blog?${search}` : "/blog";
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <ul className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isActive = (category.tag ?? "") === (activeTag ?? "");

          return (
            <li key={category.label}>
              <Link
                href={hrefFor(category.tag)}
                aria-current={isActive ? "true" : undefined}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-600 text-white"
                    : "bg-white text-ink-600 ring-1 ring-ink-200 hover:bg-brand-50 hover:text-brand-700 hover:ring-brand-200"
                }`}
              >
                {category.icon ? (
                  <ServiceIcon name={category.icon} className="h-4 w-4" />
                ) : null}
                {category.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <form action="/blog" className="relative shrink-0">
        {activeTag ? <input type="hidden" name="tag" value={activeTag} /> : null}
        <label className="sr-only" htmlFor="blog-search">
          Search articles
        </label>
        <input
          id="blog-search"
          type="search"
          name="q"
          defaultValue={query ?? ""}
          placeholder="Search articles…"
          className="w-full rounded-full border border-ink-200 bg-white py-2.5 pl-4 pr-11 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100 lg:w-64"
        />
        <button
          type="submit"
          aria-label="Search articles"
          className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-ink-50 hover:text-brand-600"
        >
          <ServiceIcon name="search" className="h-[18px] w-[18px]" />
        </button>
      </form>
    </div>
  );
}
