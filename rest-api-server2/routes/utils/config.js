"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORG_CONFIG = exports.NETWORK_DIR = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const NETWORK_DIR = process.env.NETWORK_DIR;
exports.NETWORK_DIR = NETWORK_DIR;
const ORG_CONFIG = {
    orgConfig1: {
        CryptoPath: `${NETWORK_DIR}/organizations/peerOrganizations/org1.example.com`,
        PeerEndpoint: 'localhost:7051',
        TLSCertPath: '/peers/peer0.org1.example.com/tls/ca.crt',
    },
    orgConfig2: {
        CryptoPath: `${NETWORK_DIR}/organizations/peerOrganizations/org2.example.com`,
        PeerEndpoint: 'localhost:9051',
        TLSCertPath: '/peers/peer0.org2.example.com/tls/ca.crt',
    },
    ordererConfig: {
        CryptoPath: `${NETWORK_DIR}/organizations/ordererOrganizations/example.com`,
        PeerEndpoint: 'localhost:7050',
        TLSCertPath: '/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com',
    },
};
exports.ORG_CONFIG = ORG_CONFIG;
