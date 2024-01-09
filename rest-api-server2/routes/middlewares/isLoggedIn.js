"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.status(403).send('로그인 필요');
    }
};
exports.default = isLoggedIn;
