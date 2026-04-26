import passport from "passport";

import User from "../models/user-model.js";
import { generateTokens} from "../utils/jwt.js";
import { env } from "../config/env.js";

export const githubLogin = (req, res) => {
    const {accessToken, refreshToken} = generateTokens(req.user);

    //Se guardan los tokens en cookies. El de acceso lo extrae Passport desde la cookie, de esta forma es mas seguro
    res.cookie("accessToken", accessToken, {httpOnly: true, secure: env.mode === "production", sameSite: "lax", maxAge: 60 * 60 * 1000 });
    res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: env.mode === "production", sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(200).json({status: "Success", message: "Login con GitHub exitoso"});
};

export const localLogin = (req, res, next) => {
    passport.authenticate("local", {session: false}, (err, user, info) => {
        if (err) return res.status(500).json({status: "Error", message: "Error interno del servidor"});
        if (!user) return res.status(401).json({status: "Error", message: info?.message || "Credenciales invalidas"});
        
        const {accessToken, refreshToken} = generateTokens(user);

        //Se guardan los tokens en cookies. El de acceso lo extrae Passport desde la cookie, de esta forma es mas seguro
        res.cookie("accessToken", accessToken, {httpOnly: true, secure: env.mode === "production", sameSite: "lax", maxAge: 60 * 60 * 1000 });
        res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: env.mode === "production", sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });

        res.status(200).json({status: "Success", message: "Login exitoso"});
    })(req, res, next);
};

export const logout = async (req, res) =>{
    const refreshToken = req.cookies?.refreshToken;
    if(!refreshToken) return res.status(401).json({status: "Error", message: "No hay una sesion iniciada"});

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({status: "Success", message: "Logout exitoso"});
  };

export const refresh = async (req, res) => {
    const user = await User.findById(req.user.id);
    if(!user) return res.status(404).json({status: "Error", message: "Usuario no encontrado"});
        
    //Se generan ambos tokens nuevamente
    const {accessToken, refreshToken} = generateTokens(user);

    //Se guardan los tokens en cookies. El de acceso lo extrae Passport desde la cookie, de esta forma es mas seguro
    res.cookie("accessToken", accessToken, {httpOnly: true, secure: env.mode === "production", sameSite: "lax", maxAge: 60 * 60 * 1000 });
    res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: env.mode === "production", sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(200).json({status: "Success", message: "Token de acceso renovado"});   
};