import React from 'react'
import LayoutAdmin from '../layouts/adminlayout'
import { Grid, TextField } from '@mui/material'

export default function Index() {
    return (
        <LayoutAdmin>
            <Grid container height='100%' width='calc(100vw - 250px)'>
                <Grid item xs={12} sx={{display: 'grid', placeItems: 'center', padding: 10}}>
                    <TextField 

                        label="Price"
                        disabled
                        fullWidth 
                        sx={{marginInline: 50}} 
                        />
                </Grid>
            </Grid>
        </LayoutAdmin>
    )
}
