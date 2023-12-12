const axios = require('axios');

function getAllAccounts() {
    axios.get('http://35.226.148.114:3000/api/mainchannel/accounts')
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
  axios.get(`http://35.226.148.114:3000/api/mainchannel/accounts/${address}`)
      .then(response => {
          console.log(response.data);
          return response.data;
      })
      .catch(error => {
          console.log(error);
          throw error;
      });
  }

function createAccount(address) {
  const url = 'http://35.226.148.114:3000/api/mainchannel/accounts';
  const config = {
      headers: {
          'Content-Type': 'application/json'
      }
  };
  const requestData = {
      Args: [address]
  };

  axios.post(url, requestData, config)
      .then(response => {
          console.log('Create account response:', response.data);
          return response.data;
      })
      .catch(error => {
          console.error('Create account error:', error);
          throw error;
      });
}

// function deleteAccount(address) {
//   const url = 'http://35.226.148.114:3000/api/mainchannel/accounts/delete';
//   const config = {
//       headers: {
//           'Content-Type': 'application/json'
//       }
//   };
//   const requestData = {
//       Args: [address]
//   };

//   axios.post(url, requestData, config)
//       .then(response => {
//           console.log('Delete account response:', response.data);
//           return response.data;
//       })
//       .catch(error => {
//           console.error('Delete account error:', error);
//           throw error;
//       });
// }


function addFiat(address, amount) {
  const url = 'http://35.226.148.114:3000/api/mainchannel/accounts/addfiat';
  const config = {
      headers: {
          'Content-Type': 'application/json'
      }
  };
  const requestData = {
      Args: [address, amount.toString()]
  };

  axios.post(url, requestData, config)
      .then(response => {
          console.log('Add fiat response:', response.data);
          return response.data;
      })
      .catch(error => {
          console.error('Add fiat error:', error);
          throw error;
      });
}

function mint(address, stID, amount) {
  const url = 'http://35.226.148.114:3000/api/mainchannel/accounts/mint';
  const config = {
      headers: {
          'Content-Type': 'application/json'
      }
  };
  const requestData = {
      Args: [address, stID.toString(), amount.toString()]
  };

  axios.post(url, requestData, config)
      .then(response => {
          console.log('Mint ST response:', response.data);
          return response.data;
      })
      .catch(error => {
          console.error('Mint ST error:', error);
          throw error;
      });
}



function submitTransferBatch(transferBatch) {
    const url = 'http://35.226.148.114:3000/api/mainchannel/transfer';
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const requestData = {
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
// createAccount("user104")
// getAllAccounts();


// getAllAccounts();

// addFiat("user103", 1000);
// mint("user103", "ST_1", 50);
// getAllAccounts();


// submitTransferBatch(transferBatch);
