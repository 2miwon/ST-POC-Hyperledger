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

router.get('/api/accounts', async function(req, res, next) {
  try {
    const result = await asyncexecute(`peer chaincode query -C ${req.params.channel} -n basic -c '{"Args":["GetAllAccounts"]}'`);
    res.status(200).json(result.stdout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/api/accounts/:address', async function(req, res, next) {
  try {
    const result = await asyncexecute(`peer chaincode query -C ${req.params.channel} -n basic -c '{"Args":["ReadAccount", "${req.params.address}"]}'`);
    res.status(200).json(result.stdout);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// router.get('/api/:channel/transfer', function(req, res, next) {
//   const response = execute(`peer chaincode query -C ${req.params.channel} -n basic -c  '{"Args":["GetAllTransfers"]}'`);
//   res.status(200).json({ response });
// });

router.post('/api/accounts/addfiat', async function(req, res, next) {
  const requestData = req.body;
  const functionArgs = requestData.Args; // Ensure this contains the address and the amount
  try {
    const functionName = "AddFiat";
    console.log(`functionArgs: ${functionArgs}`);
    const result = await invokeChaincode(functionName, functionArgs);
    res.status(200).json(result.stdout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for minting new security tokens
router.post('/api/accounts/mint', async function(req, res, next) {
  const requestData = req.body;
  const functionArgs = requestData.Args; // Ensure this contains the address, stID, and amount
  try {
    const functionName = "MintSt";
    console.log(`functionArgs: ${functionArgs}`);
    const result = await invokeChaincode(functionName, functionArgs);
    res.status(200).json(result.stdout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/api/accounts', async function(req, res, next) {
  const requestData = req.body;
  // 함수 이름과 인수 추출
  const functionArgs = requestData.Args;
  try {
    const functionName = "CreateAccount";
    console.log(`functionArgs: ${functionArgs}`);
    const result = await invokeChaincode(functionName, functionArgs);
    res.status(200).json(result.stdout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/api/transfer', async function(req, res, next) {
  const requestData = req.body;
  // 함수 이름과 인수 추출
  const functionArgs = requestData.Args;
  try {
    const functionName = "ProcessTransferBatch";
    console.log(`functionArgs: ${functionArgs}`);
    const result = await invokeChaincode(functionName, functionArgs);
    res.status(200).json(result.stdout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
