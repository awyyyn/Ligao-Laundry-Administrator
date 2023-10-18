"use client"
import React, { useState, useEffect } from 'react'
import LayoutAdmin from '../layouts/adminlayout'
import { Grid, TextField, Stack, FormControl, InputLabel, Select, MenuItem, Input, InputAdornment, Button, Typography, IconButton, Tabs, Tab, Divider, TableContainer, Paper, Table, TableHead, TableCell, TableBody, TableRow, Box } from '@mui/material'
import { number } from 'yup';
import { LoadingButton, TabContext, TabPanel } from '@mui/lab';
import { Add, ConstructionOutlined, LeakAddRounded } from '@mui/icons-material';
import { supabase } from '@/supabase';
import { ConfirmModal, DeleteModal, Snackbar } from '../../components';
import { useRouter } from 'next/router'; 
import { useDispatch } from 'react-redux';
import { toggleSnackBar } from '@/slices/uxSlice';
 

export default function Index() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteData, setDeleteData] = useState();
    const [confirmModal, setConfirmModal] = useState(false);
    const [confirmData, setConfirmData] = useState();
    const [loadingBTN, setLoadingBTN] = useState(false);
    const [search, setSearch] = useState('');
    const [filtered, setFiltered] = useState([])

    const [tab, setTabs] = useState('0');
    const [submitting, setIsSubmitting] = useState(false);
    const [name, setName] = useState('');
    const [pieces, setPieces] = useState(1)
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [type, setType] = useState('');
    const [price, setPrice] = useState({
        tempPrice: 0,
        price: 0
    });
    const [bookedLaundries, setBookedLaundries] = useState([]); 
    const [bookedLaundriesLength, setBookedLaundriesLength] = useState(0);
    const [err, setErr] = useState({
        nameErr: '',
        addressErr: '',
        typeErr: '',
        numberErr: '',
        priceErr: '',
        kgErr: ''
    });

    const [kg, setKg] = useState(1);

    /* GET CUSTOEMRS BOOKED  */
    const getBooked = async() => {
        const { data, error } = await supabase.from('laundries_table').select().or('user_id.eq.null,status.eq.pending').order('date', {ascending: false})
        if(error) console.log(error)
        // console.log(data)
        // console.log("=====================================================================================")
        console.log(data?.length);
        setBookedLaundriesLength(data.length)
        setBookedLaundries(data);
        setFiltered(data)
    }

    /* REALTIME UPDATE */
    useEffect(() => {

        if(localStorage.getItem('tab')){
            setTabs('1')
        }

        getBooked();
        const subscription = supabase.channel('any').on('postgres_changes',  {event: "*", schema: 'public', table: 'laundries_table'}, (payload) => {
           
            getBooked();
            console.log(payload.new)
        }).subscribe()

        return () => {
            supabase.removeChannel(subscription)
            localStorage.removeItem('tab')
        }
    }, [])
  
    useEffect(() => {
 
        setFiltered(bookedLaundries.filter(book => String(book?.name).toLowerCase().includes(String(search).toLowerCase()) ));

    }, [search])


    /* FORM VALIDATION */
    const validation = () => {
        // setIsSubmitting(true);
        // e.preventDefault();
        name == '' ? setErr(pre => ({...pre, nameErr: 'Required Name!'})) : setErr(pre => ({...pre, nameErr: ''}))
        kg == '' ? setErr(pre => ({...pre, kgErr: 'Required Kg!'})) : setErr(pre => ({...pre, kgErr: ''}))
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
        const date = new Date();
        if(err.nameErr || err.addressErr || err.typeErr || err.numberErr || err.priceErr){ 
            return console.log('error')
        }
        setIsSubmitting(true);
        let num = 1;

        /* SAVE TO DATABASE */
        const { data, error } = await supabase.from('laundries_table')
            .insert({
                name, 
                address, 
                service_type: type, 
                status: 'washing', 
                phone, 
                pieces,
                price: price.price, 
                date: date.toLocaleDateString(),
                user_id: 'walkin'
            }).select()

        
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
        
        dispatch(toggleSnackBar({ 
            isOpen: true,
            message: 'Added Successfully',
            type: 'success',
            color: '#00667E', 
        }));
        setName('');
        setAddress('');
        setPhone(''),
        setKg(1);
        setPrice(({price: 0, tempPrice: 0}));
        setType('');
        setIsSubmitting(false);
        setTimeout(() => {
            dispatch(toggleSnackBar({ 
                isOpen: false,
                message: '',
                type: '',
                color: '', 
            }));
        }, 5000)
    }
   
    
    if(router.isFallback){
        return <h1>Loading...</h1>
    }

    const headerTableStyle = { backgroundColor: '#00667E',color: '#FFFFFF' }

    return (
        <LayoutAdmin> 
            <Grid container height='100%' width={{xs: '100vw', sm: 'calc(100vw - 250px)'}} position='relative' > 
                <Snackbar />
                <Grid item xs={12} sx={{padding: {xs: 2, sm: 2}, width: '100%'}}> 
                    <TabContext value={tab}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            flexWrap="wrap"
                        >
                            <Tabs 
                                value={tab} 
                                onChange={(e, index) => { 
                                    setTabs(index)
                                }}  
                            >
                                <Tab label="Add Laundry" value={'0'} />
                                <Tab label="Booked Laundry" value={'1'} />
                            </Tabs>
                            {tab == 1 && 
                                <TextField 
                                    size='small' 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search" variant="outlined"
                                />
                            }
                        </Stack>
                        
                        <Divider />
                        <TabPanel value={'0'} sx={{width: 'inherit'}}>
                            <form style={{width: '100%',}} onSubmit={handleSubmit} >
                                <Stack  width='100%' spacing={2}>
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
                                            if(e.target.value == ""){
                                                setKg(e.target.value)
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
                                        error={err.kgErr ? true : false}
                                        helperText={err.kgErr}
                                        InputProps={{ 
                                            endAdornment: <InputAdornment position='end'>kg</InputAdornment>
                                        }}
                                    />
                                    <TextField 
                                        fullWidth  
                                        onChange={(e) => setPieces(e.target.value)}
                                        value={pieces}
                                        type='number'
                                        min={1} 
                                        inputMode='numeric'
                                        autoComplete='off'   
                                    />
                                    <LoadingButton 
                                        loading={submitting} 
                                        type='submit'
                                        loadingPosition='center'
                                        variant='outlined'  
                                        loadingIndicator='Adding Laundry...'
                                        onClick={validation}
                                        startIcon={<Add />}
                                        > 
                                        Add Laundry 
                                    </LoadingButton>    
                                </Stack>
                            </form>
                        </TabPanel>
                        <TabPanel value={'1'} style={{overflowX: 'auto'}}> 
                            <ConfirmModal 
                                isOpen={confirmModal}
                                data={confirmData} 
                                handleClose={() => {
                                    setConfirmModal(false)
                                    setConfirmData('')
                                }}
                            />
                            <DeleteModal 
                                isOpen={deleteModal} 
                                data={deleteData} 
                                cancelling={loadingBTN}
                                handleClose={() => {
                                    setDeleteModal(false);
                                    setDeleteData('')
                                }} 
                                handleDelete={async(id) => {
                                    setLoadingBTN(true)
                                    const { error } = await supabase.from('laundries_table').delete().eq('id', id);
                                    console.log(error);
                                    setTimeout(() => {    
                                        setDeleteModal(false);
                                        setLoadingBTN(false)
                                    }, 1000);
                                }}
                            />
                            <TableContainer component={Paper}>
                                <Table stickyHeader>
                                    <TableHead > 
                                        <TableRow >
                                            <TableCell sx={headerTableStyle}>Name</TableCell>
                                            <TableCell sx={headerTableStyle}>Service</TableCell>
                                            <TableCell sx={headerTableStyle}>Time</TableCell>
                                            <TableCell sx={headerTableStyle}>Date</TableCell>
                                            <TableCell sx={headerTableStyle}>Cancel</TableCell>
                                            <TableCell sx={headerTableStyle}>Confirm</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {!bookedLaundriesLength ? 
                                            (
                                                <TableRow>
                                                    <TableCell colSpan={6} > 
                                                        <center>
                                                            <Typography  >0 booked laundry</Typography>
                                                        </center>
                                                    </TableCell>
                                                </TableRow>
                                            ) : ( 
                                                filtered?.map(laundry => {
                                                    return (
                                                        <TableRow key={laundry.id}> 
                                                            <TableCell>{laundry.name}</TableCell>
                                                            <TableCell>{laundry.service_type}</TableCell>
                                                            <TableCell>{laundry.time}</TableCell>
                                                            <TableCell>{laundry.date}</TableCell>
                                                            <TableCell 
                                                                onClick={() => {
                                                                    setDeleteData(laundry);
                                                                    setDeleteModal(true)
                                                                }}
                                                                sx={{'&:hover': {color: "#FF0000", cursor: 'pointer'}}}
                                                            >Cancel</TableCell>
                                                            <TableCell
                                                                onClick={() => {
                                                                    setConfirmData(laundry);
                                                                    setConfirmModal(true);
                                                                }}
                                                                sx={{'&:hover': {color: '#00667E', cursor: 'pointer'}}}
                                                            >Confirm</TableCell>
                                                        </TableRow>
                                                    ) 
                                                })
                                            )
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </TabPanel>
                    </TabContext>
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