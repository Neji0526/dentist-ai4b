/** Kept out of the "use server" module, which may export only async functions. */
export type SubscribeState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export const initialSubscribeState: SubscribeState = { status: "idle" };
