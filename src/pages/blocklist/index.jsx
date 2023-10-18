import React, { useEffect, useMemo, useRef, useState } from 'react'
import LayoutAdmin from '../layouts/adminlayout'
import { Box, Button, Modal, Paper, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Popover, Divider } from '@mui/material'
import { Snackbar } from '@/components';
import { supabase, supabaseAdmin } from '@/supabase';
import { Lock } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { toggleSnackBar } from '@/slices/uxSlice';
import { LoadingButton } from '@mui/lab';

export default function Customers() {

    const [popOverIsOpen, setPopOverIsOpen] = useState(false)
    const dispatch = useDispatch();
    const [ancEl, setAncEl] = useState(null)
    const popId = useRef();
    const [initLoading, setInitLoading] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [toBlockCustomer, setToBlockCustomer] = useState(null);

    const [filtered, setFiltered] = useState([]);
    const [customer, setCustomer] = useState(null);
    const [modal, setModal] = useState(false);
    const [search, setSearch] = useState('');
    const [passs, setPasswords] = useState({
        password: "",
        password2: ""
    });
    const [updateingPassword, setUpdatingPassword] = useState(false);
    const [passwordErrors, setPasswordError] = useState({
        password: "",
        password2: ""
    })
    const [blocking, setBlocking] = useState(false);
    const [toBlockModal, setToBlockModal] = useState(false);
     
    // console.log(customer)

    const getData = async () => {
        
        const { data, error } = await supabase.from('customers').select().eq('is_block', true);  
        // console.log(data)

        if(error) {
            setInitLoading(false)
            return alert(error.message);
        }
        
        setFiltered(data)
        setCustomers(data)
        setInitLoading(false)

    }

    useEffect(() => {

        getData();

        const subscription = supabase.channel('any').on('postgres_changes', {event: "*", schema: 'public', table: "customers"}, (p) => {
            getData()
        }).subscribe();

        return () => supabase.removeChannel(subscription)

    }, []);

    useMemo(() => {
        setFiltered(customers?.filter(item => String(item?.name).toLowerCase().includes(search.toLowerCase())) || String(item?.address).toLowerCase().includes(search.toLowerCase()))
    }, [search])

    const handlePopOverClose = () => {
        setAncEl(null)
        setPopOverIsOpen(false)
    }

    
    // const open = Boolean(anchorEl);
    // const id = open ? 'simple-popover' : undefined;
    
    return (
        <>
            <LayoutAdmin>
                <Box sx={{padding: 2, position: 'relative'}}>
                    <Snackbar />
                    <TextField 
                        size='small' 
                        sx={{marginBottom: 2, float: 'right', minWidth: 300}} 
                        placeholder='Search...'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Paper>
                        <TableContainer>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="table-header">#</TableCell>
                                        <TableCell className="table-header">Name</TableCell>
                                        <TableCell className="table-header">Contact</TableCell>
                                        <TableCell className="table-header">Address</TableCell>
                                        {/* <TableCell className="table-header">Email</TableCell> */}
                                        <TableCell className="table-header" 
                                                style={{
                                                    alignItems: 'center', 
                                                    // justifyContent: 'center',
                                                    display: 'flex',
                                                    columnGap: 5
                                                }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {initLoading ? 
                                        <>
                                        {[0, 1, 2, 3, 4, 5].map(i => (
                                            <TableRow key={i} >
                                                <TableCell colSpan={6} padding={0}>
                                                    <Skeleton width="100%" height='50px' />
                                                </TableCell>
                                            </TableRow>
                                        ))}  
                                        </> : 
                                        filtered?.map((client, i) => (
                                            <TableRow key={client?.user_id}>
                                                <TableCell>{i + 1}</TableCell>
                                                <TableCell sx={{minWidth: 200, textTransform: "capitalize"}}>{client?.name}</TableCell>
                                                <TableCell>{client?.phone}</TableCell>
                                                <TableCell sx={{minWidth: 200, textTransform: 'capitalize'}}>{client?.address}</TableCell>
                                                {/* <TableCell>{client?.email ? client.email : ""}</TableCell>  */}
                                                {/* <TableCell
                                                    onClick={() => {
                                                        setCustomer(client)
                                                        setModal(true)
                                                    }} 
                                                    sx={{
                                                        alignItems: 'center', 
                                                        cursor: 'pointer',
                                                        // justifyContent: 'center',
                                                        display: 'flex',
                                                        columnGap: 5,
                                                        "&:hover" : {
                                                            backgroundColor: "#00667E",
                                                            color: "#fff"
                                                        }
                                                    }}
                                                >
                                                    Change  
                                                </TableCell> */}
                                                <TableCell
                                                    
                                                    sx={{
                                                        '&:hover': {backgroundColor: '#00667E', color: "#FFFFFF", cursor: "pointer"}
                                                    }}
                                                    onClick={() => {
                                                        setToBlockCustomer(client)
                                                        setToBlockModal(true)
                                                    }}
                                                >
                                                    {/* <Button
                                                        aria-describedby={popId}
                                                        open={popOverIsOpen}
                                                        onClick={(event) => {
                                                            setPopOverIsOpen(true)
                                                            setAncEl(event.currentTarget)
                                                        }}
                                                    > */}
                                                        Unblock
                                                    {/* </Button> */}
                                                    {/* <Popover
                                                        id={popId}             
                                                        anchorEl={ancEl} 
                                                        open={popOverIsOpen}
                                                        onClose={handlePopOverClose}                  
                                                        anchorOrigin={{
                                                            vertical: 'bottom',
                                                            horizontal: 'left',
                                                        }}
                                                        PaperProps={{
                                                            style: {
                                                                boxShadow: '0px 0px 10px #00000010'
                                                            }
                                                        }} 
                                                    >
                                                        <Stack p={1}>
                                                            <Button

                                                                style={{textAlign: "left"}}
                                                            >
                                                                Block
                                                            </Button>
                                                            <Button
                                                                onClick={() => {
                                                                    setCustomer(client)
                                                                    setModal(true)
                                                                }}
                                                            >
                                                                Change Password
                                                            </Button>
                                                        </Stack>
                                                    </Popover> */}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper> 
                    
                    <Modal
                        onClose={() => {
                            setToBlockModal(false)
                            setToBlockCustomer(null)
                        }}
                        open={toBlockModal}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 2,
                            maxWidth: 300,
                            margin: '0 auto',
                            textAlign: 'center',
                        }}
                    >
                        <Stack 
                            padding={2}
                            borderRadius={2}
                            bgcolor='#FFF'  
                            spacing={1}
                        >
                            <Typography variant='h5'>Unblock Customer</Typography>
                            <Stack spacing={1}>
                                <Divider />
                                <Typography variant='h6'>Please confirm to unblock {customer?.name} </Typography>
                                <Divider />
                            </Stack>
                            <Stack>
                                <Button 
                                    onClick={() => {
                                        setToBlockCustomer(null)
                                        setToBlockModal(false)
                                        setToBlockCustomer(null)
                                    }}
                                >Cancel</Button>
                                <LoadingButton
                                    // sx={{
                                    //     backgroundColor: '#00667E',
                                    //     color: "#FFFFFF",
                                    //     "&:hover": {
                                    //         color: "#FF0000"
                                    //     }
                                    // }}
                                    loading={blocking}
                                    loadingIndicator="Unblocking..."
                                    color='primary'
                                    onClick={async() => {
                                        setBlocking(true)
                                        const { error } = await supabase.from('customers').update({is_block: false}).eq('user_id', toBlockCustomer?.user_id)
                                        if(error){
                                            setBlocking(false)
                                            alert(error.message)
                                            return 
                                        }

                                        setFiltered(prev => prev.filter(cu => cu.user_id != toBlockCustomer.user_id))
                                        setCustomers(prev => prev.filter(cu => cu.user_id != toBlockCustomer.user_id))
                                        
                                        setBlocking(false)
                                        setToBlockModal(false)
                                        dispatch(toggleSnackBar({
                                            isOpen: true,
                                            message: "Customer Unblocked!",
                                            type: "success",
                                            color: "#00667E"
                                        }))
                                        setTimeout(() => {
                                            dispatch(toggleSnackBar({
                                                isOpen: false,
                                                message: "Customer Customer Unblocked!",
                                                type: "success",
                                                color: "#00667E"
                                            }))
                                        }, 3000)

                                    }}
                                >Confirm</LoadingButton>
                            </Stack>
                        </Stack>
                    </Modal>
                </Box>
            </LayoutAdmin>
        </>
    )
}
