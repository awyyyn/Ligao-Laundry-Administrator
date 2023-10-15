import React, { useEffect, useMemo, useState } from 'react'
import LayoutAdmin from '../layouts/adminlayout'
import { Box, Button, Modal, Paper, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { Snackbar } from '@/components';
import { supabase, supabaseAdmin } from '@/supabase';
import { Lock } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { toggleSnackBar } from '@/slices/uxSlice';

export default function Customers() {

    const dispatch = useDispatch();
    const [initLoading, setInitLoading] = useState(true);
    const [customers, setCustomers] = useState([]);
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
     
    // console.log(customer)

    useEffect(() => {
        (async () => {
        
            const { data, count, error } = await supabase.from('customers').select();  
            // console.log(data)

            if(error) {
                setInitLoading(false)
                return alert(error.message);
            }
            
            setCustomers(data)
            setInitLoading(false)
            setFiltered(data)

        })()


    }, []);

    useMemo(() => {
        setFiltered(customers?.filter(item => String(item?.name).toLowerCase().includes(search.toLowerCase())) || String(item?.address).toLowerCase().includes(search.toLowerCase()))
    }, [search])

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
                                        <TableCell className="table-header">Email</TableCell>
                                        <TableCell className="table-header" 
                                                style={{
                                                    alignItems: 'center', 
                                                    // justifyContent: 'center',
                                                    display: 'flex',
                                                    columnGap: 5
                                                }}>Password <Lock /></TableCell>
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
                                            <TableCell>{client?.email ? client.email : ""}</TableCell> 
                                            <TableCell
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
                </Box>
            </LayoutAdmin>
        </>
    )
}
