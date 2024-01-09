"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const client_1 = require("@prisma/client");
const invoke_1 = require("./utils/invoke");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
/* GET users listing. */
router.get('/', (req, res, next) => {
    res.send('respond with a resource');
});
router.get('/mine');
router.post('/mint', async (req, res, next) => {
    const { userId, stId, offerPrice, offerQty } = req.body;
    try {
        // 토큰 발행 로직
        // 1. 유튜브 채널 유효한지 확인
        // 2. 유저가 존재하는지 확인
        const findUser = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (findUser) {
            // 3. HF 상에서 토큰 생성
            const walletaddr = findUser.wallet_addr;
            const createToken = await (0, invoke_1.invokeChaincode)('Mint', [userId, stId.toString(), offerQty]);
            console.log(createToken);
            if (createToken.success) {
                // 4. DB에 토큰 정보 저장
                const announced_at = new Date();
                const createNewTokens = await prisma.securityToken.create({
                    data: {
                        channel_id: 12345,
                        securityTokenOffer: {
                            create: {
                                offer_price: offerPrice,
                                offer_qty: offerQty,
                                announced_at: announced_at,
                            },
                        },
                    },
                });
                console.log(createNewTokens);
                // 5. 유저 지갑에 토큰 추가
                if (createToken && walletaddr) {
                    const addToken = await prisma.walletRelationship.create({
                        data: {
                            owner_wallet_addr: walletaddr,
                            st_id: createNewTokens.id,
                            qty: offerQty,
                        },
                    });
                    console.log(addToken);
                }
                else {
                    throw new Error('Token Create DB Error');
                }
            }
            else {
                throw new Error('Token Create HF Error');
            }
        }
        else {
            throw new Error('No User on DB');
        }
        res.status(200).json({
            message: 'success',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});
router.post('/buy', async (req, res, next) => {
    const { buyUserId, sellUserId, stId, price, qty } = req.body;
    try {
        // ST 구매 로직
        // 1. 유저가 존재하는지 확인
        const findBuyUser = await prisma.user.findUnique({
            where: {
                id: buyUserId,
            },
        });
        const findSellUser = await prisma.user.findUnique({
            where: {
                id: sellUserId,
            },
        });
        console.log('findBuyUser: ', findBuyUser);
        console.log('findSellUser: ', findSellUser);
        // 2. ST 존재하는지 확인
        const findST = await prisma.securityToken.findUnique({
            where: {
                id: stId,
            },
            include: {
                securityTokenOffer: true,
            },
        });
        console.log('findST: ', findST);
        if (findBuyUser && findSellUser && findST && findBuyUser.wallet_addr && findSellUser.wallet_addr) {
            // 3. 살 유저가 돈이 충분한지 확인
            const enoughFiat = await prisma.wallet.findUnique({
                where: {
                    addr: findBuyUser.wallet_addr,
                },
            });
            console.log('enoughFiat: ', enoughFiat);
            // 4. 팔 유저가 ST가 충분한지 확인
            const enoughST = await prisma.wallet.findUnique({
                where: {
                    addr: findSellUser.wallet_addr,
                },
                include: {
                    relationships: {
                        where: {
                            st_id: stId,
                        },
                    },
                },
            });
            console.log('enoughST: ', enoughST);
            if (enoughFiat && enoughFiat.fiat_balance && enoughST && enoughST.relationships) {
                if (!(enoughFiat.fiat_balance >= price * qty)) {
                    throw new Error('Not Enough Fiat for Buy User');
                }
                if (!(enoughST.relationships[0].qty >= qty)) {
                    throw new Error('Not Enough Tokens for Sell User');
                }
                // 5. HF 상에서 토큰 transfer
                const transferBatch = [
                    {
                        FromAddress: sellUserId,
                        Price: price,
                        ST_ID: stId.toString(),
                        Size: qty,
                        TransferId: (0, uuid_1.v4)(), // ...?
                        ToAddress: buyUserId,
                    },
                ];
                const transferToken = await (0, invoke_1.invokeChaincode)('ProcessTransferBatch', transferBatch);
                console.log('Transfering Tokens: ');
                console.log(transferToken);
                if (transferToken.success) {
                    // 6. token transfer가 성공적으로 이루어진다면, DB에 변경된 사항 저장
                    // BuyUser 잔액 감소, ST 증가. SellUser 잔액 증가, ST 감소.
                    // 위 변경사항을 한 transaction에 반영.
                    // buy user 잔액 감소
                    await prisma.$transaction(async (prisma) => {
                        if (findBuyUser && findSellUser && findBuyUser.wallet_addr && findSellUser.wallet_addr) {
                            await prisma.wallet.update({
                                where: { addr: findBuyUser.wallet_addr },
                                data: { fiat_balance: { decrement: price * qty } },
                            });
                            // sell user 잔액 증가
                            await prisma.wallet.update({
                                where: { addr: findSellUser.wallet_addr },
                                data: { fiat_balance: { increment: price * qty } },
                            });
                            // buy user st 증가
                            await prisma.walletRelationship.upsert({
                                where: {
                                    owner_wallet_addr_st_id: {
                                        owner_wallet_addr: findBuyUser.wallet_addr,
                                        st_id: stId,
                                    },
                                },
                                update: { qty: { increment: qty } },
                                create: {
                                    owner_wallet_addr: findBuyUser.wallet_addr,
                                    st_id: stId,
                                    qty: qty,
                                },
                            });
                            // sell user st 증가
                            await prisma.walletRelationship.update({
                                where: {
                                    owner_wallet_addr_st_id: {
                                        owner_wallet_addr: findSellUser.wallet_addr,
                                        st_id: stId,
                                    },
                                },
                                data: { qty: { decrement: qty } },
                            });
                        }
                        else {
                            throw new Error('DB Transaction Error');
                        }
                    });
                }
                else {
                    throw new Error('Token Transfer HF Error');
                }
            }
        }
        res.status(200).json({
            message: 'success',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});
exports.default = router;
