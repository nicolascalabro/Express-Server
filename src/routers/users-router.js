import express from "express";
import passport from "passport";

import { authorizeRoles } from "../middlewares/auth-middleware.js";
import { getAllUsers, createUser, getProfile, deleteUser, getPremiumContent } from "../controllers/users-controller.js";

const usersRouter = express.Router();

//Para refactorizar los endopoints
const authenticate = passport.authenticate("jwt", {session: false});    //Usuario autenticado
const requireAdmin = [authenticate, authorizeRoles([])];                //Usuario autenticado y con rol admin
const requireUser = [authenticate, authorizeRoles(["user"])];           //Usuario autenticado y con rol user

//Ruta protegida (Get all users) - Passport JWT strategy
usersRouter.get("/", requireAdmin, getAllUsers);

//Create user
usersRouter.post("/register", createUser);

//Ruta protegida (profile) - Passport JWT strategy
usersRouter.get("/profile", requireUser, getProfile);

//Ruta protegida (delete user) - Passport JWT strategy
usersRouter.delete("/:id", requireAdmin, deleteUser);

//Ruta protegida (admin) - Passport JWT strategy
usersRouter.get("/admin", requireAdmin, getPremiumContent);

export default usersRouter;