"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";

const INPUT =
  "w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-[0.95rem] text-ink-900 placeholder:text-ink-400 transition-colors hover:border-ink-300 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Only ever follow an in-app path, so ?next= cannot become an open redirect.
  const requested = searchParams.get("next") ?? "/admin";
  const next = requested.startsWith("/admin") ? requested : "/admin";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(
          signInError.message === "Invalid login credentials"
            ? "That email and password combination doesn't match an account."
            : signInError.message,
        );
        return;
      }

      // refresh() lets the server components pick up the new session cookie.
      router.replace(next);
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Sign-in failed. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {error ? (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-inset ring-red-100"
        >
          {error}
        </p>
      ) : null}

      <div>
        <label
          className="mb-1.5 block text-sm font-medium text-ink-800"
          htmlFor="email"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={INPUT}
          placeholder="you@clinic.com"
        />
      </div>

      <div>
        <label
          className="mb-1.5 block text-sm font-medium text-ink-800"
          htmlFor="password"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={INPUT}
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={busy}
        className="mt-1 w-full rounded-full bg-brand-600 px-6 py-3 text-[0.95rem] font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>

      <p className="text-center text-xs leading-relaxed text-ink-500">
        Accounts are created by an administrator in the Supabase dashboard. There
        is no public sign-up.
      </p>
    </form>
  );
}
