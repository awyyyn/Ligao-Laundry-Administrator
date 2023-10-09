import { LoadingButton } from '@mui/lab'
import { Box, Button, Divider, Modal, Stack, Typography } from '@mui/material'
import React from 'react'

export default function finishModal({handleClose, handleFinish, isOpen, data, loadingFinish}) {
    
    
    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            sx={{display: 'grid', placeContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: 2}}
        >
            <Box 
                sx={{
                    backgroundColor: '#FFFFFF',
                    padding: 2,
                    borderRadius: 2, 
                    width: {xs: '80vw', sm: '70vw', md: '30vw'}
                }}
                
            >
                <Typography textAlign='center' variant='h4' >Finish</Typography>
                <Stack
                    direction='column'
                    spacing={3}
                    mt={1} 
                >   
                    <Divider />
                    <Typography>Confirm {data && data.name} laundry as done?</Typography>
                    <Divider />
                    <Box>
                        <Button  
                            fullWidth
                            onClick={() => handleClose()}
                            variant='contained'
                            sx={{
                                backgroundColor: '#FF0000',
                                mb: 1,
                                '&:hover': { backgroundColor: '#FF0000'},
                                '&:active': { backgroundColor: '#FF0000'}}}
                        >Cancel</Button>   
                        <LoadingButton  
                            onClick={() => handleFinish(data.id, data.user_id, data.service_type)}
                            fullWidth
                            variant='contained'
                            sx={{'&:hover': {  cursor: 'pointer'}}}
                            loading={loadingFinish}
                            loadingIndicator="Updating status..."
                            
                        >Finish</LoadingButton>
                    </Box>
                </Stack>                  
            </Box>
        </Modal>
    )
}
