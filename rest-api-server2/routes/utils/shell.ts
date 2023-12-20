import { exec, ExecException } from 'child_process';
import { NETWORK_DIR } from './config';
import { stdout } from 'process';
import util from 'util';

const asyncexec = util.promisify(require('child_process').exec);

function getEnvString(org: string, peer: string, port: number): string {
    return `
          export FABRIC_CFG_PATH=/home/admin/st-poc-hyperledger/hyperledger/config/
          export PATH=/home/admin/st-poc-hyperledger/hyperledger/bin:$PATH
          export ORDERER_CA=/home/admin/st-poc-hyperledger/hyperledger/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
          export CORE_PEER_TLS_ENABLED=true ; 
          export CORE_PEER_LOCALMSPID="Org1MSP";
          export CORE_PEER_TLS_ROOTCERT_FILE=${NETWORK_DIR}/organizations/peerOrganizations/${org}.example.com/peers/${peer}.${org}.example.com/tls/ca.crt ;
          export CORE_PEER_MSPCONFIGPATH=${NETWORK_DIR}/organizations/peerOrganizations/${org}.example.com/users/Admin@${org}.example.com/msp ;
          export CORE_PEER_ADDRESS=localhost:${port};
  `;
}

async function asyncexecute(command: string): Promise<{ stdout: string; stderr: string }> {
    try {
        const { stdout, stderr } = await asyncexec(getEnvString('org1', 'peer0', 7051) + command);
        return { stdout, stderr };
    } catch (error) {
        throw error;
    }
}

export { asyncexecute, getEnvString };
