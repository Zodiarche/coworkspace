import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { AssignManagerRoleUseCase } from "./application/use-cases/AssignManagerRoleUseCase";
import { CreateMemberUseCase } from "./application/use-cases/CreateMemberUseCase";
import { DeleteMemberUseCase } from "./application/use-cases/DeleteMemberUseCase";
import { GetRandomMemberUseCase } from "./application/use-cases/GetRandomMemberUseCase";
import { ListMembersUseCase } from "./application/use-cases/ListMembersUseCase";
import { LoginUseCase } from "./application/use-cases/LoginUseCase";
import { UpdateMemberProfileUseCase } from "./application/use-cases/UpdateMemberProfileUseCase";
import { UpdateMemberUseCase } from "./application/use-cases/UpdateMemberUseCase";
import { AuthService } from "./domain/services/AuthService";
import { MemberService } from "./domain/services/MemberService";
import { BcryptPasswordHasher } from "./infrastructure/auth/BcryptPasswordHasher";
import { JwtTokenProvider } from "./infrastructure/auth/JwtTokenProvider";
import { DatabaseContext } from "./infrastructure/database/DatabaseContext";
import { AdminController } from "./presentation/controllers/AdminController";
import { AuthController } from "./presentation/controllers/AuthController";
import { MemberController } from "./presentation/controllers/MemberController";
import { buildRoutes } from "./presentation/routes";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

(async () => {
  await DatabaseContext.init();

  const repo = DatabaseContext.getMemberRepository();
  const hasher = new BcryptPasswordHasher();
  const tokens = new JwtTokenProvider(process.env.JWT_SECRET!);

  const memberService = new MemberService(repo, hasher);
  const authService = new AuthService(repo, hasher, tokens);

  // Use-cases
  const loginUC = new LoginUseCase(authService);
  const listMembersUC = new ListMembersUseCase(memberService);
  const updateOwnUC = new UpdateMemberProfileUseCase(memberService);
  const createMemberUC = new CreateMemberUseCase(memberService);
  const updateMemberUC = new UpdateMemberUseCase(memberService);
  const deleteMemberUC = new DeleteMemberUseCase(memberService);
  const assignManagerUC = new AssignManagerRoleUseCase(memberService);

  // Controllers
  const authController = new AuthController(loginUC);
  const memberController = new MemberController(
    (currentUserId: string) =>
      new GetRandomMemberUseCase(memberService, () => currentUserId),
    listMembersUC,
    updateOwnUC
  );
  const adminController = new AdminController(
    createMemberUC,
    updateMemberUC,
    deleteMemberUC,
    assignManagerUC
  );

  // Routes
  app.use(
    "/api",
    buildRoutes({
      auth: authController,
      member: memberController,
      admin: adminController,
      tokens,
    })
  );

  // Health
  app.get("/health", (_req, res) => res.json({ ok: true }));

  const port = Number(process.env.PORT);
  app.listen(port, () => console.log(`[Server] Listening on port ${port}`));
})().catch(() => {
  process.exit(1);
});
