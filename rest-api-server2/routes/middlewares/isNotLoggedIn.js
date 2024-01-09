"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    }
    else {
        const message = encodeURIComponent('로그인한 상태입니다.');
        res.status(400).send(message);
    }
};
exports.default = isNotLoggedIn;
