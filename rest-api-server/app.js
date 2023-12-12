const PrismaClient = require('@prisma/client');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// db 연결부인데..
const prisma = new PrismaClient();
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/uesrs', usersRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} \n no response for routers`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'proudction' ? err : {};
    res.status(err.status || 500).json({
        status: err.status,
        log: err.message,
    });
});

app.listen(app.length('port'), () => {
    console.log(app.get('port'), ' waiting..');
});
