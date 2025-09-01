import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { MemberController } from "../controllers/MemberController";
import { AdminController } from "../controllers/AdminController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { RoleMiddleware } from "../middlewares/RoleMiddleware";
import { TokenProvider } from "../../domain/interfaces/TokenProvider";

export const buildRoutes = (deps: {
  auth: AuthController;
  member: MemberController;
  admin: AdminController;
  tokens: TokenProvider;
}) => {
  const router = Router();

  // Auth
  router.post("/auth/login", deps.auth.login);

  // Authenticated routes
  router.get("/members/random", AuthMiddleware(deps.tokens), deps.member.getRandom);
  router.get("/members", AuthMiddleware(deps.tokens), deps.member.list);
  router.patch("/members/me", AuthMiddleware(deps.tokens), deps.member.updateOwn);

  // Admin routes
  router.post("/admin/members", AuthMiddleware(deps.tokens), RoleMiddleware(), deps.admin.create);
  router.put("/admin/members/:id", AuthMiddleware(deps.tokens), RoleMiddleware(), deps.admin.update);
  router.delete("/admin/members/:id", AuthMiddleware(deps.tokens), RoleMiddleware(), deps.admin.delete);
  router.post("/admin/members/:id/assign-manager", AuthMiddleware(deps.tokens), RoleMiddleware(), deps.admin.assignManager);

  return router;
};
