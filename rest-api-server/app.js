"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const index_1 = __importDefault(require("./routes/index"));
const users_1 = __importDefault(require("./routes/users"));
const types_1 = __importDefault(require("./routes/utils/types"));
const createError = require('http-errors');
const dotenv = require('dotenv');
// db 연결부인데..
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/', index_1.default);
app.use('/users', users_1.default);
app.use((req, res, next) => {
    const error = new types_1.default(404, `${req.method} ${req.url} \n no response for routers`);
    next(error);
});
app.use((err, req, res, next) => {
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
