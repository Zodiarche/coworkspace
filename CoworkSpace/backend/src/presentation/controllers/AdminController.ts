import { Request, Response } from "express";

import { memberCreateSchema } from "../../application/dto/CreateMemberDTO";
import { memberUpdateSchema } from "../../application/dto/UpdateMemberDTO";
import { AssignManagerRoleUseCase } from "../../application/use-cases/AssignManagerRoleUseCase";
import { CreateMemberUseCase } from "../../application/use-cases/CreateMemberUseCase";
import { DeleteMemberUseCase } from "../../application/use-cases/DeleteMemberUseCase";
import { UpdateMemberUseCase } from "../../application/use-cases/UpdateMemberUseCase";
import { GetMemberByIdUseCase } from "../../application/use-cases/GetMemberByIdUseCase";
import { parseOrThrow } from "../../zod/utils";
import { idParamsSchema } from "../../zod/schemas";

export class AdminController {
  constructor(
    private readonly createUseCase: CreateMemberUseCase,
    private readonly updateUseCase: UpdateMemberUseCase,
    private readonly deleteUseCase: DeleteMemberUseCase,
    private readonly getMemberByIdUseCase: GetMemberByIdUseCase,
    private readonly assignRoleUseCase: AssignManagerRoleUseCase
  ) {}

  create = async (req: Request, res: Response) => {
    try {
      const body = parseOrThrow(memberCreateSchema, req.body);
      const member = await this.createUseCase.execute(body);
      res.status(201).json(member);
    } catch (e: any) {
      if (e.message === "ValidationError") {
        return res.status(400).json({
          error: "Données invalides",
          details: e.details,
        });
      }
      res
        .status(400)
        .json({ error: e.message || "Échec de la création du membre" });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id } = parseOrThrow(idParamsSchema, req.params);
      const body = parseOrThrow(memberUpdateSchema, req.body);
      const member = await this.updateUseCase.execute(id, body);
      res.json(member);
    } catch (e: any) {
      if (e.message === "ValidationError") {
        return res.status(400).json({
          error: "Données invalides",
          details: e.details,
        });
      }
      res
        .status(400)
        .json({ error: e.message || "Échec de la mise à jour du membre" });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = parseOrThrow(idParamsSchema, req.params);
      await this.deleteUseCase.execute(id);
      res.status(204).send();
    } catch (e: any) {
      if (e.message === "ValidationError") {
        return res.status(400).json({
          error: "Paramètres invalides",
          details: e.details,
        });
      }
      res
        .status(400)
        .json({ error: e.message || "Échec de la suppression du membre" });
    }
  };

  getById = async (req: Request, res: Response) => {
    console.log("getById admin controller");
    console.log("req.params:", req.params);
    try {
      const { id } = parseOrThrow(idParamsSchema, req.params);
      const member = await this.getMemberByIdUseCase.execute(id);
      res.json(member);
    } catch (e: any) {
      if (e.message === "ValidationError") {
        return res.status(400).json({
          error: "Paramètres invalides",
          details: e.details,
        });
      }
      res.status(400).json({
        error: e.message || "Échec de la récupération du membre",
      });
    }
  };

  assignManager = async (req: Request, res: Response) => {
    try {
      const { id } = parseOrThrow(idParamsSchema, req.params);
      const member = await this.assignRoleUseCase.execute(id);
      res.json(member);
    } catch (e: any) {
      if (e.message === "ValidationError") {
        return res.status(400).json({
          error: "Paramètres invalides",
          details: e.details,
        });
      }
      res.status(400).json({
        error: e.message || "Échec de l'attribution du rôle de manager",
      });
    }
  };
}
