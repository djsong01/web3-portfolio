import { useState } from "react";
import server from "./server";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";
import { sign } from "ethereum-cryptography/secp256k1";

function Transfer({ 
    address, 
    setBalance, 
    setTransactions, 
    transactions, 
    refreshBalances 
  }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    const msg = `Send ${sendAmount} to ${recipient}`;
    const msgHash = keccak256(utf8ToBytes(msg));
    const [signature, recoveryBit] = await sign(msgHash, privateKey, {recovered: true});
  

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        message: msg,
        signature: toHex(signature),
        recoveryBit,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);

      setTransactions((prev) => [
        ...prev,
        `✅ Sent ${sendAmount} to ${recipient}`,
      ]);

      refreshBalances();

    } catch (ex) {
      alert(ex.response.data.message);
      setTransactions((prev) => [
        ...prev,
        `❌ Failed to send ${sendAmount} to ${recipient}`,
      ]);
    
      refreshBalances();
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Private Key
          <input
            placeholder="Enter your private key"
            value={privateKey}
            onChange={setValue(setPrivateKey)}
          ></input>
      </label>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
