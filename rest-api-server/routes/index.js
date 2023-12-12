const express = require('express');
const router = express.Router();
const { invokeChaincode } = require('./utils/invoke');
const query = require('./query');
const { execute, asyncexecute } = require('./utils/shell');

/* GET home page. */
// index.js
router.get('/', (req, res, next) => {
    res.render('index', { title: 'Express' });
});

router.get('/api/make_user', (req, res, next) => {
    res.status(200).json({
        message: 'hello get api nodejs-api',
    });
});

// peer chaincode query
router.get('/api/query', (req, res, next) => {
    res.status(200).json({
        message: 'get query api not implemented',
    });
});

// peer chaincode query for prototype

router.get('/api/:channel', async (req, res, next) => {
    try {
        const result = await asyncexecute(
            `peer chaincode query -C ${req.params.channel} -n basic -c '{"Args":["GetAllAccounts"]}'`
        );
        res.status(200).json(result.stdout);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/:channel/:address', async (req, res, next) => {
    try {
        const result = await asyncexecute(
            `peer chaincode query -C ${req.params.channel} -n basic -c '{"Args":["ReadAccount", "${req.params.address}"]}'`
        );
        res.status(200).json(result.stdout);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

router.get('/api/:channel/transfer', (req, res, next) => {
    const response = execute(
        `peer chaincode query -C ${req.params.channel} -n basic -c  '{"Args":["GetAllTransfers"]}'`
    );
    res.status(200).json({ response });
});

router.post('/api/transfer', async (req, res, next) => {
    const requestData = req.body;
    // 함수 이름과 인수 추출
    const functionName = requestData.function;
    const functionArgs = requestData.Args;
    try {
        console.log(`functionName: ${functionName}`);
        console.log(`functionArgs: ${functionArgs}`);
        const result = await invokeChaincode(functionName, functionArgs);
        res.status(200).json(result.stdout);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
