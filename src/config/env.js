import dotenv from "dotenv";

//Inicializacion de variables de entorno
dotenv.config();

export const env = {
    port: process.env.PORT,
    secretCode: process.env.SECRET_CODE,
    uriMongoDB: process.env.URI_MONGODB,
    jwtSecret: process.env.JWT_SECRET,
    jwtRefreshSecret: process.env.REFRESH_SECRET
};