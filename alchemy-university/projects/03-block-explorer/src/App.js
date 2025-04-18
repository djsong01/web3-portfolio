import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [blockData, setBlockData] = useState();
  const [topTxs, setTopTxs] = useState([]);

  const getBlockData = async () => {
      const latestBlockNumber = await alchemy.core.getBlockNumber();
      setBlockNumber(latestBlockNumber);
      const block = await alchemy.core.getBlockWithTransactions(latestBlockNumber);
      setBlockData(block);
      //const blocktx = await alchemy.core.getBlockWithTransactions(latestBlockNumber);
      //setTx(blocktx);
      //const transaction = blocktx.transactions;
      const txs = block.transactions;
      const top5 = txs
        .filter(tx=>tx.value.gt(0))
        .sort((a,b)=>b.value.sub(a.value))
        .slice(0,5);
      setTopTxs(top5)
  };

  useEffect(() => {
    getBlockData();
    }, []);

  return <div className="App">
    <div className="block">
      <h1>Ethereum Block Explorer</h1>
      <button onClick={getBlockData}>🔄 Refresh</button>

      <div className = "block-info">
        <h2>Block Details</h2>
        <p><strong>Block Number:</strong> {blockNumber}</p>
        <p><strong>Hash:</strong> {blockData?.hash}</p>
        <p><strong>Gas Used:</strong> {blockData?.gasUsed ? blockData.gasUsed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "Loading ..."}</p>
        <p><strong>Miner:</strong> {blockData?.miner}</p>
        <p><strong>Timestamp:</strong> {blockData?.timestamp ? new Date(blockData.timestamp * 1000).toLocaleString() : "Loading..."}</p>
        <p><strong>Transactions:</strong> {blockData?.transactions.length}</p>

      </div>
    </div>

    <div className ="transactions">
      <h1>Top 5 Transactions</h1>
      <div className = "block-info">
        <h2>Transaction Details</h2>
        <ul>
          {topTxs.map((tx) => (
              <li key={tx.hash}>
                  <p><strong>From:</strong> {tx.from}</p>
                  <p><strong>To:</strong> {tx.to}</p>
                  <p><strong>Value:</strong> {Number(Utils.formatEther(tx.value)).toFixed(3)} ETH</p>
                  <hr />
              </li>
          ))}
        </ul>
      </div>
    </div>
  </div>;
}

export default App;
