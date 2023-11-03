const express = require('express');
const {ORG_CONFIG} = require('./config');
const {asyncexecute} = require('./shell');

var router = express.Router();

// invoke.js
router.post('/api/post',function(req, res){
	const requestData = req.body;
	// 함수 이름과 인수 추출cd
	const functionName = requestData.function;
	const functionArgs = requestData.Args;
	const result = invokeChaincode(functionName, functionArgs);
	res.status(200).json({ result });    
});


// function invokeChaincode(functionName, args){
// 	const invokeCommandString = new InvokeCommandString();
// 	invokeCommandString.addOrderer();
// 	invokeCommandString.addChannel('channel1');
// 	invokeCommandString.addOrg('orgConfig1');
// 	invokeCommandString.addOrg('orgConfig2');
// 	switch (functionName) {
// 		case "ProcessTransferBatch":
// 			const jsonString = JSON.stringify(args);
// 			const escapedJsonString = jsonString.replace(/"/g, '\\"');
// 			invokeCommandString.addFunction("ProcessTransferBatch", escapedJsonString);
// 			break;
// 		case "CreateAccount":
// 			break;
// 	}
// 	return execute(invokeCommandString.command);
// 	// TODO
// }

async function invokeChaincode(functionName, args) {
	const invokeCommandString = new InvokeCommandString();
	invokeCommandString.addOrderer();
	invokeCommandString.addChannel('channel1');
	invokeCommandString.addOrg('orgConfig1');
	invokeCommandString.addOrg('orgConfig2');
	let result;
  
	switch (functionName) {
	  case "ProcessTransferBatch":
		const jsonString = JSON.stringify(args);
		const escapedJsonString = jsonString.replace(/"/g, '\\"');
		invokeCommandString.addFunction("ProcessTransferBatch", escapedJsonString);
		result = await execute(invokeCommandString.command);
		break;
	  case "CreateAccount":
		// Handle CreateAccount case here
		break;
	}
  
	return result;
  }

class InvokeCommandString {
	constructor() {
	  this.command = 'peer chaincode invoke';
	}
  
	addOrderer() {
	  const ordererConfig = ORG_CONFIG.ordererConfig;
	  const ordererCommand = ` -o ${ordererConfig.PeerEndpoint} --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${ordererConfig.CryptoPath}${ordererConfig.TLSCertPath}-cert.pem"`;
	  this.command += ordererCommand;
	  return this;
	}
  
	addChannel(channelName) {
	  this.command += ` -C ${channelName} -n basic`;
	  return this;
	}
  
	addOrg(org) {
	  const peerConfig = ORG_CONFIG[org];
	  const peerCommand = ` --peerAddresses ${peerConfig.PeerEndpoint} --tlsRootCertFiles "${peerConfig.CryptoPath}${peerConfig.TLSCertPath}"`;
	  this.command += peerCommand;
	  return this;
	}
  
	addFunction(functionName, args) {
	  const functionCommand = ` -c'{"function":"${functionName}","Args":["${args}"]}'`
	  this.command += functionCommand;
	  return this;
	}
  
  }

  module.exports = {invokeChaincode};