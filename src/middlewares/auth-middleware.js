//Roles
export const authorizeRoles = (roles) => {
    return (req, res, next) => {
        //Verifica que el usuario ya haya sido autenticado antes
        if (!req.user) return res.status(401).json({ status: "Error", message: "Usuario no autenticado" });

        //Verifica si el rol del usuario es admin, o si en el array que recibe esta incluido el rol del usuario
        if (req.user.role === "admin" || roles.includes(req.user.role)) return next();

        return res.status(403).json({ status: "Error", message: "El usuario no tiene los permisos suficientes" });
    };
};