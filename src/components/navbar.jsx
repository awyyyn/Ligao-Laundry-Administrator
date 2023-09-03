import { AppBar, Typography, Toolbar, IconButton, Icon, Box, Badge, Drawer } from "@mui/material"
import { Menu } from '@mui/icons-material'
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { openDrawer } from "../slices/uxSlice.js";
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { supabase } from "@/supabase/index.js";

export default function Navbar({width}) {
    const [page, setPage] = useState('');
    const router = useRouter();
    const navigate = useRouter();
    const dispatch = useDispatch();
    const [notifications, setNotifications] = useState([]);
    const [isOpenNotificationDrawer, setIsOpenNotificationDrawer] = useState(false)
    const [unreadNotification, setUnreadNotification] = useState(0);

    async function getNotifications() {

        const { data, error } = await supabase
            .from('notification')
            .select()
            .eq('recipent_id', 'admin')
        if(error){
            console.log(error)
            return 
        }
        setNotifications(data)
        console.log("NOTIFICATIOn", data)
    }

    async function getUnreadNotifications() {
        const { data } = await supabase.from('notification').select().eq('is_read', false);

        setUnreadNotification(data.length)
    }

    useEffect(() => {
        setPage(router.pathname) 
        getNotifications()
        getUnreadNotifications()

        const subscription = supabase.channel('any')
            .on('postgres_changes', {event: '*', schema: 'public', table: 'notification'}, (payload => {
                getUnreadNotifications()
                getNotifications()
            }))
            .subscribe();

        return () => subscription.unsubscribe();

    }, [router])


    return (
        <AppBar sx={{width: {xs: '100%', sm: `calc(100% - ${width})`, height: "60px", justifyContent: 'center'} }} >
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}> 
                <Box display={'flex'} alignItems='center'>
                    <IconButton
                        size="large"
                        edge="start"    
                        sx={{ display: {xs: 'block', sm: 'none'}, '&:active ': {backgroundColor: 'rgba(255, 255, 255, 0.1)'}}}
                        onClick={() => dispatch(openDrawer())}
                    >
                        <Menu htmlColor="white" />
                    </IconButton>
                    <Typography color='white'>{page == '/' ? 'DASHBOARD' : page.toLocaleUpperCase().slice(1)}</Typography>
                </Box>
                <Box display='flex' columnGap={2}>
                    <IconButton onClick={() => setIsOpenNotificationDrawer(true)}  style={{color: '#FFFFFF'}} >
                        <Badge
                            color="error"
                            badgeContent={unreadNotification}
                        >
                            <NotificationsIcon    />
                        </Badge>
                    </IconButton>
                    {/* <IconButton   style={{color: '#FFFFFF'}} >
                        <Badge
                            color="error"
                            badgeContent={1}
                        >
                            <ChatBubbleIcon    />  
                        </Badge>
                    </IconButton> */}
                </Box>
            </Toolbar>
            <Drawer 
                onClose={() => setIsOpenNotificationDrawer(false)}
                open={isOpenNotificationDrawer}
                anchor="right"
                sx={{padding: '20px 10px'}}
                > 
                <Box minWidth={300} padding={2}>
                    <h2 style={{marginBottom: 10}}>Notification</h2> 
                    {notifications.length == 0 ?
                        <div>
                            No New Notificaiton
                        </div> :
                        notifications.map((item, i) => { 
                            return (
                                <Box 
                                    key={i}
                                    onClick={async() => {
                                        setIsOpenNotificationDrawer(false)
                                        await supabase.from('notification').update({
                                            is_read: true
                                        }).eq('id', item.id)
                                        if(item.notification_title.includes('message')){ 
                                            navigate.push('/inbox')
                                        }else{
                                            navigate.push('/add-laundry')
                                        }
                                    }}
                                    sx={{
                                        bgcolor: item.is_read ? '#006667E10' : "#00667E",
                                        padding: 2,
                                        color: item.is_read ? "black" : 'white',
                                        cursor: 'pointer',
                                        marginBlock: 1,
                                        border: '1px solid transparent',
                                        '&:hover': {
                                            bgcolor: item.is_read ? '#006667E10' : 'transparent',
                                            color: item.is_read ? "black" : '#00667E',
                                            border: item.is_read ? '' : '1px solid #00667E'
                                        },
                                        outline: 'none'
                                    }}
                                >
                                    {String(item.notification_message).substring(0, 30)}...
                                </Box>
                            )
                        })
                    } 
                    
                </Box>
            </Drawer>
        </AppBar> 
    )
}
