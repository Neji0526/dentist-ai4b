"use client";

import { useState, useTransition } from "react";

import { togglePublishedAction } from "@/app/admin/actions";

type Props = {
  resourceKey: string;
  id: string;
  field: string;
  value: boolean;
};

/**
 * Inline publish switch for the list views. `is_published` writes straight to
 * the database; other boolean columns (e.g. is_featured) render read-only so we
 * never imply an action that isn't wired up.
 */
export function PublishToggle({ resourceKey, id, field, value }: Props) {
  const [optimistic, setOptimistic] = useState(value);
  const [pending, startTransition] = useTransition();

  if (field !== "is_published") {
    return (
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
          value
            ? "bg-mint-50 text-mint-700 ring-mint-100"
            : "bg-ink-50 text-ink-500 ring-ink-200"
        }`}
      >
        {value ? "Yes" : "No"}
      </span>
    );
  }

  return (
    <button
      type="button"
      disabled={pending}
      aria-pressed={optimistic}
      onClick={() => {
        const next = !optimistic;
        setOptimistic(next);
        startTransition(async () => {
          try {
            await togglePublishedAction(resourceKey, id, next);
          } catch {
            setOptimistic(!next); // Roll back if the write was rejected.
          }
        });
      }}
      className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset transition-colors disabled:opacity-60 ${
        optimistic
          ? "bg-mint-50 text-mint-700 ring-mint-100 hover:bg-mint-100"
          : "bg-ink-50 text-ink-500 ring-ink-200 hover:bg-ink-100"
      }`}
      title={optimistic ? "Published — click to unpublish" : "Hidden — click to publish"}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          optimistic ? "bg-mint-500" : "bg-ink-400"
        }`}
      />
      {optimistic ? "Live" : "Draft"}
    </button>
  );
}
