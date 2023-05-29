import React, { useState } from 'react'
import LayoutAdmin from '../layouts/adminlayout'
import { Grid, TextField, Stack, FormControl, InputLabel, Select, MenuItem, Input, InputAdornment, Button, Typography, IconButton } from '@mui/material'
import { number } from 'yup';
import { LoadingButton } from '@mui/lab';
import { Add } from '@mui/icons-material';
import { supabase } from '@/supabase';
import { Snackbar } from '@/components';
 

export default function Index() {
    const [snackbar, setSnackbar] = useState({
        isOpen: false,
        message: '',
        duration: 0,
        type: 'success',
        color: '' 
    })
    const [submitting, setIsSubmitting] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [type, setType] = useState('');
    const [price, setPrice] = useState({
        tempPrice: 0,
        price: 0
    });

    const [err, setErr] = useState({
        nameErr: '',
        addressErr: '',
        typeErr: '',
        numberErr: '',
        priceErr: ''
    });

    const [kg, setKg] = useState(1);
     

    /* FORM VALIDATION */
    const validation = () => {
        // setIsSubmitting(true);
        // e.preventDefault();
        name == '' ? setErr(pre => ({...pre, nameErr: 'Required Name!'})) : setErr(pre => ({...pre, nameErr: ''}))
        address == '' ? setErr(pre => ({...pre, addressErr: 'Required Address'})) : setErr(pre => ({...pre, addressErr: ''}))
        type == '' ? setErr(pre => ({...pre, typeErr: 'Required Service'})) : setErr(pre => ({...pre, typeErr: ''}));
        price == '' || !price ? setErr(pre => ({...pre, priceErr: 'Required Price'})) : setErr(pre => ({...pre, priceErr: ''}));
        if(phone == '') {
            setErr(pre => ({...pre, numberErr: 'Required Number'}))
        }else if(String(phone).length > 10 || !String(phone).startsWith(9)){
            setErr(pre => ({...pre, numberErr: 'Invalid Phone Number'}))
        }else{
            setErr(pre => ({...pre, numberErr: ''}))
        }
 
    }
    const handleSubmit = async(e) => {
        e.preventDefault();

        if(err.nameErr || err.addressErr || err.typeErr || err.numberErr || err.priceErr){ 
            return console.log('error')
        }
        setIsSubmitting(true);

        /* SAVE TO DATABASE */
        const { data, error } = await supabase.from('laundries_table')
            .insert({name, address, service_type: type, status: 'preparing', phone, price: price.price}).select()

        
        if(error){ 
                setIsSubmitting(false);
                return setSnackbar(({
                    color: '#ff0000',
                    duration: 5000,
                    isOpen: true,
                    message: "Something went wrong",
                    type: 'error'
                })); 
        }
        
        setSnackbar(({
            color: '#00667E',
            duration: 5000,
            isOpen: true,
            message: 'Added Successfully',
            type: 'success'
        }))
        setName('');
        setAddress('');
        setPhone(''),
        setKg(1);
        setPrice(({price: 0, tempPrice: 0}));
        setType('');
        setIsSubmitting(false);
    }
    
   

    return (
        <LayoutAdmin>
            <Grid container height='100%' width={{xs: '100vw', sm: 'calc(100vw - 250px)'}} position='relative' > 
                <Snackbar isOpen={snackbar.isOpen} message={snackbar.message} color={snackbar.color} duration={snackbar.duration} handleClose={() => setSnackbar(pre => ({...pre, isOpen: false}))} type={snackbar.type} />
                <Grid item xs={12} sx={{display: 'grid', placeItems: 'center', padding: {xs: 2, sm: 10} }}>
                    <form style={{width: '100%',}} onSubmit={handleSubmit} >
                        <Stack  width='100%' spacing={2}  >
                            <Typography>Add Laundry</Typography>
                            <TextField 
                                disabled={submitting}
                                type='text'
                                label="Name"
                                value={name}
                                autoComplete='off'
                                onChange={(e) => setName(e.target.value)} 
                                error={err.nameErr ? true : false}
                                helperText={err.nameErr}  
                                onFocus={() => setErr(prev => ({...prev, nameErr: ''}))}
                            />
                            <TextField 
                                disabled={submitting}
                                type='text'
                                label="Address" 
                                autoComplete='off'
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                error={err.addressErr ? true : false}
                                helperText={err.addressErr}
                                onFocus={() => setErr(prev => ({...prev, addressErr: ''}))}
                            />
                            <TextField 
                                disabled={submitting}
                                label="Phone Number"
                                autoComplete='off'
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)} 
                                InputProps={{
                                    startAdornment: <InputAdornment position='start'>+63</InputAdornment>
                                }}
                                error={err.numberErr ? true : false}
                                helperText={err.numberErr}
                                onFocus={() => setErr(prev => ({...prev, numberErr: ''}))}
                            />      
                            <FormControl fullWidth>
                                <InputLabel id="select-type-label">Service Type</InputLabel>
                                <Select 
                                    disabled={submitting}
                                    name='typeErr'
                                    error={err.typeErr ? true : false}
                                    helpertext={err.typeErr}
                                    onChange={(e) => {
                                        setType(e.target.value);
                                    }}
                                    onFocus={() => setErr(prev => ({...prev, typeErr: ''}))}
                                    value={type}
                                    labelId='select-type-label'
                                    id='select-type'    
                                    label="Service Type"
                                >
                                    {services.map(service => (
                                        <MenuItem 
                                            key={service.type} 
                                            value={service.type} 
                                            onClick={() => { 
                                                    if(service.type == 'Gown') { 
                                                        setPrice({price: 0, tempPrice: 0});
                                                        setKg(1) 
                                                        return
                                                    }
                                                    setPrice(pre => ({...pre, price: service.price * kg, tempPrice: service.price}))
                                            }}
                                        >
                                                {service.type}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl> 
                            <TextField  
                                name='priceErr'
                                InputProps={{
                                    style: {
                                        textAlign: 'end'
                                    },
                                    startAdornment: <InputAdornment position='start'>₱</InputAdornment>
                                }}
                                error={err.priceErr ? true : false}
                                helperText={err.priceErr}
                                type='number'
                                label="Price"
                                disabled={submitting ? true : type == 'Gown' ? false : true}
                                fullWidth  
                                onChange={(e) => setPrice(pre => ({price: e.target.value, tempPrice: e.target.value}))}
                                value={price.price}
                                autoComplete='off'
                                onFocus={() => setErr(prev => ({...prev, priceErr: ''}))}
                            />
                            
                            <TextField 
                                fullWidth 
                                disabled={price == '' ? true : false} 
                                onChange={(e) => {
                                    if(e.target.textLength < 1){
                                        setKg(1)
                                        setPrice(pre => ({...pre, price: price.tempPrice}))
                                    }else{
                                        setKg(e.target.value);
                                        setPrice(pre => ({...pre, price: price.tempPrice * e.target.value}))
                                    } 
                                }}
                                value={kg}
                                type='number'
                                min={1}
                                sx={{display: type == 'Gown' ? 'none' : 'block'}}
                                inputMode='numeric'
                                autoComplete='off' 
                                InputProps={{ 
                                    endAdornment: <InputAdornment position='end'>kg</InputAdornment>
                                }}
                            />
                            <LoadingButton 
                                loading={submitting} 
                                type='submit'
                                loadingPosition='center'
                                variant='outlined'  
                                loadingIndicator='Adding Laundry...'
                                onClick={validation}
                                >
                                Add Laundry 
                            </LoadingButton>    
                        </Stack>
                    </form>
                </Grid>
            </Grid>
        </LayoutAdmin>
    )
}



export const services = [
    {
        type: 'Wash',
        desc: 'Dry and Fold',
        price: 25,
    },
    {
        type: 'Hand Wash',
        desc: 'Dry and Fold',
        price: 50,
    },
    {
        type: 'Wash & Press',
        desc: '',
        price: 80,
    },
    {
        type: 'Comforter',
        desc: '',
        price: 80,
    },
    {
        type: 'Curtains and Blanket',
        desc: '',
        price: 45,
    },
    {
        type: 'Seat Cover',
        desc: '',
        price: 80,
    },
    {
        type: 'Gown',
        desc: '',
        price: 'By Quotation',
    }
];