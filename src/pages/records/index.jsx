import React, { Suspense, useEffect, useState } from 'react'
import LayoutAdmin from '../layouts/adminlayout'
import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material'
import { TableBar } from '@mui/icons-material'
import { supabase } from '@/supabase'
import Head from 'next/head' 

export default function Records() {
    const [records, setRecords] = useState([])
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(false);

    async function getRecords() {
        setIsLoading(true);
        const { data } = await supabase.from('laundries_table').select().eq('status', '');
        setIsLoading(false);
        setRecords(data)
    }

    useEffect(() => {

        getRecords(); 

    }, []); 
    const titleCell = ['Name', 'Type of Service', 'Phone', 'Price', 'Kg', 'Date'];

      
    return ( 
        <LayoutAdmin> 
            <Grid container height='100%' width={{xs: '100vw', sm: 'calc(100vw - 250px)'}} position='relative' > 
                <Box marginX={{sm: 0, md: 3}} marginTop={3} marginBottom={5} width='inherit' paddingBottom={8}  > 
                    <div style={{boxShadow: '0px 2px 8px #00667E30', borderRadius: 5, overflow: 'hidden', marginInline: 10  }}>
                        <TableContainer sx={{maxHeight: '600px'}}  >
                            <Table stickyHeader  >
                                <TableHead >
                                    <TableRow >
                                        {titleCell.map((title) => (
                                            <TableCell key={title} sx={{bgcolor: '#00667E', color: '#FFFFFF'}}>
                                                {title}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody> 
                                    { isLoading ?
                                        <TableRow>
                                            <TableCell align='center' sx={{fontWeight: 'semibold'}} colSpan={6}>
                                                Loading...
                                            </TableCell>
                                        </TableRow>
                                        : 
                                        records.length < 1 ? 
                                            <TableRow>
                                                <TableCell align='center' sx={{fontWeight: 'semibold'}} colSpan={6}>
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
                                            </TableRow>
                                        )) 
                                    } 
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination  
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
                        />
                    </div>
                </Box>
            </Grid>
        </LayoutAdmin>
    )
}

