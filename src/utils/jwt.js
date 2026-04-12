import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

//Metodo para generar Tokens. Lo uso en la ruta /login
export const generateTokens = (user) => {
    const accessToken = jwt.sign({id: user._id, username: user.username}, env.jwtSecret, {expiresIn: "10m"});  //Genera un token de acceso con su firma
    const refreshToken = jwt.sign({id: user._id}, env.jwtRefreshSecret, {expiresIn: "7d"});                     //Genera un token de respaldo con su firma

    return {accessToken, refreshToken};
};

//Metodo para verificar el token cuando el cliente intenta acceder al server. Lo usa el middleware de auth para rutas protegidas
export const verifyAccessToken = (token) => {
    return jwt.verify(token, env.jwtSecret);
};

//Metodo para verificar el token de refresco. Lo usa el middleware de refresh para verificar el refresh token
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, env.jwtRefreshSecret);
};