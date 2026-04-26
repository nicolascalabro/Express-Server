import express from "express";
import passport from "passport";

import User from "../models/user-model.js";
import { hashPassword } from "../utils/password.js";
import { authorizeRoles } from "../middlewares/auth-middleware.js";

const usersRouter = express.Router();

//Para refactorizar los endopoints
const authenticate = passport.authenticate("jwt", {session: false});    //Usuario autenticado
const requireAdmin = [authenticate, authorizeRoles([])];                //Usuario autenticado y con rol admin
const requireUser = [authenticate, authorizeRoles(["user"])];           //Usuario autenticado y con rol user

//Ruta protegida (Get all users) - Passport JWT strategy
usersRouter.get("/", requireAdmin, async (req, res) =>{
    const users = await User.find();
    res.status(200).json({status: "Success", message: "Lista de Usuarios", payload: users});
});

//Create user
usersRouter.post("/", async (req, res) =>{
    const {username, email, password} = req.body;

    let userRole = "user";
    if (email.includes("@admin.com")) {
        userRole = "admin";
    };

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({username, email, password: hashedPassword, role: userRole});
    res.status(201).json({status: "Success", message: "Usuario creado", payload: `User ${newUser.username} creado`});
});

//Ruta protegida (profile) - Passport JWT strategy
usersRouter.get("/profile", requireUser, async (req, res) =>{
    res.status(200).json({status: "Success", message: "Bienvenido a su perfil", payload: req.user});
});

//Ruta protegida (delete user) - Passport JWT strategy
usersRouter.delete("/:id", requireAdmin, async (req, res) =>{
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) res.status(404).json({status: "Error", message: "Usuario no existente"});
    res.status(200).json({status: "Success", message: "Usuario eliminado"});
});

export default usersRouter;