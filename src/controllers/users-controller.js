import User from "../models/user-model.js";
import { hashPassword } from "../utils/password.js";

export const getAllUsers = async (req, res) =>{
    const users = await User.find();
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
    res.status(201).json({status: "Success", message: "Usuario creado", payload: `User ${newUser.username} creado`});
};

export const getProfile =  async (req, res) =>{
    res.status(200).json({status: "Success", message: "Bienvenido a su perfil", payload: req.user});
};

export const deleteUser = async (req, res) =>{
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) res.status(404).json({status: "Error", message: "Usuario no existente"});
    res.status(200).json({status: "Success", message: "Usuario eliminado"});
};