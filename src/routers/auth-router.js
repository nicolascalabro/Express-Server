import express from "express";
import passport from "passport";

import User from "../models/user-model.js";
import { comparePassword } from "../utils/password.js";
import { generateTokens} from "../utils/jwt.js";
import { isRefresh } from "../middlewares/refresh-middleware.js";
import { env } from "../config/env.js";

const authRouter = express.Router();

//Login - GitHub strategy
authRouter.get("/github", passport.authenticate("github", {scope: ["user:email"], session: false}));

//Callback login - GitHub strategy
authRouter.get("/github/callback", passport.authenticate("github", {failureRedirect: "/auth/login", session: false}), (req,res) => {
    //No hay trycatch ni error porque el login ya ha sido exitoso en este punto
    const {accessToken, refreshToken} = generateTokens(req.user);
    //Se guardan los tokens en cookies. El de acceso lo extrae Passport desde la cookie, de esta forma es mas seguro
    res.cookie("accessToken", accessToken, {httpOnly: true, secure: env.mode === "production", sameSite: "lax", maxAge: 10 * 60 * 1000 });
    res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: env.mode === "production", sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(200).json({status: "Success", message: "Login con GitHub exitoso"});
});

//Login
authRouter.post("/login", async (req, res) =>{
    const {username, password} = req.body;

    const user = await User.findOne({username});
    if(!user) return res.status(404).json({status: "Error", message: "Usuario no encontrado"});

    const isValidPassword = await comparePassword(password, user.password);
    if(!isValidPassword) return res.status(404).json({status: "Error", message: "Password incorrecto"});
        
    const {accessToken, refreshToken} = generateTokens(user);
    //Se guardan los tokens en cookies. El de acceso lo extrae Passport desde la cookie, de esta forma es mas seguro
    res.cookie("accessToken", accessToken, {httpOnly: true, secure: env.mode === "production", sameSite: "lax", maxAge: 10 * 60 * 1000 });
    res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: env.mode === "production", sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(200).json({status: "Success", message: "Login exitoso"});
});

//Logout
authRouter.get("/logout", async (req, res) =>{
    const refreshToken = req.cookies?.refreshToken;
    if(!refreshToken) return res.status(401).json({status: "Error", message: "No hay una sesion iniciada"});

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({status: "Success", message: "Logout exitoso"});
});

//Refresh
authRouter.post("/refresh", isRefresh, async (req, res) => {
    const user = await User.findById(req.user.id);
    if(!user) return res.status(404).json({status: "Error", message: "Usuario no encontrado"});
        
    //Se generan ambos tokens nuevamente como en el login
    const {accessToken, refreshToken} = generateTokens(user);
    //Se guardan los tokens en cookies. El de acceso lo extrae Passport desde la cookie, de esta forma es mas seguro
    res.cookie("accessToken", accessToken, {httpOnly: true, secure: env.mode === "production", sameSite: "lax", maxAge: 10 * 60 * 1000 });
    res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: env.mode === "production", sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(200).json({status: "Success", message: "Token de acceso renovado"});   
});

export default authRouter;