import { createPortal } from 'react-dom'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button, Box, Dialog, DialogActions, DialogContent, OutlinedInput, Typography, Stack, DialogTitle } from '@mui/material'
import { StyledButton } from '@/ui-component/button/StyledButton'
import { TooltipWithParser } from '@/ui-component/tooltip/TooltipWithParser'
import { connectToMetaMask } from '../../utils/metamaskHelper'

const PublishChatflowDialog = ({ show, dialogProps, onCancel, onConfirm }) => {
    const portalElement = document.getElementById('portal')

    const [chatflowDescription, setChatflowDescription] = useState('')
    const [chatflowGas, setChatflowGas] = useState()
    const [chatflowOwnerAddress, setChatflowAccount] = useState('')
    const [isReadyToSave, setIsReadyToSave] = useState(false)

    useEffect(() => {
        if (chatflowDescription && chatflowOwnerAddress && chatflowGas) setIsReadyToSave(true)
        else setIsReadyToSave(false)
    }, [chatflowDescription, chatflowOwnerAddress, chatflowGas])

    const handleConnectToMetaMask = async () => {
        const accountAddress = await connectToMetaMask()
        setChatflowAccount(accountAddress)
    }

    const component = show ? (
        <Dialog
            open={show}
            fullWidth
            maxWidth='xs'
            onClose={onCancel}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle sx={{ fontSize: '1rem' }} id='alert-dialog-title'>
                {dialogProps.title}
            </DialogTitle>
            <DialogContent>
            <Box>
            <Stack sx={{ position: 'relative', alignItems: 'center' }} direction='row'>
                <Typography variant='overline'>
                    Account Address
                    <span style={{ color: 'red' }}>&nbsp;*</span>
                </Typography>
                <TooltipWithParser
                    title={'Your citrea account address to receive token and NFT when tool is created or used by others.'}
                />
            </Stack>
            <Stack sx={{ position: 'relative', alignItems: 'center' }} direction='row'>
                <OutlinedInput
                    id='toolAccount'
                    type='string'
                    fullWidth
                    disabled={dialogProps.type === 'TEMPLATE'}
                    placeholder='Your account address for minting a NFT for this agent.'
                    multiline={false}
                    rows={1}
                    value={chatflowOwnerAddress}
                    name='toolDesc'
                    onChange={(e) => setChatflowAccount(e.target.value)}
                />
                {/* {dialogProps.type === 'TEMPLATE' && ( */}
                    <StyledButton style={{ marginLeft: 10 }} color='secondary' variant='contained' onClick={handleConnectToMetaMask}>
                        Connect
                    </StyledButton>
                {/* )}                         */}
            </Stack>
            </Box>
            <Box><br/></Box>
            <Box>
                <Stack sx={{ position: 'relative', alignItems: 'center' }} direction='row'>
                    <Typography variant='overline'>
                        Description
                        <span style={{ color: 'red' }}>&nbsp;*</span>
                    </Typography>
                    <TooltipWithParser
                        title={'Description of the agent to be discovered by agent search service.'}                />
                </Stack>
                <OutlinedInput
                    sx={{ mt: 1 }}
                    id='chatflow-description'
                    type='text'
                    fullWidth
                    fullHeight                    
                    multiline={true}
                    placeholder='Please enter the description of the agent.'
                    value={chatflowDescription}
                    onChange={(e) => setChatflowDescription(e.target.value)}
                />
                </Box>
                <Box><br/></Box>
            <Box>
                <Stack sx={{ position: 'relative', alignItems: 'center' }} direction='row'>
                    <Typography variant='overline'>
                        Gas
                        <span style={{ color: 'red' }}>&nbsp;*</span>
                    </Typography>
                    <TooltipWithParser
                        title={'Gas fee charged by this agent.'}                />
                </Stack>
                <OutlinedInput
                    sx={{ mt: 1 }}
                    id='chatflow-gas'
                    type='number'
                    fullWidth
                    fullHeight                    
                    multiline={true}
                    placeholder='Please enter the gas charged by the agent.'
                    value={chatflowGas}
                    onChange={(e) => setChatflowGas(e.target.value)}
                />
                </Box>                
            </DialogContent>
            
            <DialogActions>
                <Button onClick={onCancel}>{dialogProps.cancelButtonName}</Button>
                <StyledButton disabled={!isReadyToSave} variant='contained' onClick={() => onConfirm(chatflowDescription, chatflowOwnerAddress, chatflowGas)}>
                    {dialogProps.confirmButtonName}
                </StyledButton>
            </DialogActions>
        </Dialog>
    ) : null

    return createPortal(component, portalElement)
}

PublishChatflowDialog.propTypes = {
    show: PropTypes.bool,
    dialogProps: PropTypes.object,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func
}

export default PublishChatflowDialog
