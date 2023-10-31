# sudo apt-get install git curl docker-compose -y
# sudo apt-get install golang -y
# sudo apt-get install jq -y
# sudo curl -sSL https://bit.ly/2ysbOFE | bash -s
# sudo systemctl start docker
# sudo systemctl enable docker
# sudo usermod -aG docker $USER
# cd ${PWD}/fabric-samples/test-network
./network.sh down
./network.sh up createChannel -s couchdb
./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-go -ccl go

# CLI에 직접
export FABRIC_CFG_PATH=$PWD/../config/
export PATH=${PWD}/../bin:$PATH
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

# Org1 설정
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051



export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.exampl./network.sh deployCC -ccn ledger -ccp ../asset-transfer-ledger-queries/chaincode-go/ -ccl go -ccep "OR('Org1MSP.peer','Org2MSP.peer')"e.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051