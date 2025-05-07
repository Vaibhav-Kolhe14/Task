import { ethers } from "ethers";
import contractAbi from "../constants/contractAbi.json"

export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("Metamask is not installed");
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const selectedAccount = accounts[0];
    console.log(selectedAccount);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // const message = "Welcome to Card Memory Game"
    // const signature = await signer.signMessage(message)
    // console.log("Signature is :: ",signature);
    
    // const dataSignature = {
    //   signature
    // }

    // const res = await axios.post(`BACKEND URL`, dataSignature)
    // console.log("Response from backend url :: ", res)
    // console.log("Res.data.data.Token :: ", res.data.data.Token)

    // localStorage.setItem("token", res.data.data.Token)

    const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi.abi,
      signer
    );
    return { contractInstance, selectedAccount };
  } catch (error) {
    console.log("Error in connectWallet :: ", error);
  }
};
