import { z } from "zod";
import { dateFromInput, genderEnum, membershipEnum } from "../../zod/utils";

const todayString = () => new Date().toISOString().split("T")[0];

export const memberCreateSchema = z
  .object({
    gender: genderEnum,
    firstname: z.string().min(2).max(100),
    lastname: z.string().min(2).max(100),
    email: z.string().email("Email invalide"),
    password: z.string().min(8, "Mot de passe trop court (min 8 caractères)"),
    photo: z.string().url().nullable().optional(),
    profession: z.string().max(100).optional(),
    company: z.string().max(100).nullable().optional(),
    skills: z.array(z.string().max(100)).optional(),
    membershipType: membershipEnum,
    joinDate: dateFromInput.default(todayString),
    isManager: z.boolean().default(false),
  })
  .strict();

export type CreateMemberInput = z.input<typeof memberCreateSchema>;
export type CreateMemberDTO = z.output<typeof memberCreateSchema>;
