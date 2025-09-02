import { Request, Response } from "express";
import { AssignManagerRoleUseCase } from "../../application/use-cases/AssignManagerRoleUseCase";
import { CreateMemberUseCase } from "../../application/use-cases/CreateMemberUseCase";
import { DeleteMemberUseCase } from "../../application/use-cases/DeleteMemberUseCase";
import { UpdateMemberUseCase } from "../../application/use-cases/UpdateMemberUseCase";

export class AdminController {
  constructor(
    private readonly createUseCase: CreateMemberUseCase,
    private readonly updateUseCase: UpdateMemberUseCase,
    private readonly deleteUseCase: DeleteMemberUseCase,
    private readonly assignRoleUseCase: AssignManagerRoleUseCase
  ) {}

  create = async (req: Request, res: Response) => {
    try {
      const member = await this.createUseCase.execute(req.body);

      res.status(201).json(member);
    } catch (e: any) {
      res
        .status(400)
        .json({ error: e.message || "Echec de la création du membre" });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const member = await this.updateUseCase.execute(id, req.body);

      res.json(member);
    } catch (e: any) {
      res
        .status(400)
        .json({ error: e.message || "Echec de la mise à jour du membre" });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      await this.deleteUseCase.execute(id);

      res.status(204).send();
    } catch (e: any) {
      res
        .status(400)
        .json({ error: e.message || "Echec de la suppression du membre" });
    }
  };

  assignManager = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const member = await this.assignRoleUseCase.execute(id);

      res.json(member);
    } catch (e: any) {
      res
        .status(400)
        .json({
          error: e.message || "Echec de l'attribution du rôle de manager",
        });
    }
  };
}
