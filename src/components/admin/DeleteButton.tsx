"use client";

import { useFormStatus } from "react-dom";

type Props = {
  action: () => Promise<void>;
  confirmLabel: string;
  label?: string;
};

function Inner({ label, confirmLabel }: { label: string; confirmLabel: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(confirmLabel)) event.preventDefault();
      }}
      className="rounded-full px-5 py-2.5 text-sm font-semibold text-red-700 ring-1 ring-inset ring-red-200 transition-colors hover:bg-red-50 disabled:opacity-60"
    >
      {pending ? "Deleting…" : label}
    </button>
  );
}

export function DeleteButton({ action, confirmLabel, label = "Delete" }: Props) {
  return (
    <form action={action}>
      <Inner label={label} confirmLabel={confirmLabel} />
    </form>
  );
}
