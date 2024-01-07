import express, { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const router: Router = express.Router();
const prisma = new PrismaClient();

export default router;
