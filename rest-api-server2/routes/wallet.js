"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const invoke_1 = require("./utils/invoke");
const uuid_1 = require("uuid");
const utils_1 = require("./utils/utils");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.post('/create', async (req, res, next) => {
    const { userId } = req.body;
    try {
        if (!userId)
            throw new Error('userId is required');
        const findUser = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!findUser) {
            throw new Error('User Not Found');
        }
        else if (findUser && findUser.wallet_addr) {
            throw new Error('Wallet already exists');
        }
        else if (findUser && findUser.wallet_addr === null) {
            const walletId = (0, uuid_1.v4)();
            const createHFAccount = await (0, invoke_1.invokeChaincode)('CreateAccount', [userId]);
            console.log(createHFAccount);
            if (createHFAccount.success) {
                await (0, utils_1.delay)(2000);
                const addFiat = await (0, invoke_1.invokeChaincode)('AddFiat', [userId, 10000]);
                console.log(addFiat);
                if (addFiat.success) {
                    const newWallet = await prisma.wallet.create({
                        data: {
                            addr: walletId,
                            fiat_balance: 10000,
                            owner_id: userId,
                        },
                    });
                    if (newWallet && newWallet.addr) {
                        const updatedUser = await prisma.user.update({
                            where: { id: userId },
                            data: { wallet_addr: newWallet.addr },
                        });
                        if (updatedUser) {
                            res.status(200).json({
                                message: 'success',
                                userId: userId,
                                walletId: walletId,
                            });
                        }
                        else {
                            throw new Error('Update User Error');
                        }
                    }
                    else {
                        throw new Error('Create Wallet Error');
                    }
                }
                else {
                    throw new Error('Add HF-Fiat Error');
                }
            }
            else {
                throw new Error('Create HF-Account Error');
            }
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});
exports.default = router;
