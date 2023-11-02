/*
Copyright 2021 IBM All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/

package main

import (
	"bytes"
	"context"
	"crypto/x509"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path"
	"time"
	"strings"

	"github.com/hyperledger/fabric-gateway/pkg/client"
	"github.com/hyperledger/fabric-gateway/pkg/identity"
	"github.com/hyperledger/fabric-protos-go-apiv2/gateway"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/status"
)

const (
	mspID        = "Org1MSP"
	cryptoPath   = "/home/admin/st-poc-hyperledger/hyperledger/sto-test-network/organizations/peerOrganizations/org1.example.com"
	certPath     = cryptoPath + "/users/User1@org1.example.com/msp/signcerts/cert.pem"
	keyPath      = cryptoPath + "/users/User1@org1.example.com/msp/keystore/"
	tlsCertPath  = cryptoPath + "/peers/peer0.org1.example.com/tls/ca.crt"
	peerEndpoint = "localhost:7051"
	gatewayPeer  = "peer0.org1.example.com"
)

var now = time.Now()
var transactionId = fmt.Sprintf("asset%d", now.Unix()*1e3+int64(now.Nanosecond())/1e6)

type Transfer struct {
	FromAddress         string  `json:"FromAddress"`
	Price               float64 `json:"Price"`
	ST_ID               string  `json:"ST_ID"`
	Size                float64 `json:"Size"`
	TransferId          string  `json:"TransferId"`
	ToAddress           string  `json:"ToAddress"`
}


func main() {
	// The gRPC client connection should be shared by all Gateway connections to this endpoint
	clientConnection := newGrpcConnection()
	defer clientConnection.Close()

	id := newIdentity()
	sign := newSign()

	// Create a Gateway connection for a specific client identity
	gw, err := client.Connect(
		id,
		client.WithSign(sign),
		client.WithClientConnection(clientConnection),
		// Default timeouts for different gRPC calls
		client.WithEvaluateTimeout(5*time.Second),
		client.WithEndorseTimeout(15*time.Second),
		client.WithSubmitTimeout(5*time.Second),
		client.WithCommitStatusTimeout(1*time.Minute),
	)
	if err != nil {
		panic(err)
	}
	defer gw.Close()

	// Override default values for chaincode and channel name as they may differ in testing contexts.
	chaincodeName := "basic"
	if ccname := os.Getenv("CHAINCODE_NAME"); ccname != "" {
		chaincodeName = ccname
	}

	channelName := "mychannel"
	if cname := os.Getenv("CHANNEL_NAME"); cname != "" {
		channelName = cname
	}

	network := gw.GetNetwork(channelName)
	contract := network.GetContract(chaincodeName)

	// initLedger(contract)
	// createAccounts(contract)
	getAllAccounts(contract)
	submitTransferBatch(contract)
	getAllAccounts(contract)
}


// newGrpcConnection creates a gRPC connection to the Gateway server.
func newGrpcConnection() *grpc.ClientConn {
	certificate, err := loadCertificate(tlsCertPath)
	if err != nil {
		panic(err)
	}

	certPool := x509.NewCertPool()
	certPool.AddCert(certificate)
	transportCredentials := credentials.NewClientTLSFromCert(certPool, gatewayPeer)

	connection, err := grpc.Dial(peerEndpoint, grpc.WithTransportCredentials(transportCredentials))
	if err != nil {
		panic(fmt.Errorf("failed to create gRPC connection: %w", err))
	}

	return connection
}

// newIdentity creates a client identity for this Gateway connection using an X.509 certificate.
func newIdentity() *identity.X509Identity {
	certificate, err := loadCertificate(certPath)
	if err != nil {
		panic(err)
	}

	id, err := identity.NewX509Identity(mspID, certificate)
	if err != nil {
		panic(err)
	}

	return id
}

func loadCertificate(filename string) (*x509.Certificate, error) {
	certificatePEM, err := os.ReadFile(filename)
	if err != nil {
		return nil, fmt.Errorf("failed to read certificate file: %w", err)
	}
	return identity.CertificateFromPEM(certificatePEM)
}

// newSign creates a function that generates a digital signature from a message digest using a private key.
func newSign() identity.Sign {
	files, err := os.ReadDir(keyPath)
	if err != nil {
		panic(fmt.Errorf("failed to read private key directory: %w", err))
	}
	privateKeyPEM, err := os.ReadFile(path.Join(keyPath, files[0].Name()))

	if err != nil {
		panic(fmt.Errorf("failed to read private key file: %w", err))
	}

	privateKey, err := identity.PrivateKeyFromPEM(privateKeyPEM)
	if err != nil {
		panic(err)
	}

	sign, err := identity.NewPrivateKeySign(privateKey)
	if err != nil {
		panic(err)
	}

	return sign
}

// This type of transaction would typically only be run once by an application the first time it was started after its
// initial deployment. A new version of the chaincode deployed later would likely not need to run an "init" function.
func initLedger(contract *client.Contract) {
	fmt.Printf("\n--> Submit Transaction: InitLedger, function creates the initial set of accounts on the ledger \n")

	_, err := contract.SubmitTransaction("InitLedger")
	if err != nil {
		panic(fmt.Errorf("failed to submit transaction: %w", err))
	}

	fmt.Printf("*** Transaction committed successfully\n")
}

func getAllAccounts(contract *client.Contract) {
	fmt.Println("\n--> Evaluate Transaction: GetAllAccounts, function returns all the current accounts on the ledger")

	evaluateResult, err := contract.EvaluateTransaction("GetAllAccounts")
	if err != nil {
		panic(fmt.Errorf("failed to evaluate transaction: %w", err))
	}
	result := formatJSON(evaluateResult)

	fmt.Printf("*** Result:%s\n", result)
}

// Submit a transaction synchronously, blocking until it has been committed to the ledger.
func createAccounts(contract *client.Contract) {
	fmt.Printf("\n--> Submit Transaction: CreateAccount, creates new account with Address, Fiat, ST_1 \n")

	_, err1 := contract.SubmitTransaction("CreateAccount", "user101", "1000000", "100")
	if err1 != nil {
		panic(fmt.Errorf("failed to submit transaction: %w", err1))
	}
	_, err2 := contract.SubmitTransaction("CreateAccount", "user102", "1000000", "100")
	if err2 != nil {
		panic(fmt.Errorf("failed to submit transaction: %w", err2))
	}
	_, err3 := contract.SubmitTransaction("CreateAccount", "user103", "1000000", "100")
	if err3 != nil {
		panic(fmt.Errorf("failed to submit transaction: %w", err3))
	}
	_, err4 := contract.SubmitTransaction("CreateAccount", "user104", "1000000", "100")
	if err4 != nil {
		panic(fmt.Errorf("failed to submit transaction: %w", err4))
	}

	fmt.Printf("*** Transaction committed successfully\n")
}

// Evaluate a transaction by assetID to query ledger state.
func readAccountByAddress(contract *client.Contract) {
	fmt.Printf("\n--> Evaluate Transaction: ReadAccount, function returns account attributes\n")

	evaluateResult, err := contract.EvaluateTransaction("ReadAccount", "user2")
	if err != nil {
		panic(fmt.Errorf("failed to evaluate transaction: %w", err))
	}
	result := formatJSON(evaluateResult)

	fmt.Printf("*** Result:%s\n", result)
}

func submitTransferBatch(contract *client.Contract) {
	fmt.Printf("\n--> Submit Transactions in Batch: Make transfer logs, updates account balance")

	transfer1 := Transfer{FromAddress: "user101", Price: 100, ST_ID: "ST_1", Size: 3, TransferId: "transfer1", ToAddress: "user103"}
	transfer2 := Transfer{FromAddress: "user102", Price: 100, ST_ID: "ST_1", Size: 1, TransferId: "transfer2", ToAddress: "user103"}
	transfer3 := Transfer{FromAddress: "user102", Price: 100, ST_ID: "ST_1", Size: 4, TransferId: "transfer3", ToAddress: "user104"}
	transferBatch := []Transfer{transfer1, transfer2, transfer3,}

    var transferJSONBatch []string
    for _, transfer := range transferBatch {
        transferJSON, err := json.Marshal(transfer)
        if err != nil {
            panic(fmt.Errorf("JSON 직렬화 오류:", err))
        }
        transferJSONBatch = append(transferJSONBatch, string(transferJSON))
    }
	transferBatchString := "[" + strings.Join(transferJSONBatch, ",") + "]"

	_, submissionErr := contract.SubmitTransaction("ProcessTransferBatch", transferBatchString)
	if submissionErr != nil {
		panic(fmt.Errorf("failed to submit transaction: %w", submissionErr))
	}
}




// Submit transaction asynchronously, blocking until the transaction has been sent to the orderer, and allowing
// this thread to process the chaincode response (e.g. update a UI) without waiting for the commit notification
// func transferAssetAsync(contract *client.Contract) {
// 	fmt.Printf("\n--> Async Submit Transaction: TransferAsset, updates existing asset owner")

// 	submitResult, commit, err := contract.SubmitAsync("TransferAsset", client.WithArguments(assetId, "Mark"))
// 	if err != nil {
// 		panic(fmt.Errorf("failed to submit transaction asynchronously: %w", err))
// 	}

// 	fmt.Printf("\n*** Successfully submitted transaction to transfer ownership from %s to Mark. \n", string(submitResult))
// 	fmt.Println("*** Waiting for transaction commit.")

// 	if commitStatus, err := commit.Status(); err != nil {
// 		panic(fmt.Errorf("failed to get commit status: %w", err))
// 	} else if !commitStatus.Successful {
// 		panic(fmt.Errorf("transaction %s failed to commit with status: %d", commitStatus.TransactionID, int32(commitStatus.Code)))
// 	}

// 	fmt.Printf("*** Transaction committed successfully\n")
// }

// Submit transaction, passing in the wrong number of arguments ,expected to throw an error containing details of any error responses from the smart contract.
func exampleErrorHandling(contract *client.Contract) {
	fmt.Println("\n--> Submit Transaction: UpdateAcoount user70, user70 does not exist and should return an error")

	_, err := contract.SubmitTransaction("UpdateAccountByParams", "user70", "1000", "10")
	if err == nil {
		panic("******** FAILED to return an error")
	}

	fmt.Println("*** Successfully caught the error:")

	switch err := err.(type) {
	case *client.EndorseError:
		fmt.Printf("Endorse error for transaction %s with gRPC status %v: %s\n", err.TransactionID, status.Code(err), err)
	case *client.SubmitError:
		fmt.Printf("Submit error for transaction %s with gRPC status %v: %s\n", err.TransactionID, status.Code(err), err)
	case *client.CommitStatusError:
		if errors.Is(err, context.DeadlineExceeded) {
			fmt.Printf("Timeout waiting for transaction %s commit status: %s", err.TransactionID, err)
		} else {
			fmt.Printf("Error obtaining commit status for transaction %s with gRPC status %v: %s\n", err.TransactionID, status.Code(err), err)
		}
	case *client.CommitError:
		fmt.Printf("Transaction %s failed to commit with status %d: %s\n", err.TransactionID, int32(err.Code), err)
	default:
		panic(fmt.Errorf("unexpected error type %T: %w", err, err))
	}

	// Any error that originates from a peer or orderer node external to the gateway will have its details
	// embedded within the gRPC status error. The following code shows how to extract that.
	statusErr := status.Convert(err)

	details := statusErr.Details()
	if len(details) > 0 {
		fmt.Println("Error Details:")

		for _, detail := range details {
			switch detail := detail.(type) {
			case *gateway.ErrorDetail:
				fmt.Printf("- address: %s, mspId: %s, message: %s\n", detail.Address, detail.MspId, detail.Message)
			}
		}
	}
}

// Format JSON data
func formatJSON(data []byte) string {
	var prettyJSON bytes.Buffer
	if err := json.Indent(&prettyJSON, data, "", "  "); err != nil {
		panic(fmt.Errorf("failed to parse JSON: %w", err))
	}
	return prettyJSON.String()
}


{FromAddress: "user101", Price: 100, ST_ID: "ST_1", Size: 3, TransferId: "transfer1", ToAddress: "user103"}
{FromAddress: "user102", Price: 100, ST_ID: "ST_1", Size: 1, TransferId: "transfer2", ToAddress: "user103"}
{FromAddress: "user102", Price: 100, ST_ID: "ST_1", Size: 4, TransferId: "transfer3", ToAddress: "user104"}