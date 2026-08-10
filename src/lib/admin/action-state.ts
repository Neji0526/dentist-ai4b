/**
 * Shared shape for admin form results.
 *
 * Kept out of the "use server" module because a file marked `use server` may
 * only export async functions — a plain constant there is a build error.
 */
export type ActionState = {
  status: "idle" | "error" | "success";
  message?: string;
};

export const initialActionState: ActionState = { status: "idle" };
