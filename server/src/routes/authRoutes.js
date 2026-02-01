import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import express from "express";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
