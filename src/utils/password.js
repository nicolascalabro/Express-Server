import bcrypt from "bcrypt";

//Metodo para hashear (retorcer) el password 
export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);      //Cantidad de retorcidas que le hace al password
    return await bcrypt.hash(password, salt);   //Devuelve el password hasheado
};

//Metodo para comparar el password ingresado con el password hasheado guardado en la base de datos
export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};