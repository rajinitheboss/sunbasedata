
const axios = require("axios");

const instance = axios.create({
    baseURL: 'https://qa2.sunbasedata.com/sunbase/portal/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

module.exports = instance;