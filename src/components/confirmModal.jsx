import { supabase } from '@/supabase';
import { Box, Button, Divider, Modal, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'

export default function ConfirmModal({data, isOpen, handleClose}) {   
    const tempPrice = data && data.service_type == "Gown" ? "" : data && data.price
    const [price, setPrice] = useState(0);
    const [kg, setKg] = useState();
    const numberOnly = /^\d+$/;  


    const handleConfirm = async() => { 
        const service_type = data && data.service_type;
        const user_id = data && data.user_id;
        const id = data && data.id
        if(data.service_type == "Gown"){ 
            if(price == "" || typeof price !== 'number') return alert('Price is required!')
            const { data, error } = await supabase.from('laundries_table')
                .update({
                    price: price,
                    status: 'washing'
                })
                .eq('id', id).select();
            
            /* QUERY FOR GOWN NOTIFICATION */
            await supabase.from('notification')
                .insert({notification_message: `Gown price is set to ₱ ${price}.`, notification_title: 'Confirm Laundry', recipent_id: user_id})

            if(error) return console.log(error)
        }else{ 
            if(kg == "" || kg == null) return alert('Kilogram is required!')
            const { data, error } = await supabase.from('laundries_table')  
                .update({
                    price: price,
                    kg: kg,
                    status: 'washing'
                })
                .eq('id', id).select()

            if(error) return console.log(error)  
            
            /* QUERY FOR NOTIFICATION OF LAUNDRIES EXCEPT FOR TYPE GOWN */ 
            await supabase.from('notification')
                .insert({notification_message: `${data.service_type} is ${kg}kg set to ₱ ${price}.`, notification_title: 'Confirm Laundry', recipent_id: user_id})
            
        }
        setPrice('')
        setKg('')
        handleClose();
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
