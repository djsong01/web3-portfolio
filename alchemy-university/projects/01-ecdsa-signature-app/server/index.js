const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "0x4530c168aa39e0b563577e6af817f4b6f8b97ec6": 100,
  "0x7aba235c3feb80c490c9fee338013936d6afbcf1": 50,
  "0x8832d26edf404c7b239869a7d8856c36fc6fe1af": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.get("/balances", (req, res) => {
  res.send(balances);
});

app.post("/send", (req, res) => {
  const { message, signature, recoveryBit, amount, recipient } = req.body;

  const msgHash = keccak256(utf8ToBytes(message));
  const signatureBytes = Uint8Array.from(Buffer.from(signature, "hex"));
  const publicKey = secp.recoverPublicKey(msgHash, signatureBytes, recoveryBit);
  const sender = "0x" + toHex(keccak256(publicKey.slice(1)).slice(-20));

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
