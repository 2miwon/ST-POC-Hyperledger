"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const invoke_1 = require("./utils/invoke");
const shell_1 = require("./utils/shell");
const router = express_1.default.Router();
/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'Express' });
});
// peer chaincode query for prototype
router.get('/api/:channel', async (req, res, next) => {
    try {
        const result = await (0, shell_1.asyncexecute)(`peer chaincode query -C ${req.params.channel} -n basic -c '{"Args":["GetAllAccounts"]}'`);
        res.status(200).json(result.stdout);
    }
    catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});
router.get('/api/:channel/accounts', async (req, res, next) => {
    try {
        const result = await (0, shell_1.asyncexecute)(`peer chaincode query -C ${req.params.channel} -n basic -c '{"Args":["GetAllAccounts"]}'`);
        res.status(200).json(result.stdout);
    }
    catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});
router.get('/api/:channel/accounts/:address', async (req, res, next) => {
    try {
        const result = await (0, shell_1.asyncexecute)(`peer chaincode query -C ${req.params.channel} -n basic -c '{"Args":["ReadAccount", "${req.params.address}"]}'`);
        res.status(200).json(result.stdout);
    }
    catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});
router.post('/api/:channel/accounts', async (req, res, next) => {
    const requestData = req.body;
    // 함수 이름과 인수 추출
    const functionArgs = requestData.Args;
    try {
        const functionName = 'CreateAccount';
        console.log(`functionArgs: ${functionArgs}`);
        const result = await (0, invoke_1.invokeChaincode)(functionName, functionArgs);
        res.status(200).json(result.stdout);
    }
    catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});
router.post('/api/:channel/accounts/delete', async (req, res, next) => {
    const requestData = req.body;
    // 함수 이름과 인수 추출
    const functionArgs = requestData.Args;
    try {
        const functionName = 'DeleteAccount';
        console.log(`functionArgs: ${functionArgs}`);
        const result = await (0, invoke_1.invokeChaincode)(functionName, functionArgs);
        res.status(200).json(result.stdout);
    }
    catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});
router.post('/api/:channel/accounts/addfiat', async (req, res, next) => {
    const requestData = req.body;
    const functionArgs = requestData.Args; // Ensure this contains the address and the amount
    try {
        const functionName = 'AddFiat';
        console.log(`functionArgs: ${functionArgs}`);
        const result = await (0, invoke_1.invokeChaincode)(functionName, functionArgs);
        res.status(200).json(result.stdout);
    }
    catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});
// Route for minting new security tokens
router.post('/api/:channel/accounts/mint', async (req, res, next) => {
    const requestData = req.body;
    const functionArgs = requestData.Args; // Ensure this contains the address, stID, and amount
    try {
        const functionName = 'Mint';
        console.log(`functionArgs: ${functionArgs}`);
        const result = await (0, invoke_1.invokeChaincode)(functionName, functionArgs);
        res.status(200).json(result.stdout);
    }
    catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});
router.post('/api/:channel/transfer', async (req, res, next) => {
    const requestData = req.body;
    // 함수 이름과 인수 추출
    const functionArgs = requestData.Args;
    try {
        const functionName = 'ProcessTransferBatch';
        console.log(`functionArgs: ${functionArgs}`);
        const result = await (0, invoke_1.invokeChaincode)(functionName, functionArgs);
        res.status(200).json(result.stdout);
    }
    catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});
exports.default = router;
