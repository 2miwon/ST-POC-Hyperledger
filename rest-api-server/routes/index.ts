import express, { Router, Request, Response, NextFunction } from 'express';
import HttpException from './utils/types';
import { invokeChaincode } from './utils/invoke';
import { getEnvString, asyncexecute } from './utils/shell';

const router: Router = express.Router();

/* GET home page. */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.render('index', { title: 'Express' });
});

router.get('/api/make_user', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        message: 'hello get api nodejs-api',
    });
});

// peer chaincode query
router.get('/api/query', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        message: 'get query api not implemented',
    });
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

router.get('/api/:channel/:address', async (req: Request, res: Response, next: NextFunction) => {
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

router.get('/api/:channel/transfer', (req: Request, res: Response, next: NextFunction) => {
    const response = asyncexecute(
        `peer chaincode query -C ${req.params.channel} -n basic -c  '{"Args":["GetAllTransfers"]}'`
    );
    res.status(200).json({ response });
});

router.post('/api/transfer', async (req: Request, res: Response, next: NextFunction) => {
    const requestData = req.body;
    // 함수 이름과 인수 추출
    const functionName = requestData.function;
    const functionArgs = requestData.Args;
    try {
        console.log(`functionName: ${functionName}`);
        console.log(`functionArgs: ${functionArgs}`);
        const result = await invokeChaincode(functionName, functionArgs);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(`error: ${error}`);
    }
});

export default router;
