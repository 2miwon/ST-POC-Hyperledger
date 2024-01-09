"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const passport_1 = __importDefault(require("passport"));
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('@prisma/client');
const prisma = new client_1.PrismaClient();
const local = () => {
    passport_1.default.use(new LocalStrategy({
        idField: 'id',
    }, async (id, done) => {
        try {
            const exUser = await prisma.user.findUnique({
                where: { id },
            });
            if (exUser) {
                done(null, exUser);
            }
            else {
                done(null, false, { message: '가입되지 않은 회원입니다.' });
            }
        }
        catch (error) {
            console.error(error);
            done(error);
        }
    }));
};
exports.default = local;
