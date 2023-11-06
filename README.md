[//]: # (SPDX-License-Identifier: CC-BY-4.0)

# ST-POC Hyperledger Fabric Next.js Application

[![Build Status](https://dev.azure.com/Hyperledger/Fabric-Samples/_apis/build/status/Fabric-Samples?branchName=main)](https://dev.azure.com/Hyperledger/Fabric-Samples/_build/latest?definitionId=28&branchName=main)

- [Fabric documentation](https://hyperledger-fabric.readthedocs.io/en/latest).
- [Fabric prerequisites](https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html)
- [Install the Fabric Samples, Binaries, and Docker Images](https://hyperledger-fabric.readthedocs.io/en/latest/install.html) 

## ./network.sh -h

Command:
      up - Bring up Fabric orderer and peer nodes. No channel is created
      	# 오더러와 피어 노드를 네트워크에 올림
      up createChannel - Bring up fabric network with one channel
      	# 채널을 네트워크에 올림
      createChannel - Create and join a channel after the network is created
      	# 네트워크가 생성된 후 채널을 생성하고 참여 시킴
      deployCC - Deploy a chaincode to a channel (defaults to asset-transfer-basic)
      	# 채널에 체인코드를 구현
      down - Bring down the network
      	# 네트워크를 닫음
Flags:
    Used with network.sh up, network.sh createChannel:
    -ca <use CAs> -  Use Certificate Authorities to generate network crypto material
    	# 인증 기관을 통해 네트워크 암호화 생성
    -c <channel name> - Name of channel to create (defaults to "mychannel")
    	# 만들 채널 이름 지정
    -s <dbtype> - Peer state database to deploy: goleveldb (default) or couchdb
    	# 배포할 피어 상태의 데이터 베이스 
    -r <max retry> - CLI times out after certain number of attempts (defaults to 5)
    	# 특정 횟수의 시도 후 CLI 시간 초과
    -d <delay> - CLI delays for a certain number of seconds (defaults to 3)
    	# 특정 시간 동안 CLI 지연
    -i <imagetag> - Docker image tag of Fabric to deploy (defaults to "latest")
    	# 배포할 Fabric의 Docker 이미지 태그
    -cai <ca_imagetag> - Docker image tag of Fabric CA to deploy (defaults to "latest")
    	# 배포할 Fabric CA 의 Docker 이미지 태그
    -verbose - Verbose mode
    	# 상세 모드

## Test network

The [Fabric test network](test-network) in the samples repository provides a Docker Compose based test network with two
Organization peers and an ordering service node. You can use it on your local machine to run the samples listed below.
You can also use it to deploy and test your own Fabric chaincodes and applications. To get started, see
the [test network tutorial](https://hyperledger-fabric.readthedocs.io/en/latest/test_network.html).

The [Kubernetes Test Network](test-network-k8s) sample builds upon the Compose network, constructing a Fabric
network with peer, orderer, and CA infrastructure nodes running on Kubernetes.  In addition to providing a sample
Kubernetes guide, the Kube test network can be used as a platform to author and debug _cloud ready_ Fabric Client
applications on a development or CI workstation.


## Asset transfer samples and tutorials

The asset transfer series provides a series of sample smart contracts and applications to demonstrate how to store and transfer assets using Hyperledger Fabric.
Each sample and associated tutorial in the series demonstrates a different core capability in Hyperledger Fabric. The **Basic** sample provides an introduction on how
to write smart contracts and how to interact with a Fabric network using the Fabric SDKs. The **Ledger queries**, **Private data**, and **State-based endorsement**
samples demonstrate these additional capabilities. Finally, the **Secured agreement** sample demonstrates how to bring all the capabilities together to securely
transfer an asset in a more realistic transfer scenario.

|  **Smart Contract** | **Description** | **Tutorial** | **Smart contract languages** | **Application languages** |
| -----------|------------------------------|----------|---------|---------|
| [Basic](asset-transfer-basic) | The Basic sample smart contract that allows you to create and transfer an asset by putting data on the ledger and retrieving it. This sample is recommended for new Fabric users. | [Writing your first application](https://hyperledger-fabric.readthedocs.io/en/latest/write_first_app.html) | Go, JavaScript, TypeScript, Java | Go, JavaScript, TypeScript, Java |
| [Ledger queries](asset-transfer-ledger-queries) | The ledger queries sample demonstrates range queries and transaction updates using range queries (applicable for both LevelDB and CouchDB state databases), and how to deploy an index with your chaincode to support JSON queries (applicable for CouchDB state database only). | [Using CouchDB](https://hyperledger-fabric.readthedocs.io/en/latest/couchdb_tutorial.html) | Go, JavaScript | Java, JavaScript |
| [Private data](asset-transfer-private-data) | This sample demonstrates the use of private data collections, how to manage private data collections with the chaincode lifecycle, and how the private data hash can be used to verify private data on the ledger. It also demonstrates how to control asset updates and transfers using client-based ownership and access control. | [Using Private Data](https://hyperledger-fabric.readthedocs.io/en/latest/private_data_tutorial.html) | Go, Java | JavaScript |
| [State-Based Endorsement](asset-transfer-sbe) | This sample demonstrates how to override the chaincode-level endorsement policy to set endorsement policies at the key-level (data/asset level). | [Using State-based endorsement](https://github.com/hyperledger/fabric-samples/tree/main/asset-transfer-sbe) | Java, TypeScript | JavaScript |
| [Secured agreement](asset-transfer-secured-agreement) | Smart contract that uses implicit private data collections, state-based endorsement, and organization-based ownership and access control to keep data private and securely transfer an asset with the consent of both the current owner and buyer. | [Secured asset transfer](https://hyperledger-fabric.readthedocs.io/en/latest/secured_asset_transfer/secured_private_asset_transfer_tutorial.html)  | Go | JavaScript |
| [Events](asset-transfer-events) | The events sample demonstrates how smart contracts can emit events that are read by the applications interacting with the network. | [README](asset-transfer-events/README.md)  | JavaScript, Java | JavaScript |
| [Attribute-based access control](asset-transfer-abac) | Demonstrates the use of attribute and identity based access control using a simple asset transfer scenario | [README](asset-transfer-abac/README.md)  | Go | None |

## Network

1. 네트워크 초기화
./network.sh down
2. 네트워크 가동, 채널 생성
./network.sh up createChannel
3. 피어에 체인코드 deploy
./network.sh deployCC -ccn basic -ccp ../sto-transfer-test/chaincode-go -ccl go
*터미널 split 후
./monitordocker.sh fabric_test
4. 환경변수 설정
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
4. Ledger 초기화
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"InitLedger","Args":[]}'
5. 새 계정 생성
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"CreateAccount","Args":["user101", "1000000", "100"]}'
6. Query
(1)
peer chaincode query -C mychannel -n basic -c '{"Args":["GetAllAccounts"]}'
(2)
peer chaincode query -C mychannel -n basic -c '{"Args":["ReadAccount", "User1"]}'
(3)
peer chaincode query -C mychannel -n basic -c '{"Args":["GetAllTransfers"]}'
7.submitTransferBatch
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c'{"function":"ProcessTransferBatch","Args":["[{\"FromAddress\":\"user101\",\"Price\":100,\"ST_ID\":\"ST_1\",\"Size\":3,\"TransferId\":\"transfer1\",\"ToAddress\":\"user103\"},{\"FromAddress\":\"user102\",\"Price\":100,\"ST_ID\":\"ST_1\",\"Size\":1,\"TransferId\":\"transfer2\",\"ToAddress\":\"user103\"},{\"FromAddress\":\"user102\",\"Price\":100,\"ST_ID\":\"ST_1\",\"Size\":4,\"TransferId\":\"transfer3\",\"ToAddress\":\"user104\"}]"]}'

## Additional samples

Additional samples demonstrate various Fabric use cases and application patterns.

|  **Sample** | **Description** | **Documentation** |
| -------------|------------------------------|------------------|
| [Off chain data](off_chain_data) | Learn how to use block events to build an off-chain database for reporting and analytics. | [Peer channel-based event services](https://hyperledger-fabric.readthedocs.io/en/latest/peer_event_services.html) |
| [Token SDK](token-sdk) | Sample REST API around the Hyperledger Labs [Token SDK](https://github.com/hyperledger-labs/fabric-token-sdk) for privacy friendly (zero knowledge proof) UTXO transactions. | [README](token-sdk/README.md) |
| [Token ERC-20](token-erc-20) | Smart contract demonstrating how to create and transfer fungible tokens using an account-based model. | [README](token-erc-20/README.md) |
| [Token UTXO](token-utxo) | Smart contract demonstrating how to create and transfer fungible tokens using a UTXO (unspent transaction output) model. | [README](token-utxo/README.md) |
| [Token ERC-1155](token-erc-1155) | Smart contract demonstrating how to create and transfer multiple tokens (both fungible and non-fungible) using an account based model. | [README](token-erc-1155/README.md) |
| [Token ERC-721](token-erc-721) | Smart contract demonstrating how to create and transfer non-fungible tokens using an account-based model. | [README](token-erc-721/README.md) |
| [High throughput](high-throughput) | Learn how you can design your smart contract to avoid transaction collisions in high volume environments. | [README](high-throughput/README.md) |
| [Simple Auction](auction-simple) | Run an auction where bids are kept private until the auction is closed, after which users can reveal their bid. | [README](auction-simple/README.md) |
| [Dutch Auction](auction-dutch) | Run an auction in which multiple items of the same type can be sold to more than one buyer. This example also includes the ability to add an auditor organization. | [README](auction-dutch/README.md) |


## License <a name="license"></a>

Hyperledger Project source code files are made available under the Apache
License, Version 2.0 (Apache-2.0), located in the [LICENSE](LICENSE) file.
Hyperledger Project documentation files are made available under the Creative
Commons Attribution 4.0 International License (CC-BY-4.0), available at http://creativecommons.org/licenses/by/4.0/.
