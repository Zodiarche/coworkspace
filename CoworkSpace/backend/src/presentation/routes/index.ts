import { Router } from "express";
import { TokenProvider } from "../../domain/interfaces/TokenProvider";
import { AdminController } from "../controllers/AdminController";
import { AuthController } from "../controllers/AuthController";
import { MemberController } from "../controllers/MemberController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { RoleMiddleware } from "../middlewares/RoleMiddleware";

export const buildRoutes = (deps: {
  auth: AuthController;
  member: MemberController;
  admin: AdminController;
  tokens: TokenProvider;
}) => {
  const router = Router();

  // Auth
  router.post("/auth/login", deps.auth.login);
  router.post("/auth/logout", deps.auth.logout);
  router.post("/auth/login/verify", deps.auth.verifyToken);

  // Authenticated routes
  router.get(
    "/members/random",
    AuthMiddleware(deps.tokens),
    deps.member.getRandom
  );
  router.get("/members", AuthMiddleware(deps.tokens), deps.member.list);

  router.patch(
    "/members/me",
    AuthMiddleware(deps.tokens),
    deps.member.updateOwn
  );

  // Admin routes
  router.post(
    "/admin/members",
    AuthMiddleware(deps.tokens),
    RoleMiddleware(),
    deps.admin.create
  );
  router.get(
    "/admin/members/:id",
    AuthMiddleware(deps.tokens),
    RoleMiddleware(),
    deps.admin.getById
  );
  router.put(
    "/admin/members/:id",
    AuthMiddleware(deps.tokens),
    RoleMiddleware(),
    deps.admin.update
  );
  router.delete(
    "/admin/members/:id",
    AuthMiddleware(deps.tokens),
    RoleMiddleware(),
    deps.admin.delete
  );
  router.post(
    "/admin/members/:id/assign-manager",
    AuthMiddleware(deps.tokens),
    RoleMiddleware(),
    deps.admin.assignManager
  );

  return router;
};
