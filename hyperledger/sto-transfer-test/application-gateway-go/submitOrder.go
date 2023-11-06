const (
	mspID        = "Org1MSP"
	cryptoPath   = "/home/admin/st-poc-hyperledger/hyperledger/sto-test-network/organizations/ordererOrganizations/example.com"
	certPath     = cryptoPath + "/msp/signcerts/cert.pem"
	keyPath      = cryptoPath + "/msp/keystore/"
	tlsCertPath  = cryptoPath + "/tls/ca.crt"
	peerEndpoint = "localhost:7051"
	gatewayPeer  = "orderer.example.com"
)