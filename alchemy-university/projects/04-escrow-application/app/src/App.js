import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import Escrow from './Escrow';


export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  const [provider, setProvider] = useState();
  const [balance, setBalance] = useState();

  useEffect(() => {
    async function getAccounts() {
      const _provider = new ethers.providers.Web3Provider(window.ethereum);

      await _provider.send('eth_requestAccounts', []);
      const network = await _provider.getNetwork();

      if(network.chainId !== 31337){
        alert("Please switch MM to HH local (ID: 31337)");
        return;
      }

      const accounts = await _provider.listAccounts();
      setAccount(accounts[0]);
      setSigner(_provider.getSigner());
      setProvider(_provider);

      const rawBalance = await _provider.getBalance(accounts[0]);
      setBalance(ethers.utils.formatEther(rawBalance));


    }

    getAccounts();
  }, []);

  async function newContract() {
    const beneficiaryRaw = document.getElementById('beneficiary').value;
    const arbiterRaw = document.getElementById('arbiter').value;

    const beneficiary = beneficiaryRaw.trim();
    const arbiter = arbiterRaw.trim();

    if (!ethers.utils.isAddress(beneficiary) || !ethers.utils.isAddress(arbiter)) {
      alert("Please enter valid Ethereum addresses (starting with 0x).");
      return;
    }

    const value = ethers.BigNumber.from(document.getElementById('wei').value);
    const escrowContract = await deploy(signer, arbiter, beneficiary, value);


    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
      handleApprove: async () => {
        escrowContract.on('Approved', () => {
          document.getElementById(escrowContract.address).className =
            'complete';
          document.getElementById(escrowContract.address).innerText =
            "✓ It's been approved!";
        });

        await approve(escrowContract, signer);
      },
    };

    setEscrows([...escrows, escrow]);
  }

  return (
    <>
      <div style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc' }}>
        <strong>Connected Wallet:</strong> {account} <br />
        <strong>Balance:</strong> {balance} ETH
      </div>
      
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in Wei)
          <input type="text" id="wei" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Existing Contracts </h1>

        <div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow} />;
          })}
        </div>
      </div>
    </>
  );
}

export default App;
