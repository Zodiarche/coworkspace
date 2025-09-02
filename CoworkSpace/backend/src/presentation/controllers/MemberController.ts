import { Request, Response } from "express";
import { GetRandomMemberUseCase } from "../../application/use-cases/GetRandomMemberUseCase";
import { ListMembersUseCase } from "../../application/use-cases/ListMembersUseCase";
import { UpdateMemberProfileUseCase } from "../../application/use-cases/UpdateMemberProfileUseCase";

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
      const uid = req.user!.sub;
      const uc = this.getRandomUseCaseFactory(uid);
      const member = await uc.execute();

      res.json(member);
    } catch (e: any) {
      res.status(400).json({
        error: e.message || "Echec de la récupération du membre aléatoire",
      });
    }
  };

  list = async (req: Request, res: Response) => {
    const {
      page = 1,
      size = 10,
      name,
      profession,
      membershipType,
    } = req.query as any;
    try {
      const data = await this.listUseCase.execute(
        { name, profession, membershipType },
        { page: Number(page), size: Number(size) }
      );
      res.json(data);
    } catch (e: any) {
      res.status(400).json({
        error: e.message || "Echec lors de la récupération des membres",
      });
    }
  };

  updateOwn = async (req: Request, res: Response) => {
    try {
      const id = req.user!.sub;
      const updated = await this.updateOwnUseCase.execute(id, req.body);

      res.json(updated);
    } catch (e: any) {
      res
        .status(400)
        .json({ error: e.message || "Echec de la mise à jour du profil" });
    }
  };
}
