import { PrismaClient } from '@prisma/client';
import passport from 'passport';
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('@prisma/client');

const prisma = new PrismaClient();

const local = () => {
    passport.use(
        new LocalStrategy(
            {
                idField: 'id',
            },
            async (id: string, done: any) => {
                try {
                    const exUser = await prisma.user.findUnique({
                        where: { id },
                    });
                    if (exUser) {
                        done(null, exUser);
                    } else {
                        done(null, false, { message: '가입되지 않은 회원입니다.' });
                    }
                } catch (error: any) {
                    console.error(error);
                    done(error);
                }
            }
        )
    );
};

export default local;
