const express = require('express');
const router = express.Router();
const {invokeChaincode} = require('./invoke');
const query = require('./query');
const {execute, asyncexecute} = require('./shell');

/* GET home page. */
// index.js
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/make_user', function(req, res, next) {
  res.status(200).json({
    "message" : "hello get api nodejs-api"
      });
});

// peer chaincode query
router.get('/api/query', function(req, res, next) {
  res.status(200).json({
    "message" : "get query api not implemented"
      });
});

// peer chaincode query for prototype

router.get('/api/:channel', async function(req, res, next) {
  try {
    const result = await asyncexecute(`peer chaincode query -C ${req.params.channel} -n basic -c '{"Args":["GetAllAccounts"]}'`);
    res.status(200).json(result.stdout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/api/:channel/:address', async function(req, res, next) {
  try {
    const result = await asyncexecute(`peer chaincode query -C ${req.params.channel} -n basic -c '{"Args":["ReadAccount", "${req.params.address}"]}'`);
    res.status(200).json(result.stdout);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

router.get('/api/:channel/transfer', function(req, res, next) {
  const response = execute(`peer chaincode query -C ${req.params.channel} -n basic -c  '{"Args":["GetAllTransfers"]}'`);
  res.status(200).json({ response });
});

router.post('/api/transfer', async function(req, res, next) {
  const requestData = req.body;
  // 함수 이름과 인수 추출
  const functionName = requestData.function;
  const functionArgs = requestData.Args;
  try {
    const result = await invokeChaincode(functionName, functionArgs);
    res.status(200).json(result.stdout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// submit_transfer_batch
router.get('/api/test/', function(req, res, next) {
  arg = "[{\\\"FromAddress\\\":\\\"user101\\\",\\\"Price\\\":100,\\\"ST_ID\\\":\\\"ST_1\\\",\\\"Size\\\":3,\\\"TransferId\\\":\\\"transfer1\\\",\\\"ToAddress\\\":\\\"user103\\\"},{\\\"FromAddress\\\":\\\"user102\\\",\\\"Price\\\":100,\\\"ST_ID\\\":\\\"ST_1\\\",\\\"Size\\\":1,\\\"TransferId\\\":\\\"transfer2\\\",\\\"ToAddress\\\":\\\"user103\\\"},{\\\"FromAddress\\\":\\\"user102\\\",\\\"Price\\\":100,\\\"ST_ID\\\":\\\"ST_1\\\",\\\"Size\\\":4,\\\"TransferId\\\":\\\"transfer3\\\",\\\"ToAddress\\\":\\\"user104\\\"}]";
  const response = invokeChaincode("ProcessTransferBatch", arg);
  res.status(200).json({ response });
});

module.exports = router;
