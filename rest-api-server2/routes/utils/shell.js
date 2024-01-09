"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvString = exports.asyncexecute = void 0;
const config_1 = require("./config");
const util_1 = __importDefault(require("util"));
const asyncexec = util_1.default.promisify(require('child_process').exec);
function getEnvString(org, peer, port) {
    return `
          export FABRIC_CFG_PATH=/home/admin/st-poc-hyperledger/hyperledger/config/
          export PATH=/home/admin/st-poc-hyperledger/hyperledger/bin:$PATH
          export ORDERER_CA=/home/admin/st-poc-hyperledger/hyperledger/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
          export CORE_PEER_TLS_ENABLED=true ; 
          export CORE_PEER_LOCALMSPID="Org1MSP";
          export CORE_PEER_TLS_ROOTCERT_FILE=${config_1.NETWORK_DIR}/organizations/peerOrganizations/${org}.example.com/peers/${peer}.${org}.example.com/tls/ca.crt ;
          export CORE_PEER_MSPCONFIGPATH=${config_1.NETWORK_DIR}/organizations/peerOrganizations/${org}.example.com/users/Admin@${org}.example.com/msp ;
          export CORE_PEER_ADDRESS=localhost:${port};
  `;
}
exports.getEnvString = getEnvString;
async function asyncexecute(command) {
    try {
        const { stdout, stderr } = await asyncexec(getEnvString('org1', 'peer0', 7051) + command);
        return { stdout, stderr, success: true };
    }
    catch (error) {
        // error는 ExecException 형태로, stdout 및 stderr 포함 가능
        const execError = error;
        return {
            stdout: execError.stdout ?? '',
            stderr: execError.stderr ?? '',
            success: execError.code === 0,
        };
    }
}
exports.asyncexecute = asyncexecute;
