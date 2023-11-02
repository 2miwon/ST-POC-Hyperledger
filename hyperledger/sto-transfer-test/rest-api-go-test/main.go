package main

import (
	"fmt"
	"rest-api-go/web"
	"os/exec"
	"os"

)

func main() {
	//Initialize setup for Org1
	cryptoPath1 := "/home/admin/st-poc-hyperledger/hyperledger/sto-test-network/organizations/peerOrganizations/org1.example.com"
	orgConfig1 := web.OrgSetup{
		OrgName:      "Org1",
		MSPID:        "Org1MSP",
		CertPath:     cryptoPath1 + "/users/User1@org1.example.com/msp/signcerts/cert.pem",
		KeyPath:      cryptoPath1 + "/users/User1@org1.example.com/msp/keystore/",
		TLSCertPath:  cryptoPath1 + "/peers/peer0.org1.example.com/tls/ca.crt",
		PeerEndpoint: "localhost:7051",
		GatewayPeer:  "peer0.org1.example.com",
	}

		// Initialize setup for Org2
	cryptoPath2 := "/home/admin/st-poc-hyperledger/hyperledger/sto-test-network/organizations/peerOrganizations/org2.example.com"
	orgConfig2 := web.OrgSetup{
			OrgName:      "Org2",
			MSPID:        "Org2MSP",
			CertPath:     cryptoPath2 + "/users/User1@org2.example.com/msp/signcerts/cert.pem",
			KeyPath:      cryptoPath2 + "/users/User1@org2.example.com/msp/keystore/",
			TLSCertPath:  cryptoPath2 + "/peers/peer0.org2.example.com/tls/ca.crt",
			PeerEndpoint: "localhost:9051", // Org2 피어 설정에 따라 업데이트
			GatewayPeer:  "peer0.org2.example.com",
		}
	// orgSetup1, err := web.Initialize(orgConfig1)
	// if err != nil {
	// 	fmt.Println("Error initializing setup for Org1: ", err)
	// }
	// orgSetup2, err := web.Initialize(orgConfig2)
	// 	if err != nil {
	// 		fmt.Println("Error initializing setup for Org2: ", err)
	// 	}


	// Initialize setup for Orderer
	ordererTLSCACertPath := "/home/admin/st-poc-hyperledger/hyperledger/sto-test-network/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"
	ordererEndpoint := "localhost:7050" // Orderer 엔드포인트에 따라 업데이트

	// 실행할 때 필요한 모든 설정이 초기화되었으므로 peer chaincode invoke 명령어 실행
	// 이 부분은 원하는 chaincode invoke 명령어에 맞게 업데이트해야 합니다.
	chaincodeInvokeCmd := fmt.Sprintf("peer chaincode invoke -o %s --ordererTLSHostnameOverride orderer.example.com --tls --cafile %s -C mychannel -n basic --peerAddresses %s --tlsRootCertFiles %s --peerAddresses %s --tlsRootCertFiles %s -c '{\"function\":\"ProcessTransferBatch\", \"Args\":[\"[{\"FromAddress\":\"user101\",\"Price\":100,\"ST_ID\":\"ST_1\",\"Size\":3,\"TransferId\":\"transfer1\",\"ToAddress\":\"user103\"},{\"FromAddress\":\"user102\",\"Price\":100,\"ST_ID\":\"ST_1\",\"Size\":1,\"TransferId\":\"transfer2\",\"ToAddress\":\"user103\"},{\"FromAddress\":\"user102\",\"Price\":100,\"ST_ID\":\"ST_1\",\"Size\":4,\"TransferId\":\"transfer3\",\"ToAddress\":\"user104\"}]\"]}'", 
	ordererEndpoint, ordererTLSCACertPath, orgConfig1.PeerEndpoint, orgConfig1.TLSCertPath, orgConfig2.PeerEndpoint, orgConfig2.TLSCertPath)

	cmd := exec.Command("bash", "-c", chaincodeInvokeCmd)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	err := cmd.Run()
	if err != nil {
	    fmt.Println("Error invoking chaincode: ", err)
	}


}