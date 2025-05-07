import React, { useEffect, useContext, useState } from 'react';
import { connectWallet } from './connectWallet';
import { useNavigate } from 'react-router-dom';
import { Web3Context } from "../context/CreateWeb3Context";
import './Wallet.css'; 

function Wallet() {
  const navigateTo = useNavigate();
  const { web3State, updateWeb3State } = useContext(Web3Context);
  const { selectedAccount } = web3State;
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (selectedAccount) {
      setShowDialog(true);
      setTimeout(() => {
        setShowDialog(false);
        navigateTo('/login');
      }, 3000);
    }
  }, [selectedAccount, navigateTo]);

  const handleWalletConnection = async () => {
    console.log("Wallet button clicked"); // Add this to test
    const { contractInstance, selectedAccount } = await connectWallet();
    if (contractInstance && selectedAccount) {
      updateWeb3State({ contractInstance, selectedAccount });
    }
  };
  

  return (
    <div className="wallet-background">
      <div className="wallet-overlay">
        <h1 className="wallet-title">Card Memory Game</h1>
        <button className="wallet-button" onClick={handleWalletConnection}>
          Connect Wallet
        </button>

        {showDialog && (
          <div className="wallet-dialog">
            ✅ Wallet Connected: <strong>{selectedAccount}</strong>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wallet;
