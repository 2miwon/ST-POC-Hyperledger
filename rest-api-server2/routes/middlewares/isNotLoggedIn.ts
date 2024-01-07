import { Request, Response, NextFunction } from 'express';

const isNotLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('로그인한 상태입니다.');
        res.status(400).send(message);
    }
};

export default isNotLoggedIn;
