import { toggleSnackBar } from '@/slices/uxSlice';
import { supabase } from '@/supabase';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Divider, Modal, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';

export default function ConfirmModal({data, isOpen, handleClose}) {   
    const tempPrice = data && data.service_type == "Gown" ? "" : data && data.price
    const [price, setPrice] = useState(0);
    const [kg, setKg] = useState();
    const [pieces, setPieces] = useState(1);
    const [err, setErr] = useState({
        priceErr: false,
        kgErr: false
    })
    const numberOnly = /^\d+$/;  
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleConfirm = async() => { 
        const service_type = data && data.service_type;
        const user_id = data && data.user_id;
        const id = data && data.id
        if(data.service_type == "Gown"){ 
            if(!price || err.priceErr) {
                console.log('123')
                return setErr((prev) => ({...prev, priceErr: true}))
            }
            setLoading(true);
            const { data, error } = await supabase.from('laundries_table')
                .update({
                    price: price,
                    status: 'washing',
                    pieces
                })
                .eq('id', id).select();
            
            /* QUERY FOR GOWN NOTIFICATION */
            await supabase.from('notification')
                .insert({notification_message: `Gown price is set to ₱ ${price}.`, notification_title: 'Confirm Laundry', recipent_id: user_id})
            
            setLoading(false)
            if(error) return console.log(error)

        }else{ 
            if(kg == "" || kg == null) {
                return setErr((prev) => ({...prev, kgErr: true }));
            };

            setLoading(true);
            const { data, error } = await supabase.from('laundries_table')  
                .update({
                    price: price,
                    kg: kg,
                    status: 'washing',
                    pieces
                })
                .eq('id', id).select()

            if(error) return console.log(error)  
            
            /* QUERY FOR NOTIFICATION OF LAUNDRIES EXCEPT FOR TYPE GOWN */ 
            await supabase.from('notification')
                .insert({notification_message: `${data[0].service_type} weighted ${kg}kg amounted to ₱ ${price}.`, notification_title: 'Laundry Confirmed', recipent_id: user_id})
            
        }
        dispatch(toggleSnackBar({
            isOpen: true,
            message: 'Laundry proceed to next step',
            type: 'success',
            color: '#00667E'
        }))
        setPrice('')
        setKg('')
        setLoading(false);
        setPieces(1)
        handleClose();
        setTimeout(() => {
            dispatch(toggleSnackBar({ 
                isOpen: false,
                message: '',
                type: '',
                color: ''
            }))
        }, 5000)
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
                                    e.target.value != "" ? setErr((prev) => ({...prev, kgErr: false})) : null
                                    setKg(e.target.value) 
                                    const totalPrice = e.target.value * Number(tempPrice); 
                                    setPrice(totalPrice)
                                }}
                                focused
                                color={err.kgErr ? 'error' : 'primary'}
                                size='small' 
                                sx={{
                                    display: data && data.service_type == "Gown" ? 'none' : 'flex',
                                }}
                            /> 
                        )
                    }
                    <TextField 
                        label="Pieces"
                        size='small'
                        type='number'
                        value={pieces}
                        onChange={(e) =>  setPieces(e.target.value)}
                    />
                    <TextField 
                        label="Price"  
                        value={price}
                        focused
                        color={err.priceErr ? 'error' : 'primary'}
                        onChange={(e) => {
                            setPrice(e.target.value)
                            e.target.value != "" ? setErr((prev) => ({...prev, priceErr: false})) : null;
                            numberOnly.test(e.target.value) ? setErr((prev) => ({...prev, priceErr: false})) : setErr((prev) => ({...prev, priceErr: true})) ;
                        }} 
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
                        <LoadingButton  
                            onClick={handleConfirm}
                            fullWidth
                            loading={loading}
                            variant='contained'
                            sx={{'&:hover': {  cursor: 'pointer'}}}
                        >Confirm</LoadingButton>
                    </Box>
                </Stack>
            </Box>
        </Modal>
    )
}
