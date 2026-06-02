import { faker } from "@faker-js/faker";

import User from "../models/user-model.js";
import { hashPassword } from "../utils/password.js";
import { logger } from "../utils/logger.js";

export const getAllUsers = async (req, res) =>{
    const users = await User.find();
    logger.info("Se obtienen usuarios desde la base de datos");
    res.status(200).json({status: "Success", message: "Lista de Usuarios", payload: users});
};

export const createUser = async (req, res) =>{
    const {username, email, password} = req.body;

    let userRole = "user";
    if (email.includes("@admin.com")) {
        userRole = "admin";
    };

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({username, email, password: hashedPassword, role: userRole});
    logger.info("Se crea usuario");
    res.status(201).json({status: "Success", message: "Usuario creado", payload: `User ${newUser.username} creado`});
};

export const getProfile =  async (req, res) =>{
    logger.info("Se obtiene perfil de usuario");
    res.status(200).json({status: "Success", message: "Bienvenido a su perfil", payload: req.user});
};

export const deleteUser = async (req, res) =>{
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) res.status(404).json({status: "Error", message: "Usuario no existente"});
    logger.info("Se elimina usuario");
    res.status(200).json({status: "Success", message: "Usuario eliminado"});
};

export const getPremiumContent = async (req, res) =>{
    logger.info("Se accede a contenido preimum");
    res.status(200).json({status: "Success", message: "Bienvenido al contenido premium"});
};

export const createFakeUsers = async (req, res) => {
    const quantity = req.params.quantity;
    const fakeUsers = [];

    for (let i = 0; i <= quantity; i++){
        const user = {
            username: faker.person.firstName(),
            email: faker.internet.email(),
            password: faker.lorem.word()
        }
        fakeUsers.push(user);
    }

    logger.info("Se crean usuarios falsos");
    res.status(200).json({status: "Success", message: "Se crearon los usuarios falsos", payload: fakeUsers});
};