import { Drawer, ListItem as ListI, ListItemText, Typography, Divider, Tooltip, ListItemIcon, ListItemButton, ListSubheader, List, Box } from "@mui/material"
import Image from "next/image"
import { CheckBox, CheckBoxTwoTone, Checklist, ChevronLeft, Dashboard, FolderCopy, Inbox, LocalLaundryService, Logout } from "@mui/icons-material";
import { useRouter } from "next/router";
import theme from "@/customization";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import { closeDrawer } from "../slices/uxSlice.js";
import Link from "next/link";
import { supabase } from "@/supabase/index.js";

const DrawerComponent = ({width, variant, display}) => {
    const router = useRouter();
    const { drawerState } = useSelector((state) => state.ux); 
    const dispatch = useDispatch();
    const ListItem = styled(ListI)(({ theme }) => ({
        color:  '#00667E',
        '&:hover ': {
            color: 'white',
            backgroundColor: '#00667E'
        }
    }))
    
    const active_link = {
        color: 'white',
        backgroundColor: '#00667E',
        '&:hover ': {
            color: 'white',
            backgroundColor: theme.palette.primary.dark
        }
        
    }

    const links = [
        {
            name: 'Dashboard',
            path: '/',
            icon: <Dashboard color='inherit' />
        },  
        {
            name: 'Inbox',
            path: '/inbox',
            icon: <Inbox color="inherit" />
        },
        {
            name: "Add Laundry",
            path: '/add-laundry',
            icon: <LocalLaundryService />
        }, 
        {
            name: "Laundries",
            path: '/laundries',
            icon: <Checklist />
        },
        {
            name: "Records",
            path: '/records',
            icon: <FolderCopy />
        }
    ]
    return (
        <Drawer 
            sx={{
                display: {xs: display, sm: 'block'},
                '& .MuiDrawer-paper': {
                    boxShadow: '2px 0px 3px rgba(0, 0, 0, 0.2)',
                    backgroundColor: 'whitesmoke',
                    width, 
                    // alignItems: 'center', 
                }
            }}   
            open={variant == 'permanent' ? true : drawerState}
            variant={variant} 
        >
            <List sx={{display: 'flex', flexDirection: 'column', height: '100%', minHeight: '600px', position: 'relative'}}  >
                <ListSubheader disableGutters  sx={{/* display: {xs: 'none', sm: 'block'} */}} > 
                    <ListItemText sx={{fontSize: 30, }} >
                        <Typography fontSize={30} textAlign='center' fontWeight='bold' color='#00667E'>Ligao Laundry</Typography> 
                    </ListItemText>  
                </ListSubheader>
                {/* <ListI sx={{height: '7vh', display: {xs: 'flex', sm: 'none'}}}>
                    
                </ListI> */}
                <Divider />
                <Divider />
                <ListI  sx={{display: 'flex', justifyContent: 'center', mb: 2  }} > 
                    <Box height={150} width={150} position='relative' >
                        <Image 
                            style={{position: 'absolute', borderRadius: 150, boxShadow: `0px 2px 5px ${theme.palette.primary.dark}`}}
                            fill
                            priority
                            alt="logo"
                            src='/images/icon.png'
                        />
                    </Box>
                </ListI>
                <Divider />
                {links.map((link) => {
                    return(
                        <Link key={link.path} href={link.path} >
                            <ListItem disablePadding onClick={() => setTimeout(() => {dispatch(closeDrawer())}, 500)} >
                                <ListItemButton sx={router.pathname == link.path ? active_link : {}}>
                                    <Tooltip title={link.name} >
                                        <ListItemIcon sx={{ color: 'inherit'}} >{link.icon}</ListItemIcon>
                                    </Tooltip>
                                    <ListItemText>{link.name}</ListItemText>
                                </ListItemButton>
                            </ListItem>
                        </Link>
                    )
                })} 
    
                <ListItem sx={{position: 'absolute', bottom: 0}} disablePadding onClick={async() => { 
                    await supabase.auth.signOut();
                    router.push('/auth/login');
                }}>
                    <ListItemButton >
                        <ListItemIcon ><Logout sx={{ color: 'red'}} /></ListItemIcon>
                        <ListItemText style={{color: 'red'}}>
                            Logout 
                        </ListItemText>
                    </ListItemButton>
                </ListItem> 
            </List>
        </Drawer>
    )
}

export default DrawerComponent  