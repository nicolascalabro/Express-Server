import express from "express";

import User from "../models/user-model.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateTokens} from "../utils/jwt.js";
import { isRefresh } from "../middlewares/refresh-middleware.js";


const authRouter = express.Router();

//Login
authRouter.post("/login", async (req, res) =>{
    try {
        const {username, password} = req.body;

        const user = await User.findOne({username});
        if(!user) return res.status(404).json({status: "Error", message: "Usuario no encontrado"});

        const isValidPassword = await comparePassword(password, user.password);
        if(!isValidPassword) return res.status(404).json({status: "Error", message: "Password incorrecto"});
        
        const {accessToken, refreshToken} = generateTokens(user);   //Genera los tokens
        res.cookie("refresh", refreshToken, {httpOnly: true, secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 }); //Guarda el refresh token en una cookie httpOnly para renovar acceso sin exponerlo al cliente

        //req.session.userInfo = {
            //id: user._id,
            //username: user.username
        //}
        //res.status(200).json({status: "Success", message: "Session iniciada", payload: req.session.userInfo, token: accessToken});

        res.status(200).json({status: "Success", message: "Login exitoso", token: accessToken});
    } catch (error) {
        res.status(500).json({status: "Error", message: "Error interno del servidor"});
    }
});

//Logout
authRouter.get("/logout", async (req, res) =>{
    try {
        const refreshToken = req.cookies?.refresh;
        if(!refreshToken) return res.status(401).json({status: "Error", message: "No hay una sesion JWT activa"});

        res.clearCookie("refresh", {
            httpOnly: true,
            secure: false
        });

        res.status(200).json({status: "Success", message: "Logout exitoso"});
    } catch (error) {
        res.status(500).json({status: "Error", message: "Error interno del servidor"});
    }
});

//Refresh: El middleware verifica que el refresh no se haya vencido, y luego en el endpoint se generan ambos tokens nuevamente como en el login
authRouter.post("/refresh", isRefresh, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if(!user) return res.status(404).json({status: "Error", message: "Usuario no encontrado"});
        
        const {accessToken, refreshToken} = generateTokens(user);   //Genera los tokens
        res.cookie("refresh", refreshToken, {httpOnly: true, secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 }); //Guarda el refresh token en una cookie httpOnly para renovar acceso sin exponerlo al cliente

        res.status(200).json({status: "Success", message: "Token de acceso renovado", token: accessToken});
    } catch (error) {
        res.status(500).json({status: "Error", message: "Error interno del servidor"});
    }
});

export default authRouter;