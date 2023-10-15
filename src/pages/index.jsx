 
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { Backdrop } from '@/components'; 
import { Box, Button, Grid, Paper, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import LayoutAdmin from './layouts/adminlayout';
import Image from 'next/image';
import heroimg from '/public/images/hero.jpg'  
import Footer from '@/components/Footer';  
import GroupIcon from '@mui/icons-material/Group';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import { supabase } from '@/supabase';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); 
  const [isLoadingLogout, setisLoadingLogout] = useState(false);
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    clients: [],
    totalClients: "",
    pending: "",
    allLaundries: "", 
    doneLaundries: ""
  })

  const getAllData = async function() {
    const { data, count } = await supabase.from('customers').select();
    const { data: clients } = await supabase.from('laundries_table').select('status')

    
    console.log(data) 
    const pendingData = clients.filter(i => i.status == "washing").length
    const doneData = clients.filter(i => i.status == "done").length

    setData(prev => ({
      ...prev,
      totalClients: data.length,
      allLaundries: clients.length,
      doneLaundries: doneData,
      pending: pendingData,
      clients: data?.slice(0, 5)
    }));
    setLoading(false);
  }

  useEffect(() => { 

    getAllData()
    setisLoadingLogout(false);
    const item = localStorage?.getItem('sb-yuvybxqtufuikextocdz-auth-token'); 
    if(item === null){
      router.push('/auth/login')
    }else{
      setIsLoading(false);
    } 
  }, [router]);
  

  if(isLoading) {return <Backdrop isOpenBD={isLoading} />}
  

  return (
    <LayoutAdmin> 
      <Backdrop isOpenBD={isLoadingLogout} />
      <Box minHeight='600px' height={{xs: '100vh', sm: '100vh'}} width='100%' sx={{ position: 'relative'}}>
        {/* <Typography variant='subtitle1' sx={{position: 'absolute', left: 30, top: 20}}>/ Dashboard</Typography> */}
        <Image alt='hero' priority fill  src={heroimg} style={{position: "absolute", boxShadow: '0px 3px 3px gray', objectFit: 'cover'}} />
        <div style={styles.overlay}></div>
        <div style={styles.heroContent}>
          <Typography sx={{mt: 3, fontSize: {xs: '30px', sm: '40px', md: '50px', lg: '70px'}}} color={'white'}>Ligao Laundry</Typography>
          <Typography sx={{mt: 3, textAlign: 'justify', lineHeight: '30px', wordSpacing: '10px', fontSize: {xs: '17px', md: '20px', lg: '25px'}, whiteSpace: 'normal', textIndent: '1.5em'}} color={'white'}>
            Welcome to Ligao Laundry, your trusted destination for impeccable cleanliness. Our cutting-edge technology, eco-friendly practices, and expert staff ensure your garments receive the utmost care. Experience convenience, efficiency, and unmatched quality as we redefine the way you think about laundry.
          </Typography>
          <Link href='#customers-container'>
            <Button /* onClick={() => router.push('/add-laundry')} */ variant='outlined' sx={{mt: 3, color: 'white',  border: '1px solid white', '&:hover': { border: '1px solid white'}}} >Continue...</Button>
          </Link>
        </div>
      </Box> 
      <Box id="customers-container" style={{ minHeight: '600px'}} paddingY={10} rowGap={10}>
        <Grid container justifyContent='space-around' rowSpacing={5}>
          <Grid item xs={10} sm={5} md={3}>
            <Paper elevation={5} style={{padding: 15}}>
            {loading ? 
              <>
                <Stack justifyContent='space-between' mb={2} direction='row'>
                  <Skeleton width="80%" height='40px' variant='rectangular' />
                  <Skeleton variant='circular' height='40px' width='40px' />
                </Stack>
                <Skeleton width="100%" height="60px" variant='rectangular'  />
              </> :
              <>
                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                  <Typography>Pending Laundries</Typography>
                    <LocalLaundryServiceIcon  style={{fontSize: '50px'}} />
                </Stack>
                <Typography variant="h3">{data.pending} <span style={{color: 'gray', fontSize: '30px'}}>/ {data.allLaundries}</span></Typography>
              </>
            }
            </Paper>
          </Grid>
          <Grid item xs={10} sm={5} md={3}>
            <Paper elevation={5} style={{padding: 15}}>
              {loading ? 
                <>
                  <Stack justifyContent='space-between' mb={2} direction='row'>
                    <Skeleton width="80%" height='40px' variant='rectangular' />
                    <Skeleton variant='circular' height='40px' width='40px' />
                  </Stack>
                  <Skeleton width="100%" height="60px" variant='rectangular'  />
                </> :
                <>
                  <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                    <Typography>Laundry Completed</Typography>
                    <GroupIcon  style={{fontSize: '50px'}} />
                  </Stack>
                  <Typography variant="h3">{data.doneLaundries}</Typography>
                </>
              }
            </Paper>
          </Grid>
          <Grid item xs={10} sm={5} md={3}>
            <Paper elevation={5} style={{padding: 15}}>
              {loading ? 
                <>
                  <Stack justifyContent='space-between' mb={2} direction='row'>
                    <Skeleton width="80%" height='40px' variant='rectangular' />
                    <Skeleton variant='circular' height='40px' width='40px' />
                  </Stack>
                  <Skeleton width="100%" height="60px" variant='rectangular'  />
                </> :
                <>
                  <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                    <Typography>Total Customers</Typography>
                    <LocalLaundryServiceIcon  style={{fontSize: '50px'}} />
                  </Stack>
                  <Typography variant="h3">{data.totalClients}</Typography>
                </>
              }
            </Paper>
          </Grid>
        </Grid>
        
        <Box  paddingX={{xs: 3, md: 6}} mt={5}>
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems="center"
          >
            <Typography sx={{marginBottom: 3, marginTop: 5}} variant="h4">Customers</Typography>
            <Typography variant='h5' sx={{"&:hover": {textDecoration: "underline", cursor: "pointer"}}} onClick={() => router.push('/customers')}>See all</Typography>
          </Stack>
          <Paper overflow="hidden">
            <TableContainer sx={{maxHeight: 500}}>
              <Table stickyHeader>
                <TableHead >
                  <TableRow >
                    <TableCell className="table-header">#</TableCell>
                    <TableCell className="table-header">Name</TableCell>
                    <TableCell className="table-header">Contact</TableCell>
                    <TableCell className="table-header">Address</TableCell>
                    <TableCell className="table-header">Email</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? 
                    <>
                      {[0, 1, 2, 3, 4, 5].map(i => (
                        <TableRow key={i} >
                          <TableCell colSpan={5} padding={0}>
                            <Skeleton width="100%" height='50px' />
                          </TableCell>
                        </TableRow>
                      ))}  
                    </> :
                    data.clients.map((client, i) => (
                      <TableRow key={client?.user_id}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell sx={{minWidth: 200, textTransform: "capitalize"}}>{client?.name}</TableCell>
                        <TableCell>{client?.phone}</TableCell>
                        <TableCell sx={{minWidth: 200, textTransform: 'capitalize'}}>{client?.address}</TableCell>
                        <TableCell>{client?.email ? client.email : ""}</TableCell>
                        {/* <TableCell>{new Date(client.created_at)}</TableCell> */}
                      </TableRow>
                    ))
                  }
                   
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>
      <Footer />
    </LayoutAdmin>
  )
}
 
export const styles = {
  overlay: {
    position: 'absolute',
    zIndex: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    height: '100%',
    width: '100%', 
  },
  heroContent: {
    zIndex: 5,
    p: 10,
    position: 'absolute',
    top: '15%',
    left: '10%' , 
    width: '80%',
  }
}