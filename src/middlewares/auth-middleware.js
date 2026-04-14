import { verifyAccessToken } from "../utils/jwt.js";

//Middelware para verificar el access token. Lo uso en las rutas protegidas, como /profile (Al agregar authentication con la strategy JWT, este middleware queda sin usuar)
export const isAuth = (req, res, next) => {
    const authHeaders = req.headers.authorization;
    if(!authHeaders) return res.status(401).json({status: "Error", message: "Usuario no autenticado"});
    const token = authHeaders.split(" ")[1]; //Formato: Bearer xxxxx. Por eso separo por espacio y me quedo con la posicion 1 del array, que es donde esta el token

    try {
        const decoded = verifyAccessToken(token);   //Se envia el token al metodo para que verifique su firma
        req.user = decoded;                         //Guardo la verificacion en una clave que creo dentro de la request
        next();
    } catch (error) {
        res.status(403).json({status: "Error", message: "Token vencido o corrupto"});
    }
};