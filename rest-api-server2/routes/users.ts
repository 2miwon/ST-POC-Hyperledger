import { v4 as uuidv4 } from 'uuid';
import express, { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { invokeChaincode } from './utils/invoke';
import { delay } from './utils/utils';

const router: Router = express.Router();
const prisma = new PrismaClient();

/* GET users listing. */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('respond with a resource');
});

router.get('/my-stos', (req: Request, res: Response, next: NextFunction) => {
    res.send('respond with a resource');
});

router.get('/login', (req: Request, res: Response, next: NextFunction) => {});

// deprecated
router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    try {
        /*
         * 유저가 이미 있는 경우 중복 체크 필요.
         */
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4(); // UUID 생성
        // 지갑도 같이 생성해줘야함.
        const walletId = uuidv4(); // Wallet UUID 생성

        // 생성하기 이전에 HF에서 정상적으로 생성해야함.
        const createHFAccount = await invokeChaincode('CreateAccount', [userId]);
        console.log(createHFAccount);
        // 이거 원래 에러안나오면 stdout에서 나오고 에러나면 stderr에서 나와야 하는데?
        // 일단은 shellcode에서 success 항목 넣어서 해결.
        if (createHFAccount.success) {
            await delay(2000);
            // HF 때문에 2초 딜레이 원래 정상적으로 비동기로 동작하려면 어떻게 해야할까.

            const addFiat = await invokeChaincode('AddFiat', [userId, 10000]);
            // 초기 돈 10000원 추가.
            console.log(addFiat);

            if (addFiat.success) {
                const newUser = await prisma.user.create({
                    data: {
                        id: userId,
                        name: name,
                        email: email,
                        password: hashedPassword,
                        role: 'User',
                        identification: userId,
                        wallet_addr: walletId,
                        // identifiacation은 뭐 하는 거지?
                        wallet: {
                            create: {
                                addr: walletId,
                                fiat_balance: 10000,
                            },
                        },
                    },
                });

                res.status(200).json({
                    message: 'success',
                    userId: userId,
                });
            } else {
                throw new Error('HF AddFiat Error');
            }
        } else {
            throw new Error('HF CreateAccount Error');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

export default router;
