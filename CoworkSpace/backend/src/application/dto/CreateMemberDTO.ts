import { z } from "zod";
import { dateFromInput, genderEnum, membershipEnum } from "../../zod/utils";

export const memberCreateSchema = z
  .object({
    gender: genderEnum,
    firstname: z.string().min(1, "Le prénom est requis"),
    lastname: z.string().min(1, "Le nom est requis"),
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Mot de passe trop court (min 6 caractères)"),
    profession: z.string().min(1).optional(),
    membershipType: membershipEnum,
    joinDate: dateFromInput,
    isManager: z.boolean().default(false),
  })
  .strict();

export type CreateMemberInput = z.input<typeof memberCreateSchema>;
export type CreateMemberDTO = z.output<typeof memberCreateSchema>;
