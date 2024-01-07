const axios = require('axios');

function getAllAccounts() {
    axios
        .get('http://35.226.148.114:3001/api/stchannel/accounts')
        .then((response) => {
            console.log(response.data);
            return response.data;
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });
}

function getAccountByAddress(address) {
    axios
        .get(`http://35.226.148.114:3000/api/stchannel/accounts/${address}`)
        .then((response) => {
            console.log(response.data);
            return response.data;
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });
}

function createAccount(address) {
    const url = 'http://35.226.148.114:3000/api/stchannel/accounts';
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const requestData = {
        Args: [address],
    };

    axios
        .post(url, requestData, config)
        .then((response) => {
            console.log('Create account response:', response.data);
            return response.data;
        })
        .catch((error) => {
            console.error('Create account error:', error);
            throw error;
        });
}

function deleteAccount(address) {
    const url = 'http://35.226.148.114:3000/api/stchannel/accounts/delete';
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const requestData = {
        Args: [address],
    };

    axios
        .post(url, requestData, config)
        .then((response) => {
            console.log('Delete account response:', response.data);
            return response.data;
        })
        .catch((error) => {
            console.error('Delete account error:', error);
            throw error;
        });
}

function addFiat(address, amount) {
    const url = 'http://35.226.148.114:3000/api/stchannel/accounts/addfiat';
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const requestData = {
        Args: [address, amount.toString()],
    };

    axios
        .post(url, requestData, config)
        .then((response) => {
            console.log('Add fiat response:', response.data);
            return response.data;
        })
        .catch((error) => {
            console.error('Add fiat error:', error);
            throw error;
        });
}

function mint(address, stID, amount) {
    const url = 'http://35.226.148.114:3000/api/stchannel/accounts/mint';
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const requestData = {
        Args: [address, stID.toString(), amount.toString()],
    };

    axios
        .post(url, requestData, config)
        .then((response) => {
            console.log('Mint ST response:', response.data);
            return response.data;
        })
        .catch((error) => {
            console.error('Mint ST error:', error);
            throw error;
        });
}

function submitTransferBatch(transferBatch) {
    const url = 'http://35.226.148.114:3001/api/stchannel/transfer';
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const requestData = {
        function: 'ProcessTransferBatch',
        Args: transferBatch,
    };

    axios
        .post(url, requestData, config)
        .then((response) => {
            // POST 요청 성공 시 처리할 로직
            console.log('POST 요청 성공:', response.data);
            return response.data;
        })
        .catch((error) => {
            // POST 요청 실패 시 처리할 로직
            console.error('POST 요청 실패:', error);
            throw error;
        });
}

const transferBatch = [
    // {
    //   "FromAddress": "testuser1",
    //   "Price": 7,
    //   "ST_ID": "ST_1",
    //   "Size": 7,
    //   "TransferId": "transfer1010",
    //   "ToAddress": "testuser2"
    // },
    // {
    //     FromAddress: 'testuser1',
    //     Price: 3,
    //     ST_ID: 'ST_1',
    //     Size: 3,
    //     TransferId: 'transfer1004',
    //     ToAddress: 'testuser3',
    // },
    {
        FromAddress: '6cc98652-14b5-4410-addc-8acc7afefd94',
        Price: 20,
        ST_ID: '15',
        Size: 10,
        TransferId: 'transfer1006',
        ToAddress: 'f61ee01a-718a-4c13-9fff-ae0197b9e954',
    },
];

// 함수 호출로 POST 요청 수행
// createAccount('testuser1');
// deleteAccount('testuser1');
// createAccount('testuser1');
// createAccount('testuser2');
// createAccount('testuser3');

// addFiat('testuser1', 1000);
// getAllAccounts();
// mint('admin', 'ST_1', 1000000000);
// addFiat('admin', 100000000);
// mint('testuser2', 'ST_1', 300);
// addFiat('testuser3', 1000);

getAllAccounts();

// submitTransferBatch(transferBatch);

// getAllAccounts();
