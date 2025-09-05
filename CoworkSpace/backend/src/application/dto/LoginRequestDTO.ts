import { z } from "zod";

export const loginSchema = z
  .object({
    email: z
      .string({ required_error: "Email requis" })
      .trim()
      .toLowerCase()
      .email("Email invalide"),
    password: z
      .string({ required_error: "Mot de passe requis" })
      .trim()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  })
  .strict();

export type LoginRequestInput = z.input<typeof loginSchema>;
export type LoginRequestDTO = z.output<typeof loginSchema>;
