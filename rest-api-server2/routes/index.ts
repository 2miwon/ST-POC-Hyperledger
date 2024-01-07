import express, { Router, Request, Response, NextFunction } from 'express';
import { invokeChaincode } from './utils/invoke';
import { getEnvString, asyncexecute } from './utils/shell';

const router: Router = express.Router();

/* GET home page. */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.render('index', { title: 'Express' });
});

// peer chaincode query for prototype
router.get('/api/:channel', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await asyncexecute(
            `peer chaincode query -C ${req.params.channel} -n basic -c '{"Args":["GetAllAccounts"]}'`
        );
        res.status(200).json(result.stdout);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

router.get('/api/:channel/accounts', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await asyncexecute(
            `peer chaincode query -C ${req.params.channel} -n basic -c '{"Args":["GetAllAccounts"]}'`
        );
        res.status(200).json(result.stdout);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

router.get('/api/:channel/accounts/:address', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await asyncexecute(
            `peer chaincode query -C ${req.params.channel} -n basic -c '{"Args":["ReadAccount", "${req.params.address}"]}'`
        );
        res.status(200).json(result.stdout);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

router.post('/api/:channel/accounts', async (req: Request, res: Response, next: NextFunction) => {
    const requestData = req.body;
    // 함수 이름과 인수 추출
    const functionArgs = requestData.Args;
    try {
        const functionName = 'CreateAccount';
        console.log(`functionArgs: ${functionArgs}`);
        const result = await invokeChaincode(functionName, functionArgs);
        res.status(200).json(result.stdout);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

router.post('/api/:channel/accounts/delete', async (req: Request, res: Response, next: NextFunction) => {
    const requestData = req.body;
    // 함수 이름과 인수 추출
    const functionArgs = requestData.Args;
    try {
        const functionName = 'DeleteAccount';
        console.log(`functionArgs: ${functionArgs}`);
        const result = await invokeChaincode(functionName, functionArgs);
        res.status(200).json(result.stdout);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

router.post('/api/:channel/accounts/addfiat', async (req: Request, res: Response, next: NextFunction) => {
    const requestData = req.body;
    const functionArgs = requestData.Args; // Ensure this contains the address and the amount
    try {
        const functionName = 'AddFiat';
        console.log(`functionArgs: ${functionArgs}`);
        const result = await invokeChaincode(functionName, functionArgs);
        res.status(200).json(result.stdout);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

// Route for minting new security tokens
router.post('/api/:channel/accounts/mint', async (req: Request, res: Response, next: NextFunction) => {
    const requestData = req.body;
    const functionArgs = requestData.Args; // Ensure this contains the address, stID, and amount
    try {
        const functionName = 'Mint';
        console.log(`functionArgs: ${functionArgs}`);
        const result = await invokeChaincode(functionName, functionArgs);
        res.status(200).json(result.stdout);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

router.post('/api/:channel/transfer', async (req: Request, res: Response, next: NextFunction) => {
    const requestData = req.body;
    // 함수 이름과 인수 추출
    const functionArgs = requestData.Args;
    try {
        const functionName = 'ProcessTransferBatch';
        console.log(`functionArgs: ${functionArgs}`);
        const result = await invokeChaincode(functionName, functionArgs);
        res.status(200).json(result.stdout);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

export default router;
