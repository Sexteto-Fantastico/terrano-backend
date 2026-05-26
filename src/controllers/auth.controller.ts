import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";
import {
  DefinePasswordRequestDto,
  ForgotPasswordRequestDto,
  LoginRequestDto,
  LoginResponseDto,
  ResetPasswordRequestDto,
} from "../dtos/user.dto";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

async function login(
  req: Request<{}, LoginResponseDto, LoginRequestDto>,
  res: Response<LoginResponseDto>
) {
  const result = await AuthService.login(req.body.email, req.body.password);
  res.json(result);
}

async function forgotPassword(
  req: Request<{}, unknown, ForgotPasswordRequestDto>,
  res: Response
) {
  await AuthService.forgotPassword(req.body.email);
  res.json({
    message:
      "If a matching account exists, a password reset link has been sent.",
  });
}

async function resetPassword(
  req: Request<{}, unknown, ResetPasswordRequestDto>,
  res: Response
) {
  await AuthService.resetPassword(req.body.token, req.body.password);
  res.json({ message: "Password has been reset successfully." });
}

async function definePassword(req: AuthenticatedRequest, res: Response) {
  const user = req.user;
  if (!user) {
    throw new Error("Authenticated user not found");
  }

  await AuthService.definePassword(user.id, req.body.password);
  res.json({ message: "Password has been updated successfully." });
}

export { login, forgotPassword, resetPassword, definePassword };
