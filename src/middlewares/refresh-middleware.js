import { verifyRefreshToken } from "../utils/jwt.js";

//Middelware para verificar que el refresh token
export const isRefresh = (req, res, next) => {
    const refreshToken = req.cookies?.refresh;

    if (!refreshToken) {
        return res.status(401).json({status: "Error", message: "Refresh token no encontrado"});
    }

    try {
        const decoded = verifyRefreshToken(refreshToken);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({status: "Error", message: "Refresh token invalido o expirado"});
    }
};
