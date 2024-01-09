const axios = require('axios');

const PORT = '3004';

function getAccountByAddress(address) {
    axios
        .get(`http://35.226.148.114:${PORT}/api/stchannel/accounts/${address}`)
        .then((response) => {
            console.log(response.data);
            return response.data;
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });
}

function getAllAccounts() {
    axios
        .get(`http://35.226.148.114:${PORT}/api/stchannel/accounts`)
        .then((response) => {
            console.log(response.data);
            return response.data;
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });
}

const createUser = (name, email, password) => {
    axios
        .post(`http://35.226.148.114:${PORT}/users/create`, {
            name: name,
            email: email,
            password: password,
        })
        .then((response) => {
            console.log(response.data);
            return response.data;
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });
};

const mintTokens = (userId, stName, offerPrice, offerQty) => {
    axios
        .post(`http://35.226.148.114:${PORT}/sto/mint`, {
            userId: userId,
            stId: stName,
            offerPrice: offerPrice,
            offerQty: offerQty,
        })
        .then((response) => {
            console.log(response.data);
            return response.data;
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });
};

const buyStos = (buyUserId, sellUserId, stId, price, qty) => {
    axios
        .post(`http://35.226.148.114:${PORT}/sto/buy`, {
            buyUserId: buyUserId,
            sellUserId: sellUserId,
            stId: stId,
            price: price,
            qty: qty,
        })
        .then((response) => {
            console.log(response.data);
            return response.data;
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });
};

// createUser('주하영', 'fpzkgkdud@gmail.com11', 'Password!1234');
const userId1 = 'abb6f79d-5134-4a8a-82d2-201bcce324c4';

// createUser('유동우', 'ydwoo-bay@gmail.com', 'Password!12345');
const userId2 = 'ad973166-6bc7-4d12-9815-31561be0c2be';

// 이의준
const userId3 = 'clr6c9f420000q6dlyulvofeh';

// mintTokens(userId1, '3', 1000, 500);
// mintTokens(userId2, '4', 1000, 500);
mintTokens(userId3, '5', 1000, 500);
mintTokens(userId3, '6', 500, 1000);

// // mintTokens('6cc98652-14b5-4410-addc-8acc7afefd94', 15, 1000, 500);

// buyStos(userId2, userId1, 3, 20, 20);

getAllAccounts();
//getAccountByAddress(userId1);
