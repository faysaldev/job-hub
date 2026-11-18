import { Router } from "express";
import controller from "./auth.controller";
import validate from "../../middlewares/validation.middleware";
import validation from "./auth.validation";
import { authMiddleware, requireRoles } from "../../middlewares/auth.middleware";
import { rateLimit } from "../../middlewares/rateLimit.middleware";
import { requireTrustedOrigin } from "../../middlewares/requireTrustedOrigin";

const router = Router();
// Separate fixed windows: login attempts cannot exhaust password recovery quota.
// The middleware also applies a broader per-IP cap across multiple emails.
const authRate = (action: string, count = 10) => rateLimit(count, 15 * 60, `auth:${action}`);
router.post("/register", requireTrustedOrigin, authRate("register", 5), validate(validation.registerValidation), controller.register);
router.post("/verify-email", requireTrustedOrigin, authRate("verify", 10), validate(validation.verificationValidation), controller.verifyEmail);
router.post("/login", requireTrustedOrigin, authRate("login", 15), validate(validation.loginValidation), controller.login);
router.post("/forgot-password", requireTrustedOrigin, authRate("recover", 5), validate(validation.forgotPasswordValidation), controller.forgotPassword);
router.post("/reset-password", requireTrustedOrigin, authRate("reset", 10), validate(validation.resetPasswordValidation), controller.resetPassword);
router.post("/resend-verification", requireTrustedOrigin, authRate("resend", 5), validate(validation.resendVerificationValidation), controller.resendVerification);
router.post("/refresh", requireTrustedOrigin, rateLimit(60, 15 * 60, "refresh"), controller.refresh);
router.post("/logout", requireTrustedOrigin, controller.logout);
router.delete("/delete/:userId", authMiddleware, requireRoles("admin"), controller.deleteUser);
export default router;
