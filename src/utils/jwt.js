import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//Metodo para generar Tokens. Lo uso en la ruta /login
export const generateTokens = (user) => {
    const accessToken = jwt.sign({id: user._id, username: user.username}, process.env.JWT_SECRET, {expiresIn: "1m"});  //Genera un token de acceso con su firma
    const refreshToken = jwt.sign({id: user._id}, process.env.REFRESH_SECRET, {expiresIn: "7d"});   //Genera un token de respaldo con su firma

    return {accessToken, refreshToken};
};

//Metodo para verificar el token cuando el cliente intenta acceder al server. Lo usa el middleware de auth para rutas protegidas
export const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

//Metodo para verificar el token de refresco. Lo usa el middleware de auth para rutas protegidas
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.REFRESH_SECRET);
};