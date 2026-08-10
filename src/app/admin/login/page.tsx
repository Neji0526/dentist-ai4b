import Link from "next/link";
import { Suspense } from "react";

import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/site/Logo";
import { getSiteSettings } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default async function AdminLoginPage() {
  const settings = await getSiteSettings();

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" className="inline-flex">
            <Logo className="h-11 w-11" />
          </Link>
          <h1 className="mt-5 text-2xl">{settings.clinic_name}</h1>
          <p className="mt-1.5 text-[0.9375rem] text-ink-600">
            Staff sign-in for the practice CMS
          </p>
        </div>

        <div className="rounded-3xl bg-white p-7 shadow-[0_1px_2px_rgba(13,31,45,0.04),0_24px_48px_-24px_rgba(13,31,45,0.22)] ring-1 ring-ink-100">
          {isSupabaseConfigured ? (
            <Suspense
              fallback={<div className="h-64 animate-pulse rounded-xl bg-ink-50" />}
            >
              <LoginForm />
            </Suspense>
          ) : (
            <div className="text-center">
              <h2 className="text-lg">Supabase isn’t connected yet</h2>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">
                Add <code className="text-brand-700">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
                and{" "}
                <code className="text-brand-700">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
                to <code className="text-brand-700">.env.local</code>, then restart
                the dev server. Setup steps are in README.md.
              </p>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-ink-500">
          <Link href="/" className="font-medium text-brand-600 hover:underline">
            ← Back to the website
          </Link>
        </p>
      </div>
    </main>
  );
}
