package main

import (
    "encoding/json"
    "fmt"
    "os"
    "os/exec"
)

type Config struct {
	OrgConfig1   OrgConfig `json:"orgConfig1"`
	OrgConfig2   OrgConfig `json:"orgConfig2"`
	OrdererConfig OrdererConfig `json:"ordererConfig"`
}

type OrgConfig struct {
    CryptoPath   string `json:"cryptoPath"`
	PeerEndpoint string `json:"PeerEndpoint"`
	TLSCertPath  string `json:"TLSCertPath"`
}

type OrdererConfig struct {
    CryptoPath   string `json:"cryptoPath"`
	PeerEndpoint   string `json:"PeerEndpoint"`
	TLSCACertPath  string `json:"TLSCACertPath"`
}

func main() {
    // 설정 및 경로 초기화
    data, err := ioutil.ReadFile("config.json")
	if err != nil {
		fmt.Println("파일 읽기 오류:", err)
		return
	}

    var config Config
	if err := json.Unmarshal(data, &config); err != nil {
		fmt.Println("JSON 언마샬링 오류:", err)
		return
	}

    // Chaincode 호출 명령어 생성
	chaincodeInvokeCmd := fmt.Sprintf(
		`peer chaincode invoke -o %s --ordererTLSHostnameOverride orderer.example.com --tls --cafile %s -C mychannel -n basic --peerAddresses %s --tlsRootCertFiles %s --peerAddresses %s --tlsRootCertFiles %s -c '{"function":"ProcessTransferBatch","Args":["%s"]}'`,
		config.OrdererConfig, ordererTLSCACertPath, OrgConfig1.PeerEndpoint, OrgConfig1.TLSCertPath, OrgConfig2.PeerEndpoint, OrgConfig2.TLSCertPath, `[{\"FromAddress\":\"user101\",\"Price\":100,\"ST_ID\":\"ST_1\",\"Size\":3,\"TransferId\":\"transfer1\",\"ToAddress\":\"user103\"},{\"FromAddress\":\"user102\",\"Price\":100,\"ST_ID\":\"ST_1\",\"Size\":1,\"TransferId\":\"transfer2\",\"ToAddress\":\"user103\"},{\"FromAddress\":\"user102\",\"Price\":100,\"ST_ID\":\"ST_1\",\"Size\":4,\"TransferId\":\"transfer3\",\"ToAddress\":\"user104\"}]`)

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
