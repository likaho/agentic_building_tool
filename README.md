
<!-- markdownlint-disable MD030 -->

  
  


# Agentic Protocol 
Welcome to Agentic Protocol - An open platform for the new AI economy.  It is a Decentralized Agentic Protocol No-Code Building Tool & Marketplace.

## Overview

- This innovative platform empowers creators and developers to build and own their AI agents.
- Creators mint non-fungible tokens (NFTs) to establish ownership of their agents, providing verifiable proof of authenticity.
- By accepting token payments via an ERC20 contract, creators can monetize their agents directly.
- The agent's blueprint is securely stored within the Filecoin storage network, ensuring immutable ownership.
- Citrea enables agent creators to mint unique NFTs that prove authorship of AI agents.
- These NFTs allow monetization through token (AGEN) payments from users via an ERC20 contract.
- Decentralized node owners can deploy these agents on a decentralized network and earn AGEN Tokens.
- Galadriel ensures agent integrity by providing zkML proofs of inference. These proofs validate agent behavior, especially when using LLMs.

The combination of FileCoin, NFTs, and zkML creates a powerful ecosystem for AI agents!


  

### There are five main directories in this repo:

  

1.  **chat-ui**: This folder is dedicated to the chat web client.

2.  **chat-backend**: This folder contains an Express web service that handles chat services. It forwards prompts to the Galadriel network.

3.  **contracts**: Here, you'll find all the NFT (AGENTL) and ERC20 (AGEN) contracts.

4.  **core**: The core folder includes both client and server-side projects. It provides a no-code agent building tool and serves as the marketplace.

5.  **function_calling_llm**: In this folder, you'll find Python scripts responsible for function calling. They act as a proxy, deciding which tool or agent to call or redirecting calls to the Galadriel network.

  
  

## Technologies Were Used

The project leverages three key components: Filecoin, Citrea, and the Galadriel network.

1. **Filecoin (Lighthouse):**
   - Filecoin is a decentralized storage network designed to store important information globally.
   - In the context of our project, Filecoin serves as the storage infrastructure for agent-related data.

2. **Citrea:**
   - Citrea enables agent creators to mint unique non-fungible tokens (NFTs, symbol: AGENTL) that prove their authorship of AI agents.
   - These NFTs allow creators to monetize their agents by accepting token (AGEN) payments from users via an ERC20 contract.
   - The agent's definition is stored within the Filecoin storage network, providing proof of ownership.
   - Additionally, decentralized node owners can deploy these agents on a decentralized network and earn AGEN Token.

3. **Galadriel Network:**
   - The Galadriel network plays a crucial role in ensuring agent integrity.
   - It provides zero-knowledge machine learning (zkML) proofs of inference.
   - These proofs validate the correctness and reliability of agent behavior, especially when using large language models (LLMs).

In summary, Citrea and Filecoin collaborate to empower agent creators, while the Galadriel network enhances agent security and reliability.


### Agent Creation

Our Decentralized Agentic Protocol No-Code Building Tool is an innovative platform that empowers creators and developers.

- **Minting NFTs on Citrea Network:**
  - Publish the chat flow definition and mint unique NFTs on the Citrea network.
  - By minting NFTs, creators establish ownership of their AI agents. These tokens serve as verifiable proof of authenticity.
  - Creators can monetize their agents by accepting token payments from users via an ERC20 contract. It’s a direct way to earn rewards for your work.

- **Storing Definitions on Filecoin:**
  - The agent’s definition—the blueprint for your AI agent—is securely stored within Lighthouse, one of the Filecoin storage providers.

- **Agent Discovery and Tool Use:**
  - Finally, a new chat flow acts like a tool for other agents after it is listed in the marketplace. It will be automatically discovered. LLMs can benefit from tool use to perform more complex tasks. Tools allow LLMs to trigger actions.

This decentralized approach ensures that ownership remains provable and immutable.

### Agent Inference

The user prompt is transmitted to our marketplace, where the appropriate tool or tools are selected to fulfill the request.


- **Using Galadriel Network for zkML Proofs:**
  - Once confirmed, our default gateway redirects the prompt to the Galadriel Network via Oracle. zkML inference is performed to validate the integrity of the inference. 

### For the Core Project Setup

  

1. Clone the repository

  

```bash

git clone https://github.com/likaho/AgenticProtocol.git

```

  

2. Go into individual repository folder, for example core/packages/ui

  

```bash

cd core/packages/ui

```

  

3. Install all dependencies of all modules:

  

```bash

pnpm install

```

  

4. Build all the code:

  

```bash

pnpm build

```

  

5. Start the app:

  

```bash

pnpm start

```

  

You can now access the app on [http://localhost:8080](http://localhost:8080)

  

6. For development build:

  

- Create `.env` file and specify the `VITE_PORT` (refer to `.env.example`) in `packages/ui`

- Create `.env` file and specify the `PORT` (refer to `.env.example`) in `packages/server`

- Run

  

```bash

pnpm dev

```

  

Any code changes will reload the app automatically on [http://localhost:8080](http://localhost:8080)

  
  
  

## 🙋 Support

  

Feel free to ask any questions, raise problems, and request new features in [discussion](https://github.com/likaho/agenticprotocol/discussions)

  

## 🙌 Contributing

  

Thanks go to these awesome original creators of Flowise.ai

  

## 📄 License

  

Source code in this repository is made available under the [Apache License Version 2.0](LICENSE.md).