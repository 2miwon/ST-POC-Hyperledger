import { PrismaClient } from '@prisma/client';

import express, { Express, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import testRouter from './routes/test';
import HttpException from './routes/utils/types';
const createError = require('http-errors');
const dotenv = require('dotenv');

// db 연결부인데..
const prisma = new PrismaClient();
const app: Express = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/test', testRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new HttpException(404, `${req.method} ${req.url} \n no response for routers`);
    next(error);
});

app.use((err: HttpException, req: Request, res: Response, next: NextFunction) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500).json({
        status: err.status,
        log: err.message,
    });
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), ' waiting..');
});
