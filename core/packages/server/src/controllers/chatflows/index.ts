import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ChatFlow } from '../../database/entities/ChatFlow'
import { InternalFlowiseError } from '../../errors/internalFlowiseError'
import { ChatflowType } from '../../Interface'
import chatflowsService from '../../services/chatflows'
import { getApiKey } from '../../utils/apiKey'
import { createRateLimiter } from '../../utils/rateLimit'
import { publishToFileCoin, mintNFT } from '../../utils/blockchainHelper'
import axios from 'axios'

const checkIfChatflowIsValidForStreaming = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (typeof req.params === 'undefined' || !req.params.id) {
            throw new InternalFlowiseError(
                StatusCodes.PRECONDITION_FAILED,
                `Error: chatflowsRouter.checkIfChatflowIsValidForStreaming - id not provided!`
            )
        }
        const apiResponse = await chatflowsService.checkIfChatflowIsValidForStreaming(req.params.id)
        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

const checkIfChatflowIsValidForUploads = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (typeof req.params === 'undefined' || !req.params.id) {
            throw new InternalFlowiseError(
                StatusCodes.PRECONDITION_FAILED,
                `Error: chatflowsRouter.checkIfChatflowIsValidForUploads - id not provided!`
            )
        }
        const apiResponse = await chatflowsService.checkIfChatflowIsValidForUploads(req.params.id)
        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

const deleteChatflow = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (typeof req.params === 'undefined' || !req.params.id) {
            throw new InternalFlowiseError(StatusCodes.PRECONDITION_FAILED, `Error: chatflowsRouter.deleteChatflow - id not provided!`)
        }

        // Delete chatflow from vector database through API
        const chatflow: ChatFlow = await chatflowsService.getChatflowById(req.params.id)
        if (chatflow) {
            if (chatflow.ownerAddress) {
                const vector_search_service_url = `${process.env.VECTOR_SEARCH_SERVICE_URL}/${(chatflow.type === 'MULTIAGENT' ? "agent" : "chatflow")}/${chatflow.id}`
                axios.delete(vector_search_service_url)
                .then((response) => console.log(JSON.stringify(response.data)))
                .catch((error) => console.log(error));                    
            }
        }


        const apiResponse = await chatflowsService.deleteChatflow(req.params.id)
        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

const getAllChatflows = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const apiResponse = await chatflowsService.getAllChatflows(req.query?.type as ChatflowType)
        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

// Get specific chatflow via api key
const getChatflowByApiKey = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (typeof req.params === 'undefined' || !req.params.apikey) {
            throw new InternalFlowiseError(
                StatusCodes.PRECONDITION_FAILED,
                `Error: chatflowsRouter.getChatflowByApiKey - apikey not provided!`
            )
        }
        const apikey = await getApiKey(req.params.apikey)
        if (!apikey) {
            return res.status(401).send('Unauthorized')
        }
        const apiResponse = await chatflowsService.getChatflowByApiKey(apikey.id, req.query.keyonly)
        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

const getChatflowById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (typeof req.params === 'undefined' || !req.params.id) {
            throw new InternalFlowiseError(StatusCodes.PRECONDITION_FAILED, `Error: chatflowsRouter.getChatflowById - id not provided!`)
        }
        const apiResponse = await chatflowsService.getChatflowById(req.params.id)
        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

const saveChatflow = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body) {
            throw new InternalFlowiseError(StatusCodes.PRECONDITION_FAILED, `Error: chatflowsRouter.saveChatflow - body not provided!`)
        }
        const body = req.body
        const newChatFlow = new ChatFlow()
        Object.assign(newChatFlow, body)
        const apiResponse = await chatflowsService.saveChatflow(newChatFlow)
        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

const importChatflows = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const chatflows: Partial<ChatFlow>[] = req.body.Chatflows
        const apiResponse = await chatflowsService.importChatflows(chatflows)
        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

