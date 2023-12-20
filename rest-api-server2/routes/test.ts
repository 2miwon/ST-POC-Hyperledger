import express, { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const router: Router = express.Router();
const prisma = new PrismaClient();

/* GET users listing. */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('respond with a resource');
});

export default router;
