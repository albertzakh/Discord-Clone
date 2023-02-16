import express from "express";
import { RegisterUser, LoginUser, GetCurrentUser, Logout, SendResetPassword, ValidateToken, ResetPassword } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.post("/send-reset-password", SendResetPassword);
router.post("/validate-token", ValidateToken);
router.post("/reset-password", ResetPassword);
router.get("/current-user", GetCurrentUser);
router.get("/logout", Logout);

export default router;