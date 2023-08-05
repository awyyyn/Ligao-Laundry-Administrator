import { AppBar, Box, Grid, Stack, Toolbar, Typography } from '@mui/material'
import React, { Suspense, useState } from 'react'
import {   CustomHead, Navbar } from '@/components' 
import DrawerComponent from '@/components/drawer';
import { closeDrawer } from '../../slices/uxSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function LayoutAdmin({children}) {
    const [isOpen, setIsOpen] = useState(false);
    const drawerWidth = '250px' 
    const { drawerState } = useSelector(state => state.ux)
    const dispatch = useDispatch()

    return (
        <Box display='flex' justifyContent=' evenly' width='100vw' position='relative' >
            {/* SIDE NAV */}
            <CustomHead />
            <Box 
                component='div' 
                onClick={() => dispatch(closeDrawer())} 
                sx={{
                    position: 'absolute', 
                    height: '100vh', 
                    width: '100vw', 
                    zIndex: 2, 
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',  
                    display: {xs: drawerState ? 'block' : 'none', sm: 'none'}
                }} />


            <DrawerComponent width={drawerWidth} variant="persistent" display='block' />   

            <Grid  width='100%'  > 
                <Grid item xs={12}>
                    <Navbar width={drawerWidth}  />
                </Grid>
                <Grid item sm={2} display={{xs: 'none', sm: 'block', md: 'block'}}>
                    <DrawerComponent width={drawerWidth} variant="permanent" display='none' />  
                </Grid>
                <Grid item sm={10} xs={12}  mt='60px' ml={{sm: drawerWidth}} sx={{overflowY: 'hidden'}} onClick={() => dispatch(closeDrawer())}>  
                    <Box sx={{width: '100%', overflowY: 'auto',  }} height={'calc(100vh - 60px)'}>
                        {children}
                    </Box> 
                </Grid>
            </Grid>
            
        </Box>
    )
}
