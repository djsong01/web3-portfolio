import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState, useEffect } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [allBalances, setAllBalances] = useState({});
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function fetchBalances() {
      try {
        const res = await fetch("http://localhost:3042/balances");
        const data = await res.json();
        if (data && typeof data === "object") {
          setAllBalances(data);
        } else {
          setAllBalances({});
        }
      } catch (err) {
        console.error("Failed to fetch balances:", err);
        setAllBalances({});
      }
    }
  
    fetchBalances();
  }, []);
  
  async function refreshBalances() {
    const res = await fetch("http://localhost:3042/balances");
    const data = await res.json();
    setAllBalances(data);
  }

  return (
    <div className="app">
      <div className = "layout">
          <div className ="left-column">
            <Wallet
              balance={balance}
              setBalance={setBalance}
              address={address}
              setAddress={setAddress}
            />
          <div className="container">
            <h2>All Accounts</h2>
                <ul>
                  {Object.entries(allBalances || {}).map(([addr, bal]) => (
                    <li key={addr}>
                      {addr.slice(0, 10)}...: {bal}
                    </li>
                  ))}
                </ul>
          </div>
      </div>
      <div className = "right-column">
        <Transfer 
          setBalance={setBalance} 
          address={address} 
          setTransactions={setTransactions}
          transactions={transactions}
          refreshBalances={refreshBalances}
        />

        <div className="container">
          <h2>Transaction History</h2>
          <ul>
            {transactions.map((tx, index) => (
              <li key={index}>{tx}</li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  </div>
  );
}

export default App;
