import z from "zod";
import { membershipEnum } from "../../zod/utils";

export const memberSchema = z
  .object({
    id: z.string(),
    firstname: z.string().min(2).max(100),
    lastname: z.string().min(2).max(100),
    email: z.string().email(),
    photo: z.string().url().nullable().optional(),
    profession: z.string().max(100).optional(),
    company: z.string().max(100).nullable().optional(),
    skills: z.array(z.string().max(100)).optional(),
    membershipType: membershipEnum,
    isManager: z.boolean(),
  })
  .strict();

export type MemberInput = z.input<typeof memberSchema>;
export type MemberDTO = z.output<typeof memberSchema>;
