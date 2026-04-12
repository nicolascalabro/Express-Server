import express from "express";

import User from "../models/user-model.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { isAuth } from "../middlewares/auth-middleware.js";

const usersRouter = express.Router();

//Get all users
usersRouter.get("/", async (req, res) =>{
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
        const hashedPassword = await hashPassword(password);
        const newUser = await User.create({username, email, password: hashedPassword});
        res.status(201).json({status: "Success", message: "Usuario creado", payload: `User ${newUser.username} creado`});
    } catch (error) {
        res.status(500).json({status: "Error", message: "Error interno del servidor"});
    }
});

//Ruta protegida. El usuario debe estar logueado para acceder aca
usersRouter.get("/profile", isAuth, async (req, res) =>{
    try {
        //Aca ya no pregunto por la session, porque no se crea en el loguin ahora
        //const user = req.session?.userInfo; //Pregunto si ya existe la cookie de conexion del cliente
        //if(!user) return res.status(401).json({status: "Error", message: "Usuario no logueado"});
        //res.status(200).json({status: "Success", message: "Usuario accediendo a contenido privado porque ya esta logueado", payload: user});
        res.status(200).json({status: "Success", message: "Usuario accediendo a contenido privado porque ya esta logueado"});
    } catch (error) {
        res.status(500).json({status: "Error", message: "Error interno del servidor"});
    }
});

export default usersRouter;