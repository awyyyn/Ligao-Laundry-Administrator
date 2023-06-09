import { supabase } from '@/supabase';
import { Box, Button, Divider, Modal, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'

export default function ConfirmModal({data, isOpen, handleClose}) {  
    const tempPrice = data && data.service_type == "Gown" ? "" : data && data.price
    const [price, setPrice] = useState();
    const [kg, setKg] = useState();
    const numberOnly = /^\d+$/;  
    const handleConfirm = async() => {
        const id = data && data.id
        if(data.service_type == "Gown"){ 
            const { data, error } = await supabase.from('laundries_table')
                .update({
                    price: price,
                    status: 'washing'
                })
                .eq('id', id).select()
            if(error) console.log(error) 
        }else{
            const { data, error } = await supabase.from('laundries_table')
                .update({
                    price: price,
                    kg: kg,
                    status: 'washing'
                })
                .eq('id', id).select()
            if(error) console.log(error) 
            console.log(data)
        }
        handleClose();
        setPrice('')
        setKg('')
    }
    return (
        <Modal 
            onClose={() => {
                handleClose()   
                setPrice('')
                setKg('')
            }}
            open={isOpen}    
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
                <Typography textAlign='center' variant='h4' >Confirm Booking</Typography>
                <Stack
                    direction='column'
                    spacing={3}
                    mt={1} 
                >   
                    <Divider />
                    <TextField 
                        label="Name"
                        disabled
                        value={data && data.name}
                        size='small'
                    />
                    <TextField 
                        label="Service Type"
                        disabled
                        value={data && data.service_type}
                        size='small'
                    />     
                    {
                        data && data.service_type == "Gown" ? null : (
                            <TextField 
                                label="Kilogram" 
                                value={kg}
                                type='number'
                                onChange={(e) => { 
                                    setKg(e.target.value) 
                                    const totalPrice = e.target.value * Number(tempPrice); 
                                    setPrice(totalPrice)
                                }}
                                size='small'
                                sx={{display: data && data.service_type == "Gown" ? 'none' : 'flex'}}
                            /> 
                        )
                    }
                    <TextField 
                        label="Price"  
                        value={price}
                        onChange={(e) => setPrice(e.target.value)} 
                        size='small'
                        disabled={data && data.service_type == "Gown" ? false : true} 
                    />
                    <Divider /> 
                    <Box>
                        <Button  
                            fullWidth
                            onClick={() => {
                                handleClose()
                                setPrice('')
                                setKg('')
                            }}
                            variant='contained'
                            sx={{
                                backgroundColor: '#FF0000',
                                mb: 1,
                                '&:hover': { backgroundColor: '#FF0000'},
                                '&:active': { backgroundColor: '#FF0000'}}}
                        >Cancel</Button>   
                        <Button  
                            onClick={handleConfirm}
                            fullWidth
                            variant='contained'
                            sx={{'&:hover': {  cursor: 'pointer'}}}
                        >Confirm</Button>
                    </Box>
                </Stack>
            </Box>
        </Modal>
    )
}
