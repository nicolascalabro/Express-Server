import mongoose from "mongoose";

import { env } from "./env.js";
import { logger } from "../utils/logger.js";

const connectMongoDB = async () => {
    try {
        await mongoose.connect(env.uriMongoDB);
        logger.info("Conexion con MongoDB exitosa");
    } catch (error) {
        logger.fatal("Falla al conectar con MongoDB: ", error.message);
        process.exit(1);
    }
};

export default connectMongoDB;