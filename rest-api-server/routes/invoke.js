const express = require('express');
const {ORG_CONFIG} = require('./config');
const {asyncexecute} = require('./shell');

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
		const escapedJsonString = jsonString.replace(/"/g, '\\\"');
		invokeCommandString.addFunction("ProcessTransferBatch", escapedJsonString);
		result = await asyncexecute(invokeCommandString.command);
		break;
	  case "CreateAccount":
		const account = JSON.stringify(account)(args[0]);
		invokeCommandString.addFunction("CreateAccount", account);
		result = await asyncexecute(invokeCommandString.command);
		// Handle CreateAccount case here
		break;
	case "AddFiat":
		// Assuming args is an array with address and amount for AddFiat
		const addFiatArgs = args.map(arg => JSON.stringify(arg)).join('","');
		invokeCommandString.addFunction("AddFiat", addFiatArgs);
		result = await asyncexecute(invokeCommandString.command);
		break;
	case "Mint":
		// Assuming args is an array with address, stID, and amount for MintSt
		const mintArgs = args.map(arg => JSON.stringify(arg)).join('","');
		invokeCommandString.addFunction("MintSt", mintArgs);
		result = await asyncexecute(invokeCommandString.command);
		break;
	default:
		throw new Error(`Function ${functionName} is not supported`);

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