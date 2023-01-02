import express from "express";
import passport from "passport";
import { authenticate } from "../auth/auth.js";
import { user_login, user_signup } from "../controllers/users.controller.js";
import usersValidation from "../validations/users.validation.js";
// import authValidation from "../validations/authValidator.js";

const authRouter = express.Router();

authRouter.post(
    "/signup",usersValidation,
    passport.authenticate("signup", { session: false }),
    user_signup
);

authRouter.post(
    "/login",usersValidation,
    user_login
);

export default authRouter;
