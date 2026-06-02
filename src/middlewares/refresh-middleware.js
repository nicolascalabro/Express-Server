import { verifyRefreshToken } from "../utils/jwt.js";
import { logger } from "../utils/logger.js";

//Middelware para verificar el refresh token
export const isRefresh = (req, res, next) => {
    const refreshToken = req.cookies?.refreshToken; //nullish es para que no rompa si no existe la propiedad de esa clave, no te da undefined o null

    if (!refreshToken) {
        logger.warn("Refresh token no encontrado");
        return res.status(401).json({status: "Error", message: "Refresh token no encontrado"});
    }

    try {
        const decoded = verifyRefreshToken(refreshToken);
        req.user = decoded;
        next();
    } catch (error) {
        logger.warn("Refresh token invalido o expirado");
        return res.status(403).json({status: "Error", message: "Refresh token invalido o expirado"});
    }
};