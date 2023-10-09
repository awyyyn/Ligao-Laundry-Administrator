import { Box, Divider, Grid, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs } from "@mui/material";
import LayoutAdmin from "../layouts/adminlayout";
import { TabContext, TabPanel } from "@mui/lab";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase";
import { FinishModal } from "@/components"; 

 
export default function Index() {
    
    const [tab, setTab] = useState('0');
    const [walkinLoading, setWalkinLoading] = useState(true);
    const [walkinData, setWalkinDta] = useState({
        length: 0,
        data: []
    });
    const [finishModal, setFinishModal] = useState(false);
    const [finishData, setFinishData] = useState();
    const [bookedData, setBookedData] = useState({ 
        length: 0,
        data: []
    });

    const walkInLaundries = async() => {
        const { data, error } = await supabase.from("laundries_table")
            .select()
            .match({'user_id': "walkin", status: 'washing'})
            error && console.log( error) 
            setWalkinDta(prevData => ({
                data,
                length: data && data.length
            }));
            setWalkinLoading(false);
    } 

    const bookedLaundries = async() => {
        const { data, error } = await supabase.from("laundries_table")
            .select()
            .or('and(user_id.neq.walkin,status.eq.washing)')
        setBookedData((prevData) => ({data, length: data && data.length}));
    }
   

    useEffect(() => {
        walkInLaundries();
        bookedLaundries(); 
        
        const subscription = supabase.channel('any')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'laundries_table'}, (payload) => {
                if(tab == 0){
                    walkInLaundries();
                }else{
                    bookedLaundries();
                }
            })
            .subscribe();

            return () => supabase.removeChannel(subscription);

    }, [tab])

    const tblHeadStyle = {backgroundColor: "#00667E", color: '#FFFFFF'}

    return (
        <LayoutAdmin>  
            <Box sx={{padding: 2, }}> 
                <FinishModal 
                    isOpen={finishModal}
                    handleClose={() => setFinishModal(false)}
                    data={finishData}
                    handleFinish={async(id, user_id, type) => {
                        await supabase.from('laundries_table').update({'status': 'done'}).eq('id', id);
                        await supabase.from('notification')
                            .insert({
                                notification_title: 'ready', 
                                notification_message: `Your ${type} is ready to pick in Ligao Laundry.`, 
                                recipent_id: user_id
                            })
                          
                        setFinishModal(false)
                    }}
                />
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
                                        <TableCell sx={tblHeadStyle}>Finish</TableCell> 
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {  
                                        walkinLoading ? (
                                            <TableRow>
                                                <TableCell>Loading...</TableCell>
                                            </TableRow>
                                        ) : (
                                            !walkinData.length ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} sx={{textAlign: 'center'}}>No Laundry</TableCell>
                                                </TableRow>
                                            ) : (
                                                walkinData.data.map(laundry => (
                                                    <TableRow key={laundry.id}>
                                                        <TableCell style={{textTransform: 'capitalize'}}>{laundry.name}</TableCell>
                                                        <TableCell>{laundry.service_type}</TableCell>
                                                        <TableCell>₱  {laundry.price}</TableCell> 
                                                        <TableCell>{laundry.status}...</TableCell> 
                                                        <TableCell
                                                            onClick={() => {
                                                                setFinishData(laundry);
                                                                setFinishModal(true);
                                                            }}
                                                            sx={{
                                                                '&:hover': {backgroundColor: '#00667E', color: "#FFFFFF", cursor: "pointer"}
                                                            }}
                                                        >Finish</TableCell>
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
                                    <TableCell sx={tblHeadStyle}>Finish</TableCell> 
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                { 
                                    !bookedData.length ? (
                                        <TableRow>
                                                <TableCell colSpan={5} sx={{textAlign: 'center'}}>No Laundry</TableCell>
                                        </TableRow>
                                    ) : (
                                        bookedData.data.map(laundry => (
                                            <TableRow key={laundry.id}>
                                                <TableCell style={{textTransform: 'capitalize'}}>{laundry.name}</TableCell>
                                                <TableCell>{laundry.service_type}</TableCell>
                                                <TableCell>₱  {laundry.price}</TableCell> 
                                                <TableCell>{laundry.status}...</TableCell> 
                                                <TableCell 
                                                    sx={{cursor: 'pointer'}}
                                                    color="#00667E" 
                                                    onClick={async() => {
                                                        setFinishData(laundry)
                                                        setFinishModal(true)
                                                    }}
                                                >
                                                    Done
                                                </TableCell> 
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
