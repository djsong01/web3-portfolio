const axios = require('axios');

// copy-paste your URL provided in your Alchemy.com dashboard
const ALCHEMY_URL = "https://eth-sepolia.g.alchemy.com/v2/IfS8a7RoDoJWRJYrGnlrOP27xceruuuo";

axios.post(ALCHEMY_URL, {
  jsonrpc: "2.0",
  id: 1,
  method: "eth_getBlockByNumber",
  params: [
    "latest", // block 46147
    true  // retrieve the full transaction object in transactions array
  ]
}).then((response) => {
  console.log(response.data.result);
});