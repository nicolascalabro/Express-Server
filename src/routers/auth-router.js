import express from "express";
import passport from "passport";

import { isRefresh } from "../middlewares/refresh-middleware.js";
import { githubLogin, localLogin, logout, refresh } from "../controllers/auth-controller.js";

const authRouter = express.Router();

//Login - GitHub strategy
authRouter.get("/github", passport.authenticate("github", {scope: ["user:email"], session: false}));

//Callback login - GitHub strategy
authRouter.get("/github/callback", passport.authenticate("github", {failureRedirect: "/auth/login", session: false}), githubLogin);

//Login - Local strategy
authRouter.post("/login", localLogin);

//Logout
authRouter.get("/logout", logout);

//Refresh
authRouter.post("/refresh", isRefresh, refresh);

export default authRouter;