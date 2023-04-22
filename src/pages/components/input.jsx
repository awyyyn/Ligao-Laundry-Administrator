import { TextField } from '@mui/material'
import React from 'react'

export default function input({variant, color}) {
    return (
        <TextField
            variant={variant}
            color={color}
            size='small'
        />
    )
}
