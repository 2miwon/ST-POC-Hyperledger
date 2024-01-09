"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const invoke_1 = require("./utils/invoke");
const utils_1 = require("./utils/utils");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
/* GET users listing. */
router.get('/', (req, res, next) => {
    res.send('respond with a resource');
});
router.get('/my-stos', (req, res, next) => {
    res.send('respond with a resource');
});
router.get('/login', (req, res, next) => { });
// deprecated
router.post('/create', async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        /*
         * 유저가 이미 있는 경우 중복 체크 필요.
         */
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const userId = (0, uuid_1.v4)(); // UUID 생성
        // 지갑도 같이 생성해줘야함.
        const walletId = (0, uuid_1.v4)(); // Wallet UUID 생성
        // 생성하기 이전에 HF에서 정상적으로 생성해야함.
        const createHFAccount = await (0, invoke_1.invokeChaincode)('CreateAccount', [userId]);
        console.log(createHFAccount);
        // 이거 원래 에러안나오면 stdout에서 나오고 에러나면 stderr에서 나와야 하는데?
        // 일단은 shellcode에서 success 항목 넣어서 해결.
        if (createHFAccount.success) {
            await (0, utils_1.delay)(2000);
            // HF 때문에 2초 딜레이 원래 정상적으로 비동기로 동작하려면 어떻게 해야할까.
            const addFiat = await (0, invoke_1.invokeChaincode)('AddFiat', [userId, 10000]);
            // 초기 돈 10000원 추가.
            console.log(addFiat);
            if (addFiat.success) {
                const newUser = await prisma.user.create({
                    data: {
                        id: userId,
                        name: name,
                        email: email,
                        password: hashedPassword,
                        // role: 'User',
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
            }
            else {
                throw new Error('HF AddFiat Error');
            }
        }
        else {
            throw new Error('HF CreateAccount Error');
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});
router.get('/balance', async (req, res, next) => {
    const { userId } = req.query;
    console.log(userId);
    const result = {
        userId: userId,
        fiat_balance: 0,
        st: [],
    };
    try {
        // 유저가 가지고 있는 지갑 balance와 모든 토큰 종류 조회.
        // 1. 유저가 존재하는지 확인
        const findUser = await prisma.user.findUnique({
            where: {
                id: userId?.toString(),
            },
            include: {
                wallet: true,
            },
        });
        console.log('findUser: ', findUser);
        // 조회한 유저 지갑의 balance와 토큰 종류 조회.
        if (findUser && findUser.wallet_addr) {
            const userWallet = await prisma.wallet.findUnique({
                where: {
                    addr: findUser.wallet_addr,
                },
                include: {
                    relationships: true,
                },
            });
            console.log('userWallet: ', userWallet);
            if (userWallet) {
                result.fiat_balance = userWallet.fiat_balance;
                result.st = userWallet.relationships;
                console.log(result);
                res.status(200).json(result);
            }
        }
        else {
            throw new Error('User Not Found');
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});
exports.default = router;
