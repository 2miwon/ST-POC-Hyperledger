import express from 'express';
import { ORG_CONFIG } from './config';
import { asyncexecute } from './shell';

async function invokeChaincode(functionName: string, args: any[]) {
    const invokeCommandString = new InvokeCommandString();
    invokeCommandString.addOrderer();
    invokeCommandString.addChannel('mainchannel');
    invokeCommandString.addOrg('orgConfig1');
    invokeCommandString.addOrg('orgConfig2');
    let result: any;
    let jsonString: string;
    let escapedJsonString: string;

    switch (functionName) {
        case 'ProcessTransferBatch':
            jsonString = JSON.stringify(args);
            escapedJsonString = jsonString.replace(/"/g, '\\"');
            invokeCommandString.addFunction('ProcessTransferBatch', escapedJsonString);
            result = await asyncexecute(invokeCommandString.command);
            break;
        case 'CreateAccount':
            jsonString = JSON.stringify(args[0]);
            escapedJsonString = jsonString.replace(/"/g, '');
            console.log(escapedJsonString);
            invokeCommandString.addFunction('CreateAccount', escapedJsonString);
            result = await asyncexecute(invokeCommandString.command);
            // Handle CreateAccount case here
            break;
        case 'DeleteAccount':
            jsonString = JSON.stringify(args[0]);
            escapedJsonString = jsonString.replace(/"/g, '');
            console.log(escapedJsonString);
            invokeCommandString.addFunction('DeleteAccount', escapedJsonString);
            result = await asyncexecute(invokeCommandString.command);
            // Handle CreateAccount case here
            break;
        case 'AddFiat':
            // Assuming args is an array with address and amount for AddFiat
            const addFiatArgs = args.join('","');
            invokeCommandString.addFunction('AddFiat', addFiatArgs);
            result = await asyncexecute(invokeCommandString.command);
            break;
        case 'Mint':
            // Assuming args is an array with address, stID, and amount for MintSt
            const mintArgs = args.join('","');
            invokeCommandString.addFunction('Mint', mintArgs);
            result = await asyncexecute(invokeCommandString.command);
            break;
        default:
            throw new Error(`Function ${functionName} is not supported`);
    }

    return result;
}

class InvokeCommandString {
    command: string;

    constructor() {
        this.command = 'peer chaincode invoke';
    }

    addOrderer() {
        const ordererConfig = ORG_CONFIG.ordererConfig;
        const ordererCommand = ` -o ${ordererConfig.PeerEndpoint} --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${ordererConfig.CryptoPath}${ordererConfig.TLSCertPath}-cert.pem"`;
        this.command += ordererCommand;
        return this;
    }

    addChannel(channelName: string) {
        this.command += ` -C ${channelName} -n basic`;
        return this;
    }

    addOrg(org: 'orgConfig1' | 'orgConfig2' | 'ordererConfig') {
        const peerConfig = ORG_CONFIG[org];
        const peerCommand = ` --peerAddresses ${peerConfig.PeerEndpoint} --tlsRootCertFiles "${peerConfig.CryptoPath}${peerConfig.TLSCertPath}"`;
        this.command += peerCommand;
        return this;
    }

    addFunction(functionName: string, args: string) {
        const functionCommand = ` -c'{"function":"${functionName}","Args":["${args}"]}'`;
        console.log(functionCommand);
        this.command += functionCommand;
        return this;
    }
}

export { invokeChaincode };
