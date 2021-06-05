var axios = require("axios");
const config = require("./config");
const api = axios.create({
  baseURL: config.api,
  headers: { Authorization: config.TOKEN },
});
module.exports = api;
