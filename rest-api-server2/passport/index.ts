const passport = require('passport');
import local from './localStrategy';
import { User } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// done: any가 맞나?
const passportConfig = () => {
    passport.serializeUser((user: User, done: (err: any, id?: string) => void) => {
        done(null, user.id);
    });

    passport.deserializeUser((id: string, done: (err: any, user?: User | false) => void) => {
        prisma.user
            .findUnique({
                where: { id: id },
            })
            .then((user: User | null) => done(null, user!)) // req.user, req.isAuthenticated()
            .catch((err: any) => done(err));
    });

    //google();
    local();
};

export default passportConfig;
