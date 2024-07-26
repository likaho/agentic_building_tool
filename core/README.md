<!-- markdownlint-disable MD030 -->


# AgenticProtocol - Build LLM Apps Easily


### Setup

  

1. Clone the repository

  

```bash

git clone https://github.com/likaho/agentic_protocol.git

```

  

2. Go into core repository folder
  

```bash

cd core

```

  

3. Install all dependencies of all modules:

  

```bash

pnpm install

```

4. Create.env files

- Create `.env` file and specify the `VITE_PORT` (refer to `.env.example`) in `packages/ui`

- Create `.env` file and specify the `PORT` (refer to `.env.example`) in `packages/server`
- In the.env file, you need to set `PRIVATE_KEY` to a private key that is used to sign transactions on behalf of users during publishing the function definition to the lighthouse storage network and creating a NFT on Citrea network.

- For creating a wallet in Citrea network, please go to [https://docs.citrea.xyz/user-guide/how-to-use-bridge](https://docs.citrea.xyz/user-guide/how-to-use-bridge)
- For lighthouse, please go to [https://files.lighthouse.storage](https://files.lighthouse.storage)
  
6. Build all the code:

  

```bash

pnpm build

```

  

6. For development build and start the app:

  

```bash

pnpm run dev

```

  

You can now access the app on [http://localhost:3032](http://localhost:3032)

  

Any code changes will reload the app automatically on [http://localhost:3032](http://localhost:3032)

  
  
  

## 🙋 Support

Feel free to ask any questions, raise problems, and request new features in [discussion](https://github.com/likaho/agenticprotocol/discussions)

## 🙌 Contributing

Thanks go to these awesome original creators of Flowise.ai

## 📄 License

Source code in this repository is made available under the [Apache License Version 2.0](LICENSE.md).
