import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css';
import { Web3Context } from "../context/CreateWeb3Context";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

    const { web3State } = useContext(Web3Context);
      const {contractInstance, selectedAccount} = web3State;

    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:5000/api/users/login', formData);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userID', response.data.userID);
          onLogin();
      
          // 🔐 Smart contract interaction
          if (contractInstance && selectedAccount) {
            try {
              // console.log("\ncontractInstance and selectedaddr after blockchain call :\n", contractInstance, "\n", selectedAccount)
              const tx = await web3State.contractInstance.initPlayer();
              // console.log("\ncontractInstance and tx and selectedaddr after blockchain call :\n", contractInstance, "\n", tx, "\n", selectedAccount)
              await tx.wait(); // wait for tx to be mined
      
              const balance = await web3State.contractInstance.playerCoins(selectedAccount);
              alert(`🪙 Player initialized with ${balance} coins!`);
            } catch (err) {
              if (err.message.includes("Already initialized")) {
                const balance = await web3State.contractInstance.playerCoins(selectedAccount);
                alert(`🪙 Player already initialized. Current balance: ${balance}`);
              } else {
                alert("⚠️ Failed to initialize player on chain.");
                console.error("initPlayer error:", err);
              }
            }
          } else {
            alert("⚠️ Smart contract not connected.");
          }
      
          navigate('/play');
        } catch (error) {
          if (error.response && error.response.status === 400) {
            setError('User not found. Please register first.');
          } else {
            setError(error.response?.data.message || 'Error logging in');
          }
        }
      };
      

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <>
<div
  style={{
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  }}
>
  <p style={{ fontWeight: "600" }}>Connected Account : {selectedAccount}</p>
</div>

    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className={styles.input}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button type="submit" className={`${styles.button} ${styles.loginButton}`}>
            Login
          </button>
          <button type="button" onClick={handleRegisterRedirect} className={`${styles.button} ${styles.registerButton}`}>
            Register
          </button>
        </div>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
    </>
  );
};

export default Login;