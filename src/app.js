import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
//import MongoStore from "connect-mongo";
import passport from "passport";

import { env } from "./config/env.js";
import usersRouter from "./routers/users-router.js";
import authRouter from "./routers/auth-router.js";
import connectMongoDB from "./config/db.js";
import initializePassport from "./middlewares/passport-config.js";
import { globalErrorHandler } from "./middlewares/error-handler.js";

const app = express();

//------ Configuracion objeto de session ------
/* const sessionConfig = {
    store: MongoStore.create({                  
        mongoUrl: env.uriMongoDB,               //Guarda las sessions en MongoDB en vez de memoria local del server
        ttl: 1 * 24 * 60 *60                    //Duracion de la session en la DB en segundos
    }),
    secret: env.secretCode,                     //Clave para firmar la cookie y evitar manipulaciones del lado del cliente
    resave: false,                              //False: no guarda la sesion si no hubo cambios, lo que optimiza rendimiento
    saveUninitialized: false         
}; */

/* const sessionConfig = {
    secret: env.secretCode,                     //Clave para firmar la cookie y evitar manipulaciones del lado del cliente
    resave: false,                              //False: no guarda la sesion si no hubo cambios, lo que optimiza rendimiento
    saveUninitialized: false         
}; */

//------ Configuracion middlewares de express ------
app.use(express.json());                        //Permite que el servidor entienda JSON en el body de una request.
app.use(express.static("public"));              //Le dice a Express que sirva archivos estaticos desde la carpeta public.
app.use(express.urlencoded({extended: true}));  //Permite leer datos enviados desde formularios HTML tradicionales

//------ Configuracion de cookies ------
//app.engine("handlebars", engine());           //Habilita el motor handlebars
//app.set("view engine", "handlebars");         //Setea handlebars como motor de vistas, porque podemos tener varios
//app.set("views", "./src/views");              //Setea la ruta de las vistas

//------ Cookies ------
app.use(cookieParser());

//------ Sessions ------
//app.use(session(sessionConfig));                //Session crea una cookie con un id que identifica al cliente

//------ Passport ------
initializePassport();
app.use(passport.initialize());                 
//app.use(passport.session());                

//------ Routers ------
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);

//------ Recurso no encontrado ------
app.use((req, res) => {
    res.status(404).json({status: "Error", message: `La ruta ${req.method} ${req.originalUrl} no existe en el servidor`});
});

//------ Manejador de errors global ------
app.use(globalErrorHandler);


//------ Conexion con MongoDB ------
connectMongoDB();

//------ Server listen ------
app.listen(env.port, ()=>{
    console.log("Servidor iniciado");
});