import {Contract, ethers, TransactionReceipt, Wallet} from "ethers";
import ABI from "./abis/ChatGpt.json";
import * as readline from 'readline';

require("dotenv").config()

interface Message {
  role: string,
  content: string,
}

interface MessageRequest {
  question: string,
  chatId: string,
}

interface MessageResponse {
  text: string,
  question: string,
  chatId: string,
  chatMessageId: string,
  sessionId: string
}

export const handleRequest = async (req: MessageRequest): Promise<MessageResponse> => {
  const messages: Message[] | undefined = await chat(req.question);
  let returnedContent = "";
  if(messages !== undefined) {
    messages.forEach(message => {
      if(message.role === 'assistant') {
        returnedContent = returnedContent + ' ' +message.content
      }
    });
  }
  const response: MessageResponse = { text: returnedContent, question: req.question, chatId: req.chatId, chatMessageId: "a9a1701c-615a-462b-b1bc-86d765cb6ec7", sessionId: req.chatId }
  return response;  
  }

const chat = async(msg: string): Promise<Message[] | undefined> => {
  const rpcUrl = process.env.RPC_URL
  if (!rpcUrl) throw Error("Missing RPC_URL in .env")
  const privateKey = process.env.PRIVATE_KEY
  if (!privateKey) throw Error("Missing PRIVATE_KEY in .env")
  const contractAddress = process.env.CHAT_CONTRACT_ADDRESS
  if (!contractAddress) throw Error("Missing CHAT_CONTRACT_ADDRESS in .env")

  const provider = new ethers.JsonRpcProvider(rpcUrl)
  const wallet = new Wallet(
    privateKey, provider
  )
  const contract = new Contract(contractAddress, ABI, wallet)


  // Call the startChat function
  const transactionResponse = await contract.startChat(msg)
  const receipt = await transactionResponse.wait()
  console.log(`Message sent, tx hash: ${receipt.hash}`)
  console.log(`Chat started with message: "${msg}"`)

  // Get the chat ID from transaction receipt logs
  let chatId = getChatId(receipt, contract);
  console.log(`Created chat ID: ${chatId}`)
  if (!chatId && chatId !== 0) {
    return
  }

  let allMessages: Message[] = []
  // Run the chat loop: read messages and send messages
  while (true) {
    const newMessages: Message[] = await getNewMessages(contract, chatId, allMessages.length);
    if (newMessages) {
      for (let message of newMessages) {
        console.log(`${message.role}: ${message.content}`)
        allMessages.push(message)
        if (allMessages.at(-1)?.role == "assistant") {
          // const message = getUserInput()
          const transactionResponse = await contract.addMessage(msg, chatId)
          const receipt = await transactionResponse.wait()
          console.log(`Message sent, tx hash: ${receipt.hash}`)
        }
      }
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
    return allMessages;
  }
}



async function main() {
  const rpcUrl = process.env.RPC_URL
  if (!rpcUrl) throw Error("Missing RPC_URL in .env")
  const privateKey = process.env.PRIVATE_KEY
  if (!privateKey) throw Error("Missing PRIVATE_KEY in .env")
  const contractAddress = process.env.CHAT_CONTRACT_ADDRESS
  if (!contractAddress) throw Error("Missing CHAT_CONTRACT_ADDRESS in .env")

  const provider = new ethers.JsonRpcProvider(rpcUrl)
  const wallet = new Wallet(
    privateKey, provider
  )
  const contract = new Contract(contractAddress, ABI, wallet)

  // The message you want to start the chat with
  const message = await getUserInput()

  // Call the startChat function
  const transactionResponse = await contract.startChat(message)
  const receipt = await transactionResponse.wait()
  console.log(`Message sent, tx hash: ${receipt.hash}`)
  console.log(`Chat started with message: "${message}"`)

  // Get the chat ID from transaction receipt logs
  let chatId = getChatId(receipt, contract);
  console.log(`Created chat ID: ${chatId}`)
  if (!chatId && chatId !== 0) {
    return
  }

  let allMessages: Message[] = []
  // Run the chat loop: read messages and send messages
  while (true) {
    const newMessages: Message[] = await getNewMessages(contract, chatId, allMessages.length);
    if (newMessages) {
      for (let message of newMessages) {
        console.log(`${message.role}: ${message.content}`)
        allMessages.push(message)
        if (allMessages.at(-1)?.role == "assistant") {
          const message = getUserInput()
          const transactionResponse = await contract.addMessage(message, chatId)
          const receipt = await transactionResponse.wait()
          console.log(`Message sent, tx hash: ${receipt.hash}`)
        }
      }
    }
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

}

async function getUserInput(): Promise<string | undefined> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const question = (query: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(query, (answer) => {
        resolve(answer)
      })
    })
  }

  try {
    const input = await question("Message ChatGPT: ")
    rl.close()
    return input
  } catch (err) {
    console.error('Error getting user input:', err)
    rl.close()
  }
}


function getChatId(receipt: TransactionReceipt, contract: Contract) {
  let chatId
  for (const log of receipt.logs) {
    try {
      const parsedLog = contract.interface.parseLog(log)
      if (parsedLog && parsedLog.name === "ChatCreated") {
        // Second event argument
        chatId = ethers.toNumber(parsedLog.args[1])
      }
    } catch (error) {
      // This log might not have been from your contract, or it might be an anonymous log
      console.log("Could not parse log:", log)
    }
  }
  return chatId;
}

async function getNewMessages(
  contract: Contract,
  chatId: number,
  currentMessagesCount: number
): Promise<Message[]> {
  const messages = await contract.getMessageHistoryContents(chatId)
  const roles = await contract.getMessageHistoryRoles(chatId)

  const newMessages: Message[] = []
  messages.forEach((message: any, i: number) => {
    if (i >= currentMessagesCount) {
      newMessages.push({
        role: roles[i],
        content: messages[i]
      })
    }
  })
  return newMessages;
}

main()
  .then(() => console.log("Done"))