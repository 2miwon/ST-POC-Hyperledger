import express from 'express';

const router = express.Router();

// query.js
router.get('/api/get', (req, res) => {
    res.status(200).json({
        message: 'hello get api nodejs-api',
    });
});

interface OrgConfig {
    PeerEndpoint: string;
    CryptoPath: string;
    TLSCertPath: string;
}

const ORG_CONFIG: Record<string, OrgConfig> = {
    // Define your organization configurations here
};

class QueryCommandString {
    private command: string;

    constructor() {
        this.command = 'peer chaincode query';
    }

    addChannel(channelName: string): QueryCommandString {
        this.command += ` -C ${channelName} -n basic`;
        return this;
    }

    addOrg(org: string): QueryCommandString {
        const peerConfig = ORG_CONFIG[org];
        const peerCommand = ` --peerAddresses ${peerConfig.PeerEndpoint} --tlsRootCertFiles "${peerConfig.CryptoPath}${peerConfig.TLSCertPath}"`;
        this.command += peerCommand;
        return this;
    }

    addArgs(args: string[]): QueryCommandString {
        const argsCommand = ` -c'{"Args":[${args}]}'`;
        this.command += argsCommand;
        return this;
    }
}
