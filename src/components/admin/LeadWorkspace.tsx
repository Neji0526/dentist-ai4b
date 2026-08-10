"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { initialActionState, type ActionState } from "@/lib/admin/action-state";
import { LEAD_STATUSES, LEAD_STATUS_LABELS, type Lead } from "@/lib/types";

type Props = {
  lead: Lead;
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
};

function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

/** Status + private notes, the two things reception actually changes. */
export function LeadWorkspace({ lead, action }: Props) {
  const [state, formAction] = useActionState(action, initialActionState);

  return (
    <form action={formAction} className="rounded-2xl bg-white p-6 ring-1 ring-ink-100">
      <h2 className="text-lg">Update this lead</h2>

      {state.status !== "idle" && state.message ? (
        <p
          role="status"
          className={`mt-4 rounded-xl px-4 py-3 text-sm ring-1 ring-inset ${
            state.status === "success"
              ? "bg-mint-50 text-mint-800 ring-mint-100"
              : "bg-red-50 text-red-700 ring-red-100"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <fieldset className="mt-5">
        <legend className="mb-2 text-sm font-medium text-ink-800">Status</legend>
        <div className="grid gap-2">
          {LEAD_STATUSES.map((status) => (
            <label
              key={status}
              className="flex cursor-pointer items-center gap-3 rounded-xl bg-ink-50 px-4 py-2.5 text-[0.9375rem] text-ink-800 has-checked:bg-brand-50 has-checked:text-brand-800"
            >
              <input
                type="radio"
                name="status"
                value={status}
                defaultChecked={lead.status === status}
                className="h-4 w-4 border-ink-300 text-brand-600 focus:ring-brand-200"
              />
              {LEAD_STATUS_LABELS[status]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5">
        <label
          className="mb-1.5 block text-sm font-medium text-ink-800"
          htmlFor="internal_notes"
        >
          Internal notes
        </label>
        <textarea
          id="internal_notes"
          name="internal_notes"
          rows={5}
          defaultValue={lead.internal_notes ?? ""}
          placeholder="Left voicemail Tuesday. Calling back Thursday morning."
          className="w-full resize-y rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-[0.9375rem] text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100"
        />
        <p className="mt-1.5 text-xs text-ink-500">
          Staff only — never shown to the patient.
        </p>
      </div>

      <div className="mt-5">
        <SaveButton />
      </div>
    </form>
  );
}
