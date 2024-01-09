"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// query.js
router.get('/api/get', (req, res) => {
    res.status(200).json({
        message: 'hello get api nodejs-api',
    });
});
const ORG_CONFIG = {
// Define your organization configurations here
};
class QueryCommandString {
    constructor() {
        this.command = 'peer chaincode query';
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
    addArgs(args) {
        const argsCommand = ` -c'{"Args":[${args}]}'`;
        this.command += argsCommand;
        return this;
    }
}
