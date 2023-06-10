import { Box, Divider, Grid, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs } from "@mui/material";
import LayoutAdmin from "../layouts/adminlayout";
import { TabContext, TabPanel } from "@mui/lab";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase";

 
export default function Index() {
    
    const [tab, setTab] = useState('0');
    const [walkinLoading, setWalkinLoading] = useState(true);
    const [walkinData, setWalkinDta] = useState({
        length: 0,
        data: []
    });
    const [bookedData, setBookedData] = useState({ 
        length: 0,
        data: []
    });

    const walkInLaundries = async() => {
        const { data, error } = await supabase.from("laundries_table")
            .select()
            .eq('user_id', "walkin")
            error && console.log( error) 
            setWalkinDta(prevData => ({
                data,
                length: data.length
            }));
            setWalkinLoading(false);
    } 

    const bookedLaundries = async() => {
        const { data, error } = await supabase.from("laundries_table")
            .select()
            .neq('user_id', "walkin")
        setBookedData((prevData) => ({data, length: data.length}));
    }

    console.log(typeof walkinData)
    console.log(walkinData)
    useEffect(() => {
        walkInLaundries();
        bookedLaundries();
    }, [])

    const tblHeadStyle = {backgroundColor: "#00667E", color: '#FFFFFF'}

    return (
        <LayoutAdmin> 
            <Box sx={{padding: 5}}> 
                <TabContext value={tab}>
                    <Tabs value={tab} onChange={(e, index) => setTab(index)}  >
                        <Tab label="Walkin Laundries" value={'0'} />
                        <Tab label="Booked Laundries" value={'1'} />
                    </Tabs> 
                    <Divider />
                    <TabPanel value={'0'}>
                        <TableContainer component={Paper} >
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={tblHeadStyle}>Name</TableCell>
                                        <TableCell sx={tblHeadStyle}>Service Type</TableCell>
                                        <TableCell sx={tblHeadStyle}>Price</TableCell> 
                                        <TableCell sx={tblHeadStyle}>Status</TableCell> 
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {  
                                        walkinLoading ? (
                                            <TableRow>
                                                <TableCell>LOADING...</TableCell>
                                            </TableRow>
                                        ) : (
                                            !walkinData.length ? (
                                                <TableRow>
                                                    <TableCell>ZERO</TableCell>
                                                </TableRow>
                                            ) : (
                                                walkinData.data.map(laundry => (
                                                    <TableRow key={laundry.id}>
                                                        <TableCell>{laundry.name}</TableCell>
                                                        <TableCell>{laundry.service_type}</TableCell>
                                                        <TableCell>₱  {laundry.price}</TableCell> 
                                                        <TableCell>{laundry.status}...</TableCell> 
                                                    </TableRow>
                                                ))
                                                
                                            )
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                    <TabPanel value={'1'}>
                    <TableContainer component={Paper} >
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={tblHeadStyle}>Name</TableCell>
                                    <TableCell sx={tblHeadStyle}>Service Type</TableCell>
                                    <TableCell sx={tblHeadStyle}>Price</TableCell> 
                                    <TableCell sx={tblHeadStyle}>Status</TableCell> 
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                { 
                                    !bookedData.length ? (
                                        <TableRow>
                                            <TableCell>ZERO</TableCell>
                                        </TableRow>
                                    ) : (
                                        bookedData.data.map(laundry => (
                                            <TableRow key={laundry.id}>
                                                <TableCell>{laundry.name}</TableCell>
                                                <TableCell>{laundry.service_type}</TableCell>
                                                <TableCell>₱  {laundry.price}</TableCell> 
                                                <TableCell>{laundry.status}...</TableCell> 
                                            </TableRow>
                                        )) 
                                    ) 
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    </TabPanel>
                </TabContext>
            </Box>
        </LayoutAdmin>
    )
}
