import mongoose from "mongoose";

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.URI_MONGODB);
        console.log("Conexion con MongoDB exitosa");
    } catch (error) {
        console.error("Falla al conectar con MongoDB: ", error.message);
        process.exit(1);
    }
};

export default connectMongoDB;