package main

import (
    "fmt"
    "os"
    "os/exec"
)

func main() {
    // 설정 및 경로 초기화
    cryptoPath1 := "/home/admin/st-poc-hyperledger/hyperledger/sto-test-network/organizations/peerOrganizations/org1.example.com"
    orgConfig1 := struct {
        PeerEndpoint string
        TLSCertPath  string
    }{
        PeerEndpoint: "localhost:7051",
        TLSCertPath:  cryptoPath1 + "/peers/peer0.org1.example.com/tls/ca.crt",
    }

    cryptoPath2 := "/home/admin/st-poc-hyperledger/hyperledger/sto-test-network/organizations/peerOrganizations/org2.example.com"
    orgConfig2 := struct {
        PeerEndpoint string
        TLSCertPath  string
    }{
        PeerEndpoint: "localhost:9051", // Org2 피어 설정에 따라 업데이트
        TLSCertPath:  cryptoPath2 + "/peers/peer0.org2.example.com/tls/ca.crt",
    }

    ordererTLSCACertPath := "/home/admin/st-poc-hyperledger/hyperledger/sto-test-network/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"
    ordererEndpoint := "localhost:7050" // Orderer 엔드포인트에 따라 업데이트

    // Chaincode 호출 명령어 생성
	chaincodeInvokeCmd := fmt.Sprintf(
		`peer chaincode invoke -o %s --ordererTLSHostnameOverride orderer.example.com --tls --cafile %s -C mychannel -n basic --peerAddresses %s --tlsRootCertFiles %s --peerAddresses %s --tlsRootCertFiles %s -c '{"function":"ProcessTransferBatch","Args":["%s"]}'`,
		ordererEndpoint, ordererTLSCACertPath, orgConfig1.PeerEndpoint, orgConfig1.TLSCertPath, orgConfig2.PeerEndpoint, orgConfig2.TLSCertPath, `[{\"FromAddress\":\"user101\",\"Price\":100,\"ST_ID\":\"ST_1\",\"Size\":3,\"TransferId\":\"transfer1\",\"ToAddress\":\"user103\"},{\"FromAddress\":\"user102\",\"Price\":100,\"ST_ID\":\"ST_1\",\"Size\":1,\"TransferId\":\"transfer2\",\"ToAddress\":\"user103\"},{\"FromAddress\":\"user102\",\"Price\":100,\"ST_ID\":\"ST_1\",\"Size\":4,\"TransferId\":\"transfer3\",\"ToAddress\":\"user104\"}]`)

    // 명령어 실행
    cmd := exec.Command("bash", "-c", chaincodeInvokeCmd)
    cmd.Stdout = os.Stdout
    cmd.Stderr = os.Stderr
    err := cmd.Run()

    // 오류 처리
    if err != nil {
        fmt.Println("Error invoking chaincode:", err)
    }
}
