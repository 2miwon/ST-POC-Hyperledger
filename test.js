let obj = {
    "FromAddress": "testuser1",
    "Price": 1,
    "ST_ID": "ST_1",
    "Size": 1,
    "TransferId": "transfer1",
    "ToAddress": "testuser2"
  };
  
  let jsonString = JSON.stringify(obj);
  let escapedJsonString = jsonString.replace(/"/g, '\\"');

  console.log(escapedJsonString)