import { Box } from '@mui/material'
import React from 'react'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import Image from 'next/image';

export default function Success() {
    return (
        <>
            <div className='container'>
                <div> 
                    <VerifiedUserIcon 
                        color='#00667E'
                        htmlColor='#00667E'
                        sx={{fontSize: {xs: 100, md: 200, }}}
                    />
                    <h3 className='success__h4'>Your Password has been reset</h3>
                    <h1>Successfully</h1> 
                </div>
            </div>
            
            <Box position={"absolute"} right={{xs: -30, md: -60}} bottom={{xs: -50, md: -120}}  zIndex={-1} style={{opacity: 0.4}} >
                <Box position="relative" minHeight="250px" minWidth="250px" width={{xs: "250px", md: "500px"}} height={{xs: "250px", md: "500px"}} overflow={"hidden"} borderRadius="100%">
                    <Image src="/images/adaptive-icon.png" alt="Background" fill style={{objectFit: 'contain', position: "absolute"}} />
                </Box>
            </Box>
        </>
    )
}
