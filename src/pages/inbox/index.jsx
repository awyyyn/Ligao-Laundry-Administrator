import React from 'react';
import LayoutAdmin from '../layouts/adminlayout';
import { Box, Grid, IconButton, Typography, Drawer, Stack, Divider, Input,  } from '@mui/material'
import { ChevronLeft, ChevronRight,  Inbox,  Send } from '@mui/icons-material'
import { useState } from 'react';
import { supabase } from '@/supabase';
import { useEffect } from 'react';

export default function Index() {   
    const [customers, setCustomers] = useState([]);
    const [drawerState, setDrawerState] = useState(true);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [messages, setMessages] = useState([]);
    const [err, setErr] = useState(false);
    const [message, setMessage] = useState('');

    async function getCustomersName () {    
        const { data } = await supabase.from('customers').select('*'); 
        setCustomers(data);
    }   

    
    async function getMessages() {
        const { data } = await supabase.from('message_channel').select().eq('sender_id', id).order('created_at', {ascending: false});
 
        setMessages(data);
    }
    
    useEffect(() => {
        getMessages()
    });

 
    
    useEffect(() => {   
        getCustomersName(); 

        const subs = supabase.channel('any')
            .on('postgres_changes', { event: '*', schema : 'public', table: "message_channel"}, (payload) => {
                console.log(payload)
                setMessages(pre => [payload.new, ...pre]) 
            }).subscribe(); 
            
        return () => supabase.removeChannel(subs);

    }, []);

    // useEffect(() => {
    //     async function getUnreadMessage() {
    //         const { data } = await supabase.from("message_channel").select('*', {count: 'exact', head: true});
    //     }

    // }, []); 


    /* FUCNTION FOR READ / UNREAD MESSAGE SENT BY ADMIN */ 
    // if(err) return <LayoutAdmin><h1>Network Error</h1></LayoutAdmin>

    /* SEND MESSAGE FUNCTION */
    const sendMessage = async() => {
        if(message == "") return  
        const {data, error} = await supabase.from('message_channel').insert({sender_id: id, recipent_id: 'admin', message: message}).select();
        console.log(data)
        console.log(error?.details)
        setMessage('');
    }

    return (
        <LayoutAdmin>  
            <Drawer 
                variant='persistent'
                open={drawerState}
                onClose={() => setDrawerState(false)}
                anchor='right'
                style={{right: 0, position: 'absolute', overflow: 'hidden', zIndex: 7, paddingTop: '60px'}}
            >
                <Box height='100vh' overflow='auto' width='250px' position='relative' display='flex' flexDirection='column'> 
                    <Typography width='100%'  sx={{paddingLeft: 1,position: 'absolute', top: 0, fontSize: '1.8rem', zIndex: 5, marginTop: '60px', borderBottom: '1px solid rgba(0, 41, 51, 0.2)'}}>Chats</Typography>
                   
                    <Stack sx={{marginTop: 'calc(60px + 3rem)'}} direction='column'  >
                        {customers.map((customer) => {  
                            return(
                                <Typography 
                                    fontSize='1.3rem' 
                                    key={customer.user_id} 
                                    bgcolor={name == customer.name ? 'rgba(0, 41, 51, 0.1)' : ''}
                                    sx={{
                                        cursor: 'pointer', 
                                        '&:hover': {
                                            bgcolor: 'rgba(0, 41, 51, 0.1)'
                                        }, 
                                        paddingX: 1, 
                                        paddingY: 1,  
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: '400'
                                    }} 
                                    onClick={() => {
                                        setId(customer.user_id);
                                        setName(customer.name); 
                                    }}
                                >
                                    {customer.name}
                                    {/* <span 
                                        style={{
                                            color: '#ffffff', 
                                            backgroundColor: 'rgba(255, 0, 0, 0.8)', 
                                            paddingInline: 9, 
                                            fontSize: '17px', 
                                            borderRadius: '100%', 
                                            marginBlock: 'auto',
                                            fontSize
                                        }}
                                    >   
                                        {}
                                    </span> */}
                                </Typography>       
                            )
                        })} 
                    </Stack>
                </Box>
            </Drawer> 
            

            <Grid container height='100%' width={`${drawerState ? 'calc(100% - 250px)' : '100%'}`} sx={{transition: 'all 0.5s ease-in-out'}}>
                <Grid item xs={12}  height='4rem' >
                    <Box  
                        height='100%' 
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingLeft: 3,
                            boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)'
                        }}
                        
                    >
                        <Typography sx={{textOverflow: 'ellipsis', minWidth:  '100', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                            {name}
                        </Typography>
                        <IconButton onClick={() => setDrawerState(!drawerState)}>
                            {drawerState ? <ChevronRight /> : <ChevronLeft   />}
                        </IconButton>
                    </Box>
                </Grid> 

                {!id ? 
                    <Box 
                        sx={{
                            display: 'grid',
                            placeItems: 'center',
                            height: 'calc(100% - 4rem)',
                            width: '100%', 
                        }}
                    >
                        <Inbox sx={{height: 200, width: 200, color: '#00667E'}} />
                    </Box>
                    :
                    ( 
                        <Grid
                            item 
                            xs={12} 
                            sx={{
                                height: 'calc(100% - 4rem)',
                                position: 'relative',   
                            }}
                        >     
        
                            <Box sx={{height: '90%', overflow: 'hidden'}}>
                                <Stack  sx={{overflow: 'auto', p: 1, height: '100%', display: 'flex', flexDirection: 'column-reverse', }}>
                                    {messages.map((message) => {

                                        return( 
                                            <Box 
                                                key={message.id}  
                                                display="flex"
                                                width='100%' 
                                                marginY={2}
                                                sx={{justifyContent: message.name ? 'flex-start' : 'flex-end'}}
                                                >
                                                <Typography 
                                                    key={message.id}  
                                                    sx={{
                                                        px: 2, 
                                                        py: 1, 
                                                        borderRadius: 20,
                                                        backgroundColor: message.name ? "rgba(0, 102, 126, 0.85)" : "rgba(0, 102, 126, 0.7)",
                                                        color: 'white',
                                                        boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.3)"
                                                    }}
                                                >
                                                    {message.message}
                                                </Typography> 
                                            </Box>
                                        )
                                    })
                                        
                                    }
                                </Stack>
                            </Box>
                            <Box sx={{height: '10%', borderTop: '1px solid rgba(0, 0, 0, 0.2)', display: 'flex', position: 'relative'}}>
                                <Input 
                                    sx={{fontSize: '2rem', width: '100%', paddingX: 2, paddingRight: 6, overflow: 'auto'}} 
                                    onKeyDown={(e) => e.key == "Enter" && sendMessage()} 
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder='...'
                                    value={message}
                                    />
                                <Send 
                                    sx={{height: '100%', position: 'absolute', zIndex: 5, right: 5, width: 40, "&:hover": {color: '#00667E', cursor: 'pointer'}}}
                                    onClick={() => sendMessage()}
                                    />
                            </Box>
                        
                        </Grid>
                    )
                }


            </Grid>
        </LayoutAdmin>
    )
}
