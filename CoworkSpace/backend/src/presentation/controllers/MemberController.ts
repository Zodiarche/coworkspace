import { Request, Response } from "express";
import { z, ZodError } from "zod";

import { memberSchema } from "../../application/dto/MemberDTO";
import { memberUpdateSchema } from "../../application/dto/UpdateMemberDTO";
import { GetRandomMemberUseCase } from "../../application/use-cases/GetRandomMemberUseCase";
import { ListMembersUseCase } from "../../application/use-cases/ListMembersUseCase";
import { UpdateMemberProfileUseCase } from "../../application/use-cases/UpdateMemberProfileUseCase";
import { listQuerySchema } from "../../zod/schemas";
import { formatZodError } from "../../zod/utils";

export class MemberController {
  constructor(
    private readonly getRandomUseCaseFactory: (
      currentUserId: string
    ) => GetRandomMemberUseCase,
    private readonly listUseCase: ListMembersUseCase,
    private readonly updateOwnUseCase: UpdateMemberProfileUseCase
  ) {}

  getRandom = async (req: Request, res: Response) => {
    try {
      const id = req.user!.sub;
      const uc = this.getRandomUseCaseFactory(id);
      const member = await uc.execute();

      const dto = memberSchema.parse(member);
      res.json(dto);
    } catch (e: any) {
      if (e instanceof ZodError) {
        return res.status(400).json(formatZodError(e));
      }
      res.status(400).json({
        error: e?.message || "Echec de la récupération du membre aléatoire",
      });
    }
  };

  list = async (req: Request, res: Response) => {
    try {
      const q = listQuerySchema.parse(req.query);
      const { page = 1, size = 10, name, profession, membershipType } = q;

      const data = await this.listUseCase.execute(
        { name, profession, membershipType },
        { page: Number(page), size: Number(size) }
      );

      const listResponseSchema = z.object({
        items: z.array(memberSchema),
        total: z.number().int().nonnegative(),
        page: z.number().int().positive(),
        size: z.number().int().positive(),
      });

      const dto = listResponseSchema.parse({
        items: data.items,
        total: data.total,
        page,
        size,
      });
      res.json(dto);
    } catch (e: any) {
      if (e instanceof ZodError) {
        return res.status(400).json(formatZodError(e));
      }
      res.status(400).json({
        error: e?.message || "Echec lors de la récupération des membres",
      });
    }
  };

  updateOwn = async (req: Request, res: Response) => {
    try {
      const id = req.user!.sub;
      const payload = memberUpdateSchema.parse(req.body);
      const updated = await this.updateOwnUseCase.execute(id, payload);
      const dto = memberSchema.parse(updated);

      res.json(dto);
    } catch (e: any) {
      if (e instanceof ZodError) {
        return res.status(400).json(formatZodError(e));
      }
      res
        .status(400)
        .json({ error: e?.message || "Echec de la mise à jour du profil" });
    }
  };
}
