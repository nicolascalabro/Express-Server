import mongoose from "mongoose";
import { env } from "./env.js";

const connectMongoDB = async () => {
    try {
        await mongoose.connect(env.uriMongoDB);
        console.log("Conexion con MongoDB exitosa");
    } catch (error) {
        console.error("Falla al conectar con MongoDB: ", error.message);
        process.exit(1);
    }
};

export default connectMongoDB;