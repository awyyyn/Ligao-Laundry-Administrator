import { Box, Button, Modal, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

export default function DeleteModal({data, isOpen, handleClose, handleDelete}) {
    

    return (
        <Modal
            onClose={handleClose}
            open={isOpen}
            sx={{display: 'grid', placeContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: 2}}
        >
            <Box 
                sx={{
                    backgroundColor: '#FFFFFF',
                    padding: 2,
                    borderRadius: 2, 
                }}
            >
                <Stack spacing={2} >
                    <Stack direction='row' alignSelf={{xs: 'center', sm: 'flex-start'}}>
                        {/* <PriorityHighIcon elevation={2} fontSize='large' htmlColor='red' />     */}
                        <Typography variant={'h4'}>Confirm</Typography>
                    </Stack>
                    <Typography textAlign='center' textOverflow='initial' style={{textIndent: 15, marginRight: 15}} >
                        Are you sure to Delete {data && data.name} booked laundry? 
                    </Typography>
                    <Box sx={{display: 'flex', flexDirection: {xs: "column", sm: 'row'}, justifyContent: 'flex-end', gap: 1}}>
                        <Button variant='outlined' sx={{backgroundColor: '#00667E', border: 'none', color: "#FFFFFF", '&:hover': {color: "#00667E"}}} onClick={handleClose}>Cancel</Button>
                        <Button  variant='outlined' onClick={() => handleDelete(data.id)} sx={{backgroundColor: '#FF0000', border: 'none', color: '#FFFFFF', '&:hover': {color: '#FF0000', borderColor: '#FF0000'}}}>Confirm</Button>
                    </Box>
                </Stack>
            </Box>
        </Modal>
    )
}
 
// address 
// created_at 
// date 
// id 
// kg 
// name 
// phone 
// price 
// service_type 
// status 
// time 
// user_id 
 