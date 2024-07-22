import { StatusCodes } from 'http-status-codes'
import { getRunningExpressApp } from '../../utils/getRunningExpressApp'
import { Tool } from '../../database/entities/Tool'
import { getAppVersion } from '../../utils'
import { InternalFlowiseError } from '../../errors/internalFlowiseError'
import { getErrorMessage } from '../../errors/utils'
import { publishToFileCoin, mintNFT, transferERC20 } from '../../utils/blockchainHelper'

const createTool = async (requestBody: any): Promise<any> => {
    try {
        const appServer = getRunningExpressApp()
        const newTool = new Tool()
        Object.assign(newTool, requestBody)
        const tool = await appServer.AppDataSource.getRepository(Tool).create(newTool)
        const dbResponse = await appServer.AppDataSource.getRepository(Tool).save(tool)

        if(dbResponse.account !== undefined) {
            const owner_id = dbResponse.account;
            const tool_id = dbResponse.id;
            const tool_gas = 100;

            const fileCoinJson = { "toolName": dbResponse.name, "toolId": dbResponse.id, "toolSchema": dbResponse.schema, "toolFunc": dbResponse.func, "toolAccount": dbResponse.account, "toolIcon": dbResponse.iconSrc, "toolDescription": dbResponse.description };
            const jsonString = JSON.stringify(fileCoinJson);

            try {
                const cid = await publishToFileCoin(tool_id, jsonString)
    
                await mintNFT(owner_id, tool_id, cid, tool_gas);                
                await transferERC20(owner_id, 1000000000000);
            }
            catch (error) {
                console.log(error);
            }      
        }

        await appServer.telemetry.sendTelemetry('tool_created', {
            version: await getAppVersion(),
            toolId: dbResponse.id,
            toolName: dbResponse.name
        })
        return dbResponse
    } catch (error) {
        throw new InternalFlowiseError(StatusCodes.INTERNAL_SERVER_ERROR, `Error: toolsService.createTool - ${getErrorMessage(error)}`)
    }
}

const deleteTool = async (toolId: string): Promise<any> => {
    try {
        const appServer = getRunningExpressApp()
        const dbResponse = await appServer.AppDataSource.getRepository(Tool).delete({
            id: toolId
        })
        return dbResponse
    } catch (error) {
        throw new InternalFlowiseError(StatusCodes.INTERNAL_SERVER_ERROR, `Error: toolsService.deleteTool - ${getErrorMessage(error)}`)
    }
}

const getAllTools = async (): Promise<any> => {
    try {
        const appServer = getRunningExpressApp()
        const dbResponse = await appServer.AppDataSource.getRepository(Tool).find()
        return dbResponse
    } catch (error) {
        throw new InternalFlowiseError(StatusCodes.INTERNAL_SERVER_ERROR, `Error: toolsService.getAllTools - ${getErrorMessage(error)}`)
    }
}

const getToolById = async (toolId: string): Promise<any> => {
    try {
        const appServer = getRunningExpressApp()
        const dbResponse = await appServer.AppDataSource.getRepository(Tool).findOneBy({
            id: toolId
        })
        if (!dbResponse) {
            throw new InternalFlowiseError(StatusCodes.NOT_FOUND, `Tool ${toolId} not found`)
        }
        return dbResponse
    } catch (error) {
        throw new InternalFlowiseError(StatusCodes.INTERNAL_SERVER_ERROR, `Error: toolsService.getToolById - ${getErrorMessage(error)}`)
    }
}

const updateTool = async (toolId: string, toolBody: any): Promise<any> => {
    try {
        const appServer = getRunningExpressApp()
        const tool = await appServer.AppDataSource.getRepository(Tool).findOneBy({
            id: toolId
        })
        if (!tool) {
            throw new InternalFlowiseError(StatusCodes.NOT_FOUND, `Tool ${toolId} not found`)
        }
        const updateTool = new Tool()
        Object.assign(updateTool, toolBody)
        await appServer.AppDataSource.getRepository(Tool).merge(tool, updateTool)
        const dbResponse = await appServer.AppDataSource.getRepository(Tool).save(tool)
        return dbResponse
    } catch (error) {
        throw new InternalFlowiseError(StatusCodes.INTERNAL_SERVER_ERROR, `Error: toolsService.updateTool - ${getErrorMessage(error)}`)
    }
}

export default {
    createTool,
    deleteTool,
    getAllTools,
    getToolById,
    updateTool
}
