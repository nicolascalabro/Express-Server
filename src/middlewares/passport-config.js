import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

import User from "../models/user-model.js";
import { env } from "../config/env.js";

const initializePassport = () => {

    //Estrategia de GitHub
    passport.use(
        "github",
        new GitHubStrategy(
            {
                clientID: env.github.clientID,
                clientSecret: env.github.secretID,
                callbackURL: env.github.callbackURL,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const email = profile._json.email || `${profile.username}@github.com`;  //Toma el mail de github
                    let user = await User.findOne({email});                                 //Lo busca en la base de datos
                    
                    if (!user) {
                        user = await User.create({username: profile.username, email: email, password: "password_generico"});    
                    };
                    return done(null, user);    //El primer parametro es el error, como aca no hay se pone null
                } catch (error) {
                    return done(error, null);
                }
            },
        ),
    );

    //Estrategia de JWT
    passport.use(
        "jwt",
        new JwtStrategy(
            {
                //Extrae el token y lo valida
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),   
                secretOrKey: env.jwtSecret,
            },
            async (jwt_payload, done) => {
                try {
                    const userId = jwt_payload.id || jwt_payload._id;
                    const user = await User.findById(userId).select("-password");

                    if (!user) return done(null, false);

                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            },
        ),
    );
   
    /* passport.serializeUser((user, done) => {
        done(null, user._id);
    }); */
    /* passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id).select("-password");
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    }); */
};

export default initializePassport;