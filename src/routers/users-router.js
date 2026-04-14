import express from "express";
import passport from "passport";

import User from "../models/user-model.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { authorizeRoles } from "../middlewares/auth-middleware.js";

const usersRouter = express.Router();

//Para refactorizar los endopoints
const authenticate = passport.authenticate("jwt", {session: false});    //Usuario autenticado
const requireAdmin = [authenticate, authorizeRoles([])];                //Usuario autenticado y con rol admin
const requireUser = [authenticate, authorizeRoles(["user"])];           //Usuario autenticado y con rol user

//Get all users
usersRouter.get("/", requireAdmin, async (req, res) =>{
    try {
        const users = await User.find();
        res.status(200).json({status: "Success", message: "Lista de Usuarios", payload: users});
    } catch (error) {
        res.status(404).json({status: "Error", message: "Usuario no existente"});
    }
});

//Create user
usersRouter.post("/", async (req, res) =>{
    try {
        const {username, email, password} = req.body;

        let userRole = "user";
        if (email.includes("@admin.com")) {
            userRole = "admin";
        };

        const hashedPassword = await hashPassword(password);
        const newUser = await User.create({username, email, password: hashedPassword, role: userRole});
        res.status(201).json({status: "Success", message: "Usuario creado", payload: `User ${newUser.username} creado`});
    } catch (error) {
        res.status(500).json({status: "Error", message: "Error interno del servidor"});
    }
});

//Ruta protegida (profile) - Passport JWT strategy
usersRouter.get("/profile", requireUser, async (req, res) =>{
    try {
        res.status(200).json({status: "Success", message: "Usuario accediendo a ruta protegida porque ya esta logueado", payload: req.user});
    } catch (error) {
        res.status(500).json({status: "Error", message: "Error interno del servidor"});
    }
});

//Ruta protegida (delete user) - Passport JWT strategy
usersRouter.delete("/:id", requireAdmin, async (req, res) =>{
    try {
       const user = await User.findByIdAndDelete(req.params.id);
       if (!user) res.status(404).json({status: "Error", message: "Usuario no existente"});

       res.status(200).json({status: "Success", message: "Usuario eliminado"});
    } catch (error) {
        res.status(500).json({status: "Error", message: "Error al eliminar el usuario"});
    }
});

export default usersRouter;