const updateChatflow = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (typeof req.params === 'undefined' || !req.params.id) {
            throw new InternalFlowiseError(StatusCodes.PRECONDITION_FAILED, `Error: chatflowsRouter.updateChatflow - id not provided!`)
        }
        const chatflow: ChatFlow = await chatflowsService.getChatflowById(req.params.id)
        if (!chatflow) {
            return res.status(404).send(`Chatflow ${req.params.id} not found`)
        }

        const body = req.body
        const updateChatFlow = new ChatFlow()
        Object.assign(updateChatFlow, body)

        updateChatFlow.id = chatflow.id

        if(req.body.ownerAddress) {
            // Publish to FileCoin
            const owner_address = req.body.ownerAddress;
            const chatflow_id = chatflow.id;
            const chatflow_name = chatflow.name;
            const chatflow_description = body.description;
            const chatflow_gas = body.gas;
            const chatflow_data = body.flowData;        

            const fileCoinJson = { "chatFlowName": chatflow_name, "chatFlowId": chatflow_id, "ownerAddress": owner_address, "chatFlowDescription": chatflow_description, "chatFlowData": chatflow_data };
            const jsonString = JSON.stringify(fileCoinJson);
            const cid = await publishToFileCoin(chatflow_id, jsonString)
            console.log("FileCoin CID: "+cid)
            // Mint NFT
            const receipt = await mintNFT(owner_address, chatflow_id, cid, chatflow_gas)
            const txHash = receipt.hash;
            console.log("NFT Transaction Hash:" +txHash)
            
            // Assign new values to chatflow
            updateChatFlow.ownerAddress = owner_address
            updateChatFlow.nftAddress = process.env.NFT_CONTRACT_ADDRESS
            updateChatFlow.tokenId = chatflow_id
            updateChatFlow.description = chatflow_description
            updateChatFlow.isPublished = true
            updateChatFlow.gas = chatflow_gas

            // Publish to vector search service
            const payload = JSON.stringify({"name": chatflow_name, "description": updateChatFlow.description, "query_type": "str", "query_description": "user prompt", "return_type": "str", "return_description": "completion", "id": updateChatFlow.id})
            const vector_search_service_url = `${process.env.VECTOR_SEARCH_SERVICE_URL}/${(chatflow.type === 'MULTIAGENT' ? "agent" : "chatflow")}`

            let config = {
            method: 'post',
            url: vector_search_service_url,
            headers: { 
                'Content-Type': 'application/json'
            },
            data : payload
            };
            
            axios.request(config)
            .then((response) => {
            console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
            console.log(error);
            });
        }

        createRateLimiter(updateChatFlow)

        const apiResponse = await chatflowsService.updateChatflow(chatflow, updateChatFlow)
        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

const getSinglePublicChatflow = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (typeof req.params === 'undefined' || !req.params.id) {
            throw new InternalFlowiseError(
                StatusCodes.PRECONDITION_FAILED,
                `Error: chatflowsRouter.getSinglePublicChatflow - id not provided!`
            )
        }
        const apiResponse = await chatflowsService.getSinglePublicChatflow(req.params.id)
        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

const getSinglePublicChatbotConfig = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (typeof req.params === 'undefined' || !req.params.id) {
            throw new InternalFlowiseError(
                StatusCodes.PRECONDITION_FAILED,
                `Error: chatflowsRouter.getSinglePublicChatbotConfig - id not provided!`
            )
        }
        const apiResponse = await chatflowsService.getSinglePublicChatbotConfig(req.params.id)
        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

export default {
    checkIfChatflowIsValidForStreaming,
    checkIfChatflowIsValidForUploads,
    deleteChatflow,
    getAllChatflows,
    getChatflowByApiKey,
    getChatflowById,
    saveChatflow,
    importChatflows,
    updateChatflow,
    getSinglePublicChatflow,
    getSinglePublicChatbotConfig
}
