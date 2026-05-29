/**
 * Typed error codes that Server Actions can attach to a failure result so the
 * client can react structurally (redirect on auth loss, close on not-found)
 * instead of string-matching user-facing copy.
 *
 * Lives in its own module (not a `"use server"` file) because those may only
 * export async functions — a class/const export would be rejected.
 */
export type ActionErrorCode = "unauthenticated" | "not_found";

/** Error carrying an {@link ActionErrorCode}, thrown inside TanStack mutationFns. */
export class ActionError extends Error {
  readonly code?: ActionErrorCode;

  constructor(message: string, code?: ActionErrorCode) {
    super(message);
    this.name = "ActionError";
    this.code = code;
  }
}
