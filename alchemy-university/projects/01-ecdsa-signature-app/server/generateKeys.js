const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");


for (let i = 0; i < 3; i++) {
  const privateKey = secp.utils.randomPrivateKey();
  const publicKey = secp.getPublicKey(privateKey);

  const ethAddpublicKey = keccak256(publicKey.slice(1)).slice(-20);

  console.log(`Account ${i + 1}:`);
  console.log(`Private Key: ${toHex(privateKey)}`);
  console.log(`Public Key: ${toHex(publicKey)}`);
  console.log(`Ethereum Address: 0x${toHex(ethAddpublicKey)}`);
}