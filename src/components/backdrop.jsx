import { Backdrop as Backd, CircularProgress } from '@mui/material'
import React from 'react'
import theme from '@/customization'

export default function Backdrop({isOpenBD}) {
    return (
        <Backd
            sx={{
                color: "white", 
                zIndex: 9999999,
                backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }}
            open={isOpenBD}
        >
            <CircularProgress color='inherit' />
        </Backd>
    )
}
