import { AppBar, Typography, Toolbar, IconButton, Icon, Box, Badge } from "@mui/material"
import { Menu } from '@mui/icons-material'
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { openDrawer } from "../slices/uxSlice.js";
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

export default function Navbar({width}) {
    const [page, setPage] = useState('');
    const router = useRouter();
    const dispatch = useDispatch();
    
    useEffect(() => {
        setPage(router.pathname)
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
                {/* <Box display='flex' columnGap={2}>
                    <IconButton   style={{color: '#FFFFFF'}} >
                        <Badge
                            color="error"
                            badgeContent={1}
                        >
                            <NotificationsIcon    />
                        </Badge>
                    </IconButton>
                    <IconButton   style={{color: '#FFFFFF'}} >
                        <Badge
                            color="error"
                            badgeContent={1}
                        >
                            <ChatBubbleIcon    />  
                        </Badge>
                    </IconButton>
                </Box> */}
            </Toolbar>
        </AppBar> 
    )
}
