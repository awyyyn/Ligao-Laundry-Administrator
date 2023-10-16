import React, { Suspense, useEffect, useState } from 'react'
import LayoutAdmin from '../layouts/adminlayout'
import { Box, Button, Divider, Grid, Modal, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material'
import { TableBar } from '@mui/icons-material'
import { supabase } from '@/supabase'
import Head from 'next/head' 
import { LoadingButton } from '@mui/lab'
import { Snackbar } from '@/components'
import { useDispatch } from 'react-redux'
import { toggleSnackBar } from '@/slices/uxSlice'

export default function ToPickUp() {
    const [records, setRecords] = useState([])
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [filtered, setFiltered] = useState([]);
    const [toPick, setToPick] = useState(null);
    const dispatch = useDispatch()
    const [modal, setModal] = useState(false);

    async function getRecords() {
        setIsLoading(true);
        const { data } = await supabase.from('laundries_table').select().or('and(user_id.neq.walkin,status.eq.done)')
        setIsLoading(false);
        setRecords(data)
    }

    useEffect(() => {
        getRecords();  
        const subscription = supabase.channel("any")
            .on("postgres_changes", { event: "*", schema: "public", table: "laundries_table" }, (payload => {
                getRecords();
            }))
            .subscribe()

        return () => subscription.unsubscribe()

    }, []); 

    
    useEffect(() => {
 
        setFiltered(records?.filter(book => String(book?.name).toLowerCase().includes(String(search).toLowerCase()) ));

    }, [search])

    const titleCell = ['Name', 'Type of Service', 'Phone', 'Price', 'Kg', 'Date', 'Pick up?'];
  

    return ( 
        <LayoutAdmin> 
            <Grid container height='100%' width={{xs: '100vw', sm: 'calc(100vw - 250px)'}} position='relative' > 
                <Box marginX={{sm: 0, md: 3}} marginTop={3} marginBottom={5} width='inherit' paddingBottom={8}  > 
                    <div style={{marginInline: 10  }}>
                        <TextField 
                            sx={{mb: 3, float: 'right', minWidth: "350px"}}
                            size='small' 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search" variant="outlined"
                        />
                        <TableContainer sx={{maxHeight: '600px', boxShadow: '0px 2px 8px #00667E30', borderRadius: 1, overflow: 'hidden', }}  >
                            <Table stickyHeader  >
                                <TableHead >
                                    <TableRow >
                                        {titleCell.map((title) => (
                                            <TableCell key={title} sx={{bgcolor: '#00667E', color: '#FFFFFF', fontWeight: "800"}}>
                                                {title}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody> 
                                    { isLoading ?
                                        <TableRow>
                                            <TableCell align='center' sx={{fontWeight: 'semibold'}} colSpan={7}>
                                                Loading...
                                            </TableCell>
                                        </TableRow>
                                        : 
                                        records.length < 1 ? 
                                            <TableRow>
                                                <TableCell align='center' sx={{fontWeight: 'semibold'}} colSpan={7}>
                                                    0 record
                                                </TableCell>
                                            </TableRow>
                                        :
                                        records.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage )
                                        .map(record => (
                                            <TableRow key={record.id}>
                                                <TableCell>{record.name}</TableCell>
                                                <TableCell>{record.service_type}</TableCell>
                                                <TableCell>+63{record.phone}</TableCell>
                                                <TableCell>{record.price}</TableCell>
                                                <TableCell>{record.kg ? record.kg : 'N/A'}</TableCell>
                                                <TableCell>{record.date}</TableCell>
                                                <TableCell
                                                    onClick={() => {
                                                        setToPick(record)
                                                        setModal(true)
                                                    }}
                                                    sx={{
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    Confirm
                                                </TableCell>
                                            </TableRow>
                                        )) 
                                    } 
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {/* <TablePagination  
                            rowsPerPage={rowsPerPage} 
                            component="div"
                            count={records.length}
                            onPageChange={(e, newPage) => {
                                setPage(newPage)
                            }}
                            page={page}
                            rowsPerPageOptions={[10, 15, 25]}
                            onRowsPerPageChange={(e) => {
                                setRowsPerPage(e.target.value)
                                setPage(0);
                            }} 
                        /> */}
                        <Modal
                            open={modal}
                            onClose={() => {
                                setModal(false) 
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
                                    <Stack spacing={2}>
                                        <Typography variant="h4">Confirm Pick Up</Typography>
                                        <Divider />
                                        <Typography>Please confirm if the laundry is picked up</Typography>
                                    </Stack>
                 
                                    <Box>
                                        <Button  
                                            fullWidth
                                            // onClick={() => handleClose()}
                                            variant='contained'
                                            sx={{
                                                backgroundColor: '#FF0000',
                                                mb: 1,
                                                '&:hover': { backgroundColor: '#FF0000'},
                                                '&:active': { backgroundColor: '#FF0000'}}}
                                        >Cancel</Button>   
                                        <LoadingButton  
                                            onClick={async() => {
                                                setLoading(true)
                                                // created_at: "2023-10-15T10:31:32.006065+00:00"
                                                // date: "16/10/2023"
                                                // id: "9c2af461-4837-4810-a90b-a98bb16be9b9"
                                                // kg: "1.5"
                                                // name: "Jane Doe"
                                                // phone: 639515292673
                                                // price: "52.5"
                                                // service_type: "Wash"
                                                // status: "washing"
                                                // time: "08:00 AM"
                                                // user_id: "18301a9f-52a4-41e1-
                                                const { data, error } = await supabase
                                                    .from('laundries_table')
                                                    .update({status: ""})
                                                    .eq('id', toPick?.id)

                                                if(error) {
                                                    alert(error.message)
                                                    setLoading(false)
                                                    return
                                                }
                                                setLoading(false)
                                                dispatch(toggleSnackBar({
                                                    isOpen: true,
                                                    message: "Status Updated!",
                                                    type: "success",
                                                    color: "#00667E"
                                                }))
                                                setModal(false)

                                                setTimeout(() => {
                                                    dispatch(toggleSnackBar({
                                                        isOpen: false,
                                                        message: "Status Updated!",
                                                        type: "success",
                                                        color: "#00667E"
                                                    }))
                                                }, 3000) 
                                            }}
                                            fullWidth
                                            variant='contained'
                                            sx={{cursor: 'pointer'}}
                                            loading={loading}
                                            loadingIndicator="Confirming..." 
                                        >Confirm</LoadingButton>
                                    </Box>
                                </Stack>
                            </Box>
                        </Modal>
                    <Snackbar
                        
                    />
                    </div>
                </Box>
            </Grid>
        </LayoutAdmin>
    )
}

