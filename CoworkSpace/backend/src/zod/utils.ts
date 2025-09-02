import z, { ZodError } from "zod";

export const genderEnum = z.enum(["male", "female"]);
export const membershipEnum = z.enum(["Basic", "Premium", "Enterprise"]);
export const dateFromInput = z.coerce.date({ required_error: "Date requise" });

export function formatZodError(err: ZodError) {
  return err.errors.map((e) => ({
    path: e.path.join("."),
    message: e.message,
    code: e.code,
  }));
}

export function parseOrThrow<T>(schema: z.ZodType<T>, payload: unknown): T {
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    const details = formatZodError(parsed.error);
    const error = new Error("ValidationError");
    // @ts-expect-error on stocke les détails pour la réponse HTTP
    error.details = details;
    throw error;
  }
  return parsed.data;
}
