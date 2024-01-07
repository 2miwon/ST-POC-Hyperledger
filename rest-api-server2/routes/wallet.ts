import express, { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { invokeChaincode } from './utils/invoke';
import { asyncexecute } from './utils/shell';
import { v4 as uuidv4 } from 'uuid';
import { delay } from './utils/utils';

const router: Router = express.Router();
const prisma = new PrismaClient();

router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body;
    try {
        const findUser = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (findUser) {
            const walletaddr = await prisma.wallet.findUnique({
                where: {
                    addr: findUser.wallet_addr!,
                },
            });
            if (!walletaddr) {
                const walletId = uuidv4();

                const createHFAccount = await invokeChaincode('CreateAccount', [userId]);
                console.log(createHFAccount);

                if (createHFAccount.success) {
                    await delay(2000);
                    const addFiat = await invokeChaincode('AddFiat', [userId, 10000]);
                    console.log(addFiat);

                    if (addFiat.success) {
                        const newWallet = await prisma.wallet.create({
                            data: {
                                addr: walletId,
                                fiat_balance: 10000,
                                owner_id: userId,
                            },
                        });
                        res.status(200).json({
                            message: 'success',
                            userId: userId,
                            walletId: walletId,
                        });
                    } else {
                        throw new Error('Add HF-Fiat Error');
                    }
                } else {
                    throw new Error('Create HF-Account Error');
                }
            } else {
                throw new Error('Wallet already exists');
            }
        } else {
            throw new Error('User Not Found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

export default router;
