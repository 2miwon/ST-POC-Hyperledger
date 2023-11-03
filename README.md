[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)

[//]: # (SPDX-License-Identifier: CC-BY-4.0)

# ST-POC Hyperledger Fabric Next.js Application

- [Clientside Repository](https://github.com/YouJun-IWON/Youtube-STO).


## Program Spec

|  **Architecture** | **Description** | **Application languages / Stack** |
| -----------|------------------------------|---------|
| Hyperledger Network | Chaincode 및 Smart Contract와 각 Peer, Channel, Organization 이 구성되어 있는 Hyperledger Network | Go, JavaScript, goLevelDB, Python |
| MiddleWare (REST-api server) | 웹 프론트엔드 앱에서 보낸 REST 요청을 수집해 Hyperledger의 체인코드를 실행 시켜주는 역할 | Express.js (JavaScript) |
| MiddleWare (Service DB) | 웹 프론트엔드 앱에서 표현하거나 ledger에 최종 등록(변경불가)하기 전 임시로 orderbook 정보를 저장 | Express.js (JavaScript) |
| [Front-end WebApp](https://youtube-sto-bay.vercel.app/) | 사용자가 실제로 사용하게 되는 Web2 Application, Vercel로 임시 배포중 | Next.js, (TypeScript) |
| Google Cloud Platform | Backend Domain Architecture들이 실제로 동작하고 있는 클라우드 컴퓨팅 서비스 |  |

## Chain Code Description

#### 1. 네트워크 초기화
```
./network.sh down
```
#### 2. 네트워크 가동, 채널 생성
```
./network.sh up createChannel
```
#### 3. 피어에 체인코드 deploy
```
./network.sh deployCC -ccn basic -ccp ../sto-transfer-test/chaincode-go -ccl go
*터미널 split 후
./monitordocker.sh fabric_test
```
#### 4. 환경변수 설정
```
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
```
#### 5. Ledger 초기화
```
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"InitLedger","Args":[]}'
```
#### 6. 새 계정 생성
```
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"CreateAccount","Args":["user101", "1000000", "100"]}'
```
#### 7. Query
```
(1)peer chaincode query -C mychannel -n basic -c '{"Args":["GetAllAccounts"]}'
(2)peer chaincode query -C mychannel -n basic -c '{"Args":["ReadAccount", "User1"]}'
(3)peer chaincode query -C mychannel -n basic -c '{"Args":["GetAllTransfers"]}'
```
#### 8.submitTransferBatch
```
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c'{"function":"ProcessTransferBatch","Args":["[{\"FromAddress\":\"user101\",\"Price\":100,\"ST_ID\":\"ST_1\",\"Size\":3,\"TransferId\":\"transfer1\",\"ToAddress\":\"user103\"},{\"FromAddress\":\"user102\",\"Price\":100,\"ST_ID\":\"ST_1\",\"Size\":1,\"TransferId\":\"transfer2\",\"ToAddress\":\"user103\"},{\"FromAddress\":\"user102\",\"Price\":100,\"ST_ID\":\"ST_1\",\"Size\":4,\"TransferId\":\"transfer3\",\"ToAddress\":\"user104\"}]"]}' (편집됨) 
```

## REST API Reference

#### 모든 계정 정보 반환

```http
  GET "${base_endpoint}/api/:channel" 
```

| Parameter | Type | Description                |
| :-------- | :------- | :------------------------- |
| `channel` | `string`   |  기본값으로 "channel1" 전달해주세요|
| `user`    | `string`   |  기본값 "user1"|
 
```json
{   
    "admin": {"Address":"admin","Fiat":100000000,"ST_1":10000},
    "user1": {"Address":"user1","Fiat":1000000,"ST_1":20},
    "user101":{"Address":"user101","Fiat":1001500,"ST_1":85},
    "user102":{"Address":"user102","Fiat":1002500,"ST_1":75},
    "user103":{"Address":"user103","Fiat":998000,"ST_1":120},
    "user104":{"Address":"user104","Fiat":998000,"ST_1":120}
}
```


#### 한 계정 정보 반환

```http
  GET "${base_endpoint}/api/:channel:user" 
```

| Parameter | Type | Description                |
| :-------- | :------- | :------------------------- |
| `channel` | `string`   |  기본값으로 "channel1" 전달해주세요|
| `user`    | `string`   |  기본값 "user1"|
 
```json
{
    "user1":{"Address":"user1","Fiat":1000000,"ST_1":20},
}
```
#### 주문 넣기 (batch로 전달) 

```http
  POST  "${base_endpoint}/api/transfer"
```

| Parameter | Type | 
| :-------- | :------- | 
| `header` | `json`   |  
| `body`    | `json`   |  
 
```json
{
  "function":"ProcessTransferBatch",
  "Args":[
    {
      "FromAddress":"user101",
      "Price":100,
      "ST_ID":"ST_1",
      "Size":3,
      "TransferId":"transfer1",
      "ToAddress":"user103"
    },
    {
      "FromAddress": "user102",
      "Price":100,
      "ST_ID":"ST_1",
      "Size":1,
      "TransferId":"transfer2",
      "ToAddress":"user103"
    },
    {
      "FromAddress":"user102",
      "Price":100,
      "ST_ID":"ST_1",
      "Size":4,
      "TransferId":"transfer3",
      "ToAddress":"user104"
    }
  ]
}
```


