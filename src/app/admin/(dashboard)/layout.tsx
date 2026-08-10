import { signOutAction } from "@/app/admin/actions";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { resolveAdmin } from "@/lib/admin/auth";
import { getSiteSettings } from "@/lib/data";

// Everything under this layout reads the session cookie, so nothing here is
// ever prerendered. Applies to every nested segment too.
export const dynamic = "force-dynamic";

const SETUP_STEPS = [
  {
    title: "Create a Supabase project",
    body: "supabase.com → New project. Keep the database password somewhere safe.",
  },
  {
    title: "Run the SQL",
    body: "In the SQL Editor, run supabase/migrations/0001_init.sql, then supabase/seed.sql for starter content.",
  },
  {
    title: "Add your keys",
    body: "Copy the project URL and anon key from Project Settings → API into .env.local, then restart the dev server.",
  },
  {
    title: "Create your login",
    body: "Authentication → Users → Add user, then promote that account to admin with the SQL in the README.",
  },
];

function SetupNotice() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-3xl">Connect Supabase to use the admin panel</h1>
      <p className="mt-4 leading-relaxed text-ink-600">
        The public website is running on the bundled demo content. The CMS needs
        a real database before it can do anything, so here is the short version:
      </p>

      <ol className="mt-8 grid gap-5">
        {SETUP_STEPS.map((step, index) => (
          <li
            key={step.title}
            className="flex gap-4 rounded-2xl bg-white p-5 ring-1 ring-ink-100"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">
              {index + 1}
            </span>
            <div>
              <p className="font-semibold text-ink-900">{step.title}</p>
              <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink-600">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-8 text-sm text-ink-500">
        The full walkthrough is in README.md.
      </p>
    </main>
  );
}

function ForbiddenNotice({ email }: { email: string | null }) {
  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="text-3xl">You’re signed in, but not as an admin</h1>
      <p className="mt-4 leading-relaxed text-ink-600">
        {email ? <strong>{email}</strong> : "This account"} does not hold the
        admin role, so the CMS is closed to it. Ask an existing admin for access,
        or run this in the Supabase SQL editor:
      </p>
      <pre className="mt-6 overflow-x-auto rounded-xl bg-ink-900 px-5 py-4 text-left text-sm text-ink-100">
        <code>{`update public.profiles
   set role = 'admin'
 where email = '${email ?? "you@example.com"}';`}</code>
      </pre>
      <form action={signOutAction} className="mt-8">
        <button
          type="submit"
          className="rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Sign out
        </button>
      </form>
    </main>
  );
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [result, settings] = await Promise.all([
    resolveAdmin(),
    getSiteSettings(),
  ]);

  if (result.state === "not-configured") return <SetupNotice />;
  if (result.state === "forbidden") return <ForbiddenNotice email={result.email} />;

  const { count } = await result.session.supabase
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");

  return (
    <div className="lg:flex">
      <AdminSidebar
        clinicName={settings.clinic_name}
        email={result.session.profile.email}
        newLeadCount={count ?? 0}
        signOut={signOutAction}
      />
      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
          {children}
        </div>
      </div>
    </div>
  );
}
