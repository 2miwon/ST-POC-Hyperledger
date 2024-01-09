"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require('passport');
const localStrategy_1 = __importDefault(require("./localStrategy"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// done: any가 맞나?
const passportConfig = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        prisma.user
            .findUnique({
            where: { id: id },
        })
            .then((user) => done(null, user)) // req.user, req.isAuthenticated()
            .catch((err) => done(err));
    });
    //google();
    (0, localStrategy_1.default)();
};
exports.default = passportConfig;
