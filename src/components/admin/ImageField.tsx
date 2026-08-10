"use client";

import { useRef, useState } from "react";
import Image from "next/image";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";

type Props = {
  name: string;
  label: string;
  bucket: string;
  defaultValue?: string | null;
  help?: string;
};

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/**
 * Uploads to a public Supabase Storage bucket and stores the resulting URL in
 * a hidden input, so the surrounding form stays a plain FormData submit.
 * Editors can also paste a URL directly.
 */
export function ImageField({ name, label, bucket, defaultValue, help }: Props) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setError(null);

    if (!ACCEPTED.includes(file.type)) {
      setError("Please choose a JPEG, PNG, WebP or AVIF image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That image is over 5 MB. Please compress it first.");
      return;
    }

    setBusy(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { cacheControl: "31536000", upsert: false });

      if (uploadError) throw new Error(uploadError.message);

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(path);

      setUrl(publicUrl);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Upload failed. Please try again.",
      );
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink-800">{label}</span>
      <input type="hidden" name={name} value={url} />

      <div className="flex flex-wrap items-start gap-4">
        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-ink-100 ring-1 ring-ink-200">
          {url ? (
            <Image
              src={url}
              alt=""
              fill
              sizes="128px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <span className="flex h-full items-center justify-center text-xs text-ink-400">
              No image
            </span>
          )}
        </div>

        <div className="grid flex-1 gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <label className="cursor-pointer rounded-xl bg-white px-3.5 py-2 text-sm font-semibold text-brand-700 ring-1 ring-inset ring-brand-200 transition-colors hover:bg-brand-50">
              {busy ? "Uploading…" : url ? "Replace image" : "Upload image"}
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED.join(",")}
                className="sr-only"
                disabled={busy}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void upload(file);
                }}
              />
            </label>
            {url ? (
              <button
                type="button"
                onClick={() => setUrl("")}
                className="rounded-xl px-3 py-2 text-sm font-medium text-ink-600 hover:bg-ink-50"
              >
                Remove
              </button>
            ) : null}
          </div>

          <input
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="…or paste an image URL"
            className="w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100"
          />

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {help && !error ? (
            <p className="text-xs leading-relaxed text-ink-500">{help}</p>
          ) : null}
          <p className="text-xs text-ink-400">
            Stored in the “{bucket}” bucket. JPEG, PNG, WebP or AVIF, up to 5 MB.
          </p>
        </div>
      </div>
    </div>
  );
}
