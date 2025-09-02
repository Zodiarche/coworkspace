import z from "zod";
import { membershipEnum } from "./utils";

export const idParamsSchema = z
  .object({
    id: z.string().uuid(),
  })
  .strict();

export type IdParams = z.output<typeof idParamsSchema>;

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  size: z.coerce.number().int().positive().max(100).default(10),
});

const listFiltersSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    profession: z.string().trim().min(1).optional(),
    membershipType: membershipEnum.optional(),
  })
  .strict();

export const listQuerySchema = z
  .object({
    page: paginationSchema.shape.page.optional(),
    size: paginationSchema.shape.size.optional(),
    name: listFiltersSchema.shape.name.optional(),
    profession: listFiltersSchema.shape.profession.optional(),
    membershipType: listFiltersSchema.shape.membershipType.optional(),
  })
  .strict();
