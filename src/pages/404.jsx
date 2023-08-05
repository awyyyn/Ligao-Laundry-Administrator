import { ArrowRight } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material'
import Head from 'next/head';   
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'

function NotFound() {
  return (
    <Box className="not-found">
      <Head>
        <title>Page Not Found</title>
      </Head> 
      <Box padding={10} display='flex' flexDirection='column' sx={{alignItems: 'center'}} >
        <Typography sx={{fontSize: {xs: 60, sm: 80}}}>Oooopppss!</Typography>
        <Typography 
          className='f404' 
          sx={{
            fontSize: {xs: 150, sm: 200},
            fontWeight: '800'
          }}
          >
          404
        </Typography>
        <Typography variant='h5'>
          Page not Found!
        </Typography>
        <Link href='/' >
          <div className='go-to-dashboard'>
            <Typography>
              Go back to dashboard
            </Typography>
            <ArrowRight  />
          </div>
        </Link>
      </Box>
    </Box>
  )
}

export default NotFound
