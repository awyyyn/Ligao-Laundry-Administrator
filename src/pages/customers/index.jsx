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
    const [toBlockCustomer, setToBlockCustomer] = useState(null)
    const [filtered, setFiltered] = useState([]);
    const [customer, setCustomer] = useState(null);
    const [toBlockModal, setToBlockModal] = useState(false);
    const [modal, setModal] = useState(false);
    const [blocking, setBlocking] = useState(false);
    const [search, setSearch] = useState('');
    const [passs, setPasswords] = useState({
        password: "",
        password2: ""
    });
    const [updateingPassword, setUpdatingPassword] = useState(false);
    const [passwordErrors, setPasswordError] = useState({
        password: "",
        password2: ""
    });
     
    // console.log(customer)

  
    const getInitData = async () => {
    
        const { data, count, error } = await supabase.from('customers').select().neq('is_block', true);  
        // console.log(data)

        if(error) {
            setInitLoading(false)
            return alert(error.message);
        }
        
        setCustomers(data)
        setInitLoading(false)
        setFiltered(data)

    }
    useEffect(() => {

        
        getInitData();

        const subscription = supabase.channel('any').on('postgres_changes', { event: "*", schema: "public", table: "customers"}, p => {
            getInitData()
        }).subscribe();

        return ()  => subscription.unsubscribe()


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

    console.log(toBlockCustomer) 
    
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
                                        <TableCell 
                                            className="table-header"
                                            style={{
                                                alignItems: 'center', 
                                                // justifyContent: 'center',
                                                width: '100%',
                                                display: 'flex',
                                                columnGap: 5, 
                                            }}>Actions</TableCell>  
                                        <TableCell 
                                            className="table-header">
                                            Block
                                        </TableCell>
                                    </TableRow> 
                                </TableHead>
                                <TableBody>
                                    {initLoading ? 
                                        <>
                                        {[0, 1, 2, 3, 4, 5].map(i => (
                                            <TableRow key={i} >
                                                <TableCell colSpan={7} padding={0}>
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
                                                    onClick={() => {
                                                        setCustomer(client)
                                                        setPopOverIsOpen(false) 
                                                        setModal(true)
                                                    }}
                                                    sx={{textAlign: "left", cursor: "pointer", "&:hover": {backgroundColor: "#00667E", color: "#FFFFFF"}}}
                                                >  
                                                    Change Password 
                                                </TableCell>
                                                <TableCell
                                                    onClick={() => {
                                                        setToBlockCustomer({
                                                            name: client?.name,
                                                            user_id: client?.user_id
                                                        });
                                                        setPopOverIsOpen(false) 
                                                        setToBlockModal(true)
                                                    }}
                                                    sx={{textAlign: "left", cursor: "pointer", "&:hover": {backgroundColor: "#00667E", color: "#FFFFFF"}}}
                                                > 
                                                    Block
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                    <Modal
                        open={modal}
                        onClose={() => {
                            setModal(false)
                            setPasswordError({
                                password: "",
                                password2: ""
                            });
                            setPasswords({
                                password: "",
                                password2: ""
                            })
                        }}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 10,
                        }}
                    >
                        <Box>
                            <Stack
                                padding={5}
                                borderRadius={2}
                                bgcolor='#FFF' 
                                spacing={5}
                            >
                                <Typography variant={'h5'}>Change {customer?.name} Password</Typography>
                                <TextField 
                                    label="New Password"
                                    value={passs.password} 
                                    onChange={(e) => setPasswords(p => ({...p, password: e.target.value}))}
                                    helperText={passwordErrors.password}
                                    error={passwordErrors.password ? true : false}
                                    type='password'
                                    />
                                <TextField 
                                    type='password'
                                    name="passowrd2"
                                    label="Confirm Password"
                                    value={passs.password2}
                                    onChange={(e) => setPasswords(p => ({...p, password2: e.target.value}))}
                                    helperText={passwordErrors.password2}
                                    error={passwordErrors.password2 ? true : false}
                                />
                                <Button 
                                    onClick={async() => {
                                        setPasswordError({
                                            password: "",
                                            password2: ""
                                        });
                                        setUpdatingPassword(true);
                                        if(passs.password.length < 6) { 
                                            setPasswordError(p => ({...p, password: "Password must be at least 6 characters"}))
                                        }
                                        if(passs.password != passs.password2){ 
                                            setPasswordError(p => ({...p, password2: "Password does not match!"}))
                                        }

                                        if(passs.password.length < 6 || (passs.password != passs.password2)) {
                                            setUpdatingPassword(false)
                                            console.log(passwordErrors)
                                            return
                                        }

                                        setPasswordError({
                                            password: "",
                                            password2: ""
                                        });
                                        
                                        const { error } = await supabaseAdmin.auth.admin.updateUserById(customer?.user_id, {
                                            password: passs.password2
                                        });

                                        if(error){
                                            console.log(error)
                                            // alert(error.message)
                                            dispatch(toggleSnackBar({
                                                isOpen: true,
                                                message: error.message,
                                                type: "error",
                                                color: "#FF0000"
                                            }))
                                            setTimeout(() => {
                                                dispatch(toggleSnackBar({
                                                    isOpen: false,
                                                    message: "Password Updated!",
                                                    type: "success",
                                                    color: "#00667E"
                                                }))
                                            }, 3000)
                                            return 
                                        }

                                        dispatch(toggleSnackBar({
                                            isOpen: true,
                                            message: "Password Updated!",
                                            type: "success",
                                            color: "#00667E"
                                        }))
                                        setModal(false) 
                                        setPasswords({
                                            password: "",
                                            password2: ""
                                        })
                                        setTimeout(() => {
                                            dispatch(toggleSnackBar({
                                                isOpen: false,
                                                message: "Password Updated!",
                                                type: "success",
                                                color: "#00667E"
                                            }))
                                        }, 3000)
                                    }}
                                    disabled={updateingPassword || passwordErrors.password || passwordErrors.password || !passs.password || !passs.password2 ? true : false}
                                    
                                >   
                                    {updateingPassword  ? "Updating Password" : "Update Password"}  
                                </Button>
                            </Stack>
                        </Box>
                    </Modal>
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
                            <Typography variant='h4'>Block Customer</Typography>
                            <Stack spacing={1}>
                                <Divider />
                                <Typography variant='h6'>Please confirm to block {customer?.name} </Typography>
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
                                    loadingIndicator="Blocking..."
                                    color='primary'
                                    onClick={async() => {
                                        setBlocking(true)
                                        const { error } = await supabase.from('customers').update({is_block: true}).eq('user_id', toBlockCustomer?.user_id)
                                        if(error){
                                            setBlocking(false)
                                            alert(error.message)
                                            return 
                                        }

                                        
                                        setBlocking(false)
                                        dispatch(toggleSnackBar({
                                            isOpen: true,
                                            message: "Customer blocked!",
                                            type: "success",
                                            color: "#00667E"
                                        }))
                                        setToBlockModal(false)
                                        setTimeout(() => {
                                            dispatch(toggleSnackBar({
                                                isOpen: false,
                                                message: "Customer blocked!",
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
