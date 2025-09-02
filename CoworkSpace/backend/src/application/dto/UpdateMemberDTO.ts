import { z } from "zod";
import { membershipEnum } from "../../zod/utils";

export const memberUpdateSchema = z
  .object({
    firstname: z.string().min(1).optional(),
    lastname: z.string().min(1).optional(),
    email: z.string().email("Email invalide").optional(),
    password: z
      .string()
      .min(8, "Mot de passe trop court (min 8 caractères)")
      .optional(),
    phone: z.string().min(3).max(50).optional(),
    city: z.string().min(1).optional(),
    country: z.string().min(1).optional(),
    photo: z.string().min(1).optional(),
    profession: z.string().min(1).optional(),
    company: z.string().min(1).optional(),
    skills: z.array(z.string().min(1)).optional(),
    membershipType: membershipEnum.optional(),
    bio: z.string().max(2000).optional(),
    linkedinUrl: z.string().url("URL invalide").optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Au moins un champ doit être fourni pour la mise à jour",
  });

export type UpdateMemberInput = z.input<typeof memberUpdateSchema>;
export type UpdateMemberDTO = z.output<typeof memberUpdateSchema>;
