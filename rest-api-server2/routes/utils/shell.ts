import { ChildProcess, exec, ExecException as ChildProcessExecException } from 'child_process';
import { NETWORK_DIR } from './config';
import { stdout } from 'process';
import util from 'util';

const asyncexec = util.promisify(require('child_process').exec);

interface ExecException extends ChildProcessExecException {
    ode?: number; // 프로세스의 종료 코드
    killed?: boolean; // 프로세스가 신호에 의해 종료되었는지 여부
    signal?: NodeJS.Signals; // 프로세스를 종료시킨 신호
    cmd?: string; // 실행된 명령어
    stdout?: string; // 표준 출력
    stderr?: string; // 표준 에러
}

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

async function asyncexecute(command: string): Promise<{ stdout: string; stderr: string; success: boolean }> {
    try {
        const { stdout, stderr } = await asyncexec(getEnvString('org1', 'peer0', 7051) + command);
        return { stdout, stderr, success: true };
    } catch (error) {
        // error는 ExecException 형태로, stdout 및 stderr 포함 가능
        const execError = error as ExecException;
        return {
            stdout: execError.stdout ?? '',
            stderr: execError.stderr ?? '',
            success: execError.code === 0,
        };
    }
}

export { asyncexecute, getEnvString };
