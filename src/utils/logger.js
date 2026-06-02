import winston from "winston";

import { env } from "../config/env.js";

const levelAndColors = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
    },
    colors: {
        fatal: "red",
        error: "magenta",
        warn: "yellow",
        info: "green"
    }
};

const loggerDev = winston.createLogger({
    levels: levelAndColors.levels,
    transports:[
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({colors: levelAndColors.colors}),
                winston.format.simple()
            )
        })
    ]
});

const loggerProd = winston.createLogger({
    levels: levelAndColors.levels,
    transports:[
        new winston.transports.File({
            level: "warn",
            filename: "./error-log.txt",
            format: winston.format.simple()
        })
    ]
});

//console.log(env.mode);

export const logger = env.mode === "production" ? loggerProd : loggerDev;