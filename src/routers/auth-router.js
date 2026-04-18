import express from "express";
import passport from "passport";

import User from "../models/user-model.js";
import { comparePassword } from "../utils/password.js";
import { generateTokens} from "../utils/jwt.js";
import { isRefresh } from "../middlewares/refresh-middleware.js";

const authRouter = express.Router();

//Login - GitHub strategy
authRouter.get("/github", passport.authenticate("github", {scope: ["user:email"], session: false}));

//Callback login - GitHub strategy
authRouter.get("/github/callback", passport.authenticate("github", {failureRedirect: "/auth/login", session: false}), (req,res) => {
        //No hay trycatch ni error porque el login ya ha sido exitoso en este punto
        const {accessToken, refreshToken} = generateTokens(req.user);   //Genera los tokens (el user aca esta en la req)
        res.cookie("refresh", refreshToken, {httpOnly: true, secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 }); //Guarda el refresh token en una cookie httpOnly para renovar acceso sin exponerlo al cliente
        res.status(200).json({status: "Success", message: "Login con GitHub exitoso", token: accessToken});
    }
);

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

        //Backend borra el refresh token y el frontend deberia eliminar el accessToken
        res.clearCookie("refresh", {
            httpOnly: true,
            secure: false
        });

        res.status(200).json({status: "Success", message: "Logout exitoso"});
    } catch (error) {
        res.status(500).json({status: "Error", message: "Error interno del servidor"});
    }
});

//Refresh
authRouter.post("/refresh", isRefresh, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if(!user) return res.status(404).json({status: "Error", message: "Usuario no encontrado"});
        
        //Se generan ambos tokens nuevamente como en el login
        const {accessToken, refreshToken} = generateTokens(user);   //Genera los tokens
        res.cookie("refresh", refreshToken, {httpOnly: true, secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 }); //Guarda el refresh token en una cookie httpOnly para renovar acceso sin exponerlo al cliente

        res.status(200).json({status: "Success", message: "Token de acceso renovado", token: accessToken});
    } catch (error) {
        res.status(500).json({status: "Error", message: "Error interno del servidor"});
    }
});

export default authRouter;