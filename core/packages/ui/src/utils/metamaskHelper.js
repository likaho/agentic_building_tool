import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { ConstructionOutlined } from '@mui/icons-material';
const { ethereum } = window;

export const switchNetwork = async() => {
    const chainId = '696969' //
    // Convert chainId to hexadecimal string (if necessary)
    const chainIdhex = '0xf35a' //'0xf35a';  //galadriel chainIdhex: 0xAA289

    if (window.ethereum.net_version !== chainId) {
        try {
            // Request MetaMask to switch to the desired network
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: chainIdhex }]
            });
        } catch (error) {
            // If the chain has not been added to MetaMask, prompt the user to add it
            if (error.code === 4902) {
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [{
                        chainName: "Citrea Devnet",
                        chainId: chainIdhex,
                        nativeCurrency: {
                            name: "CBTC",
                            decimals: 18,
                            symbol: "CBTC"
                        },
                        rpcUrls: ["[6](https://rpc.devnet.citrea.xyz/)"]
                    }]
                });
            }
        }
    } else {
        console.log("Already connected to the desired network.");
    }
}

export const connectToMetaMask = async() => {
    // Check if MetaMask is available
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
  
    if (!ethereum) {
        alert("Please install MetaMask!");
        return;
      }
    
      try {
        await switchNetwork();
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];        
        console.log("Connected to MetaMask account:", account);
        return account
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        return ""
      }
}

export const signDataWithMetaMask = async () => {
  // Check if MetaMask is available
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return;
  }
  
  try {
    // Get provider and signer
    const provider = new ethers.getDefaultProvider();
    console.log(provider)
    const signer = provider.Signer;

    // Define the data to sign (replace with your actual data)
    const data = "This is some data to be signed by MetaMask";

    // Request signature from user
    const signature = await signer.signMessage(data);
    console.log("Signature:", signature);

  } catch (error) {
    console.error("Error signing data:", error);
  }
}
