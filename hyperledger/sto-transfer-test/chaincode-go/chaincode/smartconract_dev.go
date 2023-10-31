package chaincode

import (
	"encoding/json"
	"fmt"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing Accounts and Transactions
type SmartContract struct {
	contractapi.Contract
}

// Insert struct field in alphabetic order => to achieve determinism across languages
// golang keeps the order when marshal to json but doesn't order automatically
type Account struct {
	Address        string     `json:"Address"`
	FiatBalance    float64 `json:FiatBalance`
	StBalance      float64 `json:"StBalance"`
}

type Transaction struct {
	FromAddress         string  `json:"FromAddress"`
	Price               float64 `json:"Price"`
	Size                float64 `json:"Size"`
	TransactionId       int     `json:"TransactionId"`
	ToAddress           string  `json:"ToAddress"`
}

// InitLedger adds a base set of accounts to the ledger
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	accounts := []Account{
		{Address: "Admin", FiatBalance: 100000000, StBalance:10000},
		{Address: "User1", FiatBalance: 1000000, StBalance:20}
	}

	for _, account := range accounts {
		accounts, err := json.Marshal(account)
		if err != nil {
			return err
		}

		err = ctx.GetStub().PutState(account.Address, account)
		if err != nil {
			return fmt.Errorf("failed to put to world state. %v", err)
		}
	}

	return nil
}

func (s *SmartContract) CreateTransaction(ctx contractapi.TransactionContextInterface, 
	transactionId int, fromAddress string, toAddress string, size float64, price float64) error {
	exists, err := s.TransactionExists(ctx, transactionId)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the transactionId for transaction %s already exists", transactionId)
	}

	transaction :=  Transaction {
		FromAddress:   fromAddress
		Price:         price    
		Size:          size
		TransactionId: transactionId
		ToAddress:     toAddress
	}

	transactionJSON, err := json.Marshal(account)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(transaction, transactionJSON)
}



// CreateAccount issues a new account to the world state with given details.
func (s *SmartContract) CreateAccount(ctx contractapi.TransactionContextInterface, address string, fiatBalance float64, stBalance float64) error {
	exists, err := s.AccountExists(ctx, address)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the address for account %s already exists", address)
	}

	account := Account{
		Address:        address,
		FiatBalance:    fiatBalance,
		stBalance:      stBalance,
	}

	accountJSON, err := json.Marshal(account)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(address, accountJSON)
}

// ReadAccount returns the account stored in the world state with given address.
func (s *SmartContract) ReadAccount(ctx contractapi.TransactionContextInterface, address string) (*Account, error) {
	accountJSON, err := ctx.GetStub().GetState(address)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if accountJSON == nil {
		return nil, fmt.Errorf("the account %s does not exist", address)
	}

	var account Account
	err = json.Unmarshal(accountJSON, &account)
	if err != nil {
		return nil, err
	}

	return &account, nil
}

// UpdateAccount updates an existing account in the world state with provaddressed parameters.
func (s *SmartContract) UpdateAccount(ctx contractapi.TransactionContextInterface, address string, fiatBalance float64, stBalance float64) error {
	exists, err := s.AccountExists(ctx, address)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("the account %s does not exist", address)
	}

	// overwriting original account with new account
	account := Account{
		Address:        address,
		FiatBalance:    fiatBalance,
		stBalance:      stBalance,
	}

	accountJSON, err := json.Marshal(account)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(address, accountJSON)
}

// DeleteAccount deletes an given account from the world state.
func (s *SmartContract) DeleteAccount(ctx contractapi.TransactionContextInterface, address string) error {
	exists, err := s.AccountExists(ctx, address)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("the account %s does not exist", address)
	}

	return ctx.GetStub().DelState(address)
}


// GetAllAccounts returns all accounts found in world state
func (s *SmartContract) GetAllAccounts(ctx contractapi.TransactionContextInterface) ([]*Accounts, error) {
	// range query with empty string for startKey and endKey does an
	// open-ended query of all accounts in the chaincode namespace.
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var accounts []*Account
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var account Account
		err = json.Unmarshal(queryResponse.Value, &account)
		if err != nil {
			return nil, err
		}
		accounts = append(accounts, &account)
	}

	return accounts, nil
}

// AccountExists returns true when account with given address exists in world state
func (s *SmartContract) AccountExists(ctx contractapi.TransactionContextInterface, address string) (bool, error) {
	accountJSON, err := ctx.GetStub().GetState(address)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return accountJSON != nil, nil
}

// TransactionExists returns true when account with given address exists in world state
func (s *SmartContract) TransactionExists(ctx contractapi.TransactionContextInterface, transactionId string) (bool, error) {
	accountJSON, err := ctx.GetStub().GetState(transactionId)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return accountJSON != nil, nil
}