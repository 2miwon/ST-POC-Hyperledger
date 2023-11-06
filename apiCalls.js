const axios = require('axios');

function getAllAccounts() {
    axios.get('http://35.226.148.114:3000/api/channel1')
      .then(response => {
        console.log(response.data);
        return response.data;
      })
      .catch(error => {
        console.log(error);
        throw error;
      });
  }

function getAccountByAddress(address) {
axios.get(`http://35.226.148.114:3000/api/channel1/${address}`)
    .then(response => {
        console.log(response.data);
        return response.data;
    })
    .catch(error => {
        console.log(error);
        throw error;
    });
}

function submitTransferBatch(transferBatch) {
    const url = 'http://35.226.148.114:3000/api/transfer';
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const requestData = {
        function: "ProcessTransferBatch",
        Args: transferBatch
      };

    axios.post(url, requestData, config)
    .then(response => {
      // POST 요청 성공 시 처리할 로직
      console.log('POST 요청 성공:', response.data);
      return response.data;
    })
    .catch(error => {
      // POST 요청 실패 시 처리할 로직
      console.error('POST 요청 실패:', error);
      throw error;
    });
}

const transferBatch = [
    {
      "FromAddress": "user101",
      "Price": 100,
      "ST_ID": "ST_1",
      "Size": 3,
      "TransferId": "transfer201",
      "ToAddress": "user103"
    },
    {
      "FromAddress": "user102",
      "Price": 100,
      "ST_ID": "ST_1",
      "Size": 1,
      "TransferId": "transfer202",
      "ToAddress": "user103"
    },
    {
      "FromAddress": "user102",
      "Price": 100,
      "ST_ID": "ST_1",
      "Size": 4,
      "TransferId": "transfer203",
      "ToAddress": "user104"
    }
  ];
  
  // 함수 호출로 POST 요청 수행
  getAllAccounts();
