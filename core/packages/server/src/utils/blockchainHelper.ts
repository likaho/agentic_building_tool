import lighthouse from '@lighthouse-web3/sdk';
import {Contract, ethers, TransactionReceipt, Wallet} from "ethers";
import ABI from "./abis/AgentNFT.json";
import ERC20ABI from "./abis/AGEN.json";
import fs from 'fs';


const rpcUrl = process.env.RPC_URL
if (!rpcUrl) throw Error("Missing RPC_URL in .env")
const privateKey = process.env.PRIVATE_KEY
if (!privateKey) throw Error("Missing PRIVATE_KEY in .env")

export const publishToFileCoin = async(tool_id: string, jsonString: string) => {
        fs.writeFileSync(tool_id + ".json", jsonString)

        const apiKey: string | undefined = process.env.LIGHTHOUSE_API_KEY
        if (!apiKey) throw Error("Missing apiKey in .env")
        const fileName = tool_id + '.json'
        const uploadResponse = await lighthouse.upload(
            fileName,
            apiKey
        )
        const cid = uploadResponse.data.Hash

        console.log(uploadResponse)

        fs.unlinkSync(fileName)
        return cid
}

export const mintNFT = async(owner: string, agent_id: string, cid: string, gas: number) => {
    const contractAddress = process.env.NTF_CONTRACT_ADDRESS
    if (!contractAddress) throw Error("Missing NFT_CONTRACT_ADDRESS in .env")
  
    const provider = new ethers.JsonRpcProvider(rpcUrl)
    const wallet = new Wallet(
      privateKey, provider
    )
    const contract = new Contract(contractAddress, ABI, wallet)
  
    let receipt
    // Call the startChat function
    try{
      console.log(`NFTMinting for owner: ${owner}, id: ${agent_id}, cid: ${cid}, gas: ${gas}`)
      const transactionResponse = await contract.mint(owner, agent_id, cid, gas);
      receipt = await transactionResponse.wait()
      console.log(`Task sent, tx hash: ${receipt.hash}`)
    } catch (e) {
      console.log(e)
    }
    return receipt;
  }

export const transferERC20 = async(to: string, value: any) => {
    const contractAddress = process.env.ERC20_CONTRACT_ADDRESS;
    const from = process.env.ERC20_FAUCET_ADDRESS;
    if (!contractAddress) throw Error("Missing ERC20_CONTRACT_ADDRESS in .env")
  
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new Wallet(
      privateKey, provider
    );
    const contract = new Contract(contractAddress, ABI, wallet);
  
    // Call the startChat function
    const transactionResponse = await contract.transferFrom(from, to, value);
    const receipt = await transactionResponse.wait();
    console.log(`Task sent, tx hash: ${receipt.hash}`);
    return receipt;
  }
