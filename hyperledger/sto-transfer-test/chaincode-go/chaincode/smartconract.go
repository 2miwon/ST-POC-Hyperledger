package chaincode

import (
	"reflect"
	"encoding/json"
	"fmt"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing Accounts and Transfers
type SmartContract struct {
	contractapi.Contract
}

// Insert struct field in alphabetic order => to achieve determinism across languages
// golang keeps the order when marshal to json but doesn't order automatically
type Account struct {
	Address        string     `json:"Address"`
	Fiat           float64    `json:Fiat`
	ST_1           float64    `json:"ST_1"`
}

type Transfer struct {
	FromAddress         string  `json:"FromAddress"`
	Price               float64 `json:"Price"`
	ST_ID               string  `json: ST_ID`
	Size                float64 `json:"Size"`
	TransferId          string  `json:"TransferId"`
	ToAddress           string  `json:"ToAddress"`
}

// InitLedger adds a base set of accounts to the ledger
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	accounts := []Account{
		{Address: "Admin", Fiat: 100000000, ST_1:10000},
		{Address: "User1", Fiat: 1000000, ST_1:20},
	}

	for _, account := range accounts {
		accountJSON, err := json.Marshal(account)
		if err != nil {
			return err
		}

		err = ctx.GetStub().PutState(account.Address, accountJSON)
		if err != nil {
			return fmt.Errorf("failed to put to world state. %v", err)
		}
	}

	return nil
}

func (s *SmartContract) CreateTransfer(ctx contractapi.TransactionContextInterface, 
	transferId string, stId string, fromAddress string, toAddress string, size float64, price float64) error {
	exists, err := s.TransferExists(ctx, transferId)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the transferId for transfer %s already exists", transferId)
	}

	transfer :=  Transfer {
		FromAddress:   fromAddress,
		Price:         price,
		ST_ID:         stId,
		Size:          size,
		TransferId:    transferId,
		ToAddress:     toAddress,
	}

	transferJSON, err := json.Marshal(transfer)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(transferId, transferJSON)
}

func (s *SmartContract) ProcessBatchTransfers(ctx contractapi.TransactionContextInterface, transfers []Transfer) (error) {
	accounts, _ := s.GetAllAccounts(ctx)
	for _, transfer := range transfers {
		err := s.processTransfer(ctx, accounts, transfer)
		if err != nil {
			return fmt.Errorf("Error while processing transfer %s: %v", transfer.TransferId, err)
		}
	}
	return nil
	
}

func (s *SmartContract) processTransfer(ctx contractapi.TransactionContextInterface, accounts map[string]*Account, transfer Transfer) (error) {
	//verify balance
	err := s.verifySufficientBalance(ctx, accounts, transfer)
	if err != nil {
		return fmt.Errorf("Error while verifying transfer %s: %v", transfer.TransferId, err)
	}
	stID := transfer.ST_ID
	fromAccount, _ := accounts[transfer.FromAddress]
	toAccount, _ := accounts[transfer.ToAddress]

	// Use reflection to access the ST field based on stID
	fromSTField := reflect.ValueOf(fromAccount).Elem().FieldByName(stID)
	toSTField := reflect.ValueOf(toAccount).Elem().FieldByName(stID)
	fromST := fromSTField.Interface().(float64)
	toST := toSTField.Interface().(float64)
	//update st balance
	fromST -= transfer.Size
	toST += transfer.Size
	fromSTField.SetFloat(fromST)
	toSTField.SetFloat(toST)
	//update fiat balance
	fromAccount.Fiat += transfer.Size * transfer.Price
	toAccount.Fiat -= transfer.Size * transfer.Price
	return nil
}

func (s *SmartContract) verifySufficientBalance(ctx contractapi.TransactionContextInterface, 
	accounts map[string]*Account, transfer Transfer) (error) {
	
	// Get source and destination accounts
	fromAccount, fromExists := accounts[transfer.FromAddress]
	toAccount, toExists := accounts[transfer.ToAddress]
	if !fromExists || !toExists {
		return fmt.Errorf("Source or destination account does not exist")
	}

	fromAccountST, _ := fromAccount.getSTBalance(transfer.ST_ID)
	requiredST := transfer.Size
	requiredFiat := requiredST * transfer.Price

	if  fromAccountST < requiredST {
		return fmt.Errorf("Insufficient ST balance in %s account", fromAccount.Address)
	}	

	if toAccount.Fiat < requiredFiat {
		return fmt.Errorf("Insufficient fiat balance in %s account", toAccount.Address)
	}

	return nil
}



func (a *Account) getSTBalance( stID string) (float64, error) {
    // Account 구조체를 reflection을 사용하여 탐색
    valueOf := reflect.ValueOf(a)
    
    // stID에 해당하는 필드를 가져옴
    field := valueOf.FieldByName(stID)
    
    if !field.IsValid() {
        return 0, fmt.Errorf("Field not found: %s", stID)
    }
    
    // 필드의 값(잔액)을 float64로 변환
    stBalance := field.Interface().(float64)
    
    return stBalance, nil
}


// CreateAccount issues a new account to the world state with given details.
func (s *SmartContract) CreateAccount(ctx contractapi.TransactionContextInterface, address string, fiat float64, st_1 float64) error {
	exists, err := s.AccountExists(ctx, address)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the address for account %s already exists", address)
	}

	account := Account{
		Address: address,
		Fiat:    fiat,
		ST_1:    st_1,
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
func (s *SmartContract) UpdateAccount(ctx contractapi.TransactionContextInterface, address string, fiat float64, st_1 float64) error {
	exists, err := s.AccountExists(ctx, address)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("the account %s does not exist", address)
	}

	// overwriting original account with new account
	account := Account{
		Address:   address,
		Fiat:      fiat,
		ST_1:      st_1,
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
func (s *SmartContract) GetAllAccounts(ctx contractapi.TransactionContextInterface) (map[string]*Account, error) {
	// range query with empty string for startKey and endKey does an
	// open-ended query of all accounts in the chaincode namespace.
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	accounts := make(map[string]*Account)
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

		accounts[account.Address] = &account
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

// TransferExists returns true when account with given address exists in world state
func (s *SmartContract) TransferExists(ctx contractapi.TransactionContextInterface, transferId string) (bool, error) {
	accountJSON, err := ctx.GetStub().GetState(transferId)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return accountJSON != nil, nil
}