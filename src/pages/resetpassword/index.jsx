'use client' 
import { Box, Button, Grid, TextField, Typography } from "@mui/material"

import Image from 'next/image'
import { useState } from "react"
import { useRouter } from 'next/router'

export default function ResetPassword() { 
    let token;
    const router = useRouter();
    token = router.asPath.split('=')[1]
    token = token?.split('&')[0]
    console.log(router.asPath) 
    

    const [password, setPassword] = useState("");
    const [reTypePass, setReTypePass] = useState("");
    const [err, setErr] = useState({
        passErr: "",
        reTypeErr: ""
    })

    // if(!token && !token?.includes("token_type=bearer&type=recovery") || token?.includes("unauthorized_client")){
    //     return <h1>unauthorized_client</h1>
    // }

    return (
        <Grid container position={'relative'} alignContent={'center'} justifyContent={'center'} sx={{height: '100vh', width: '100%',  overflowY: 'hidden'}}>
            <Grid item position={'relative'} xs={10} sm={8} md={4} lg={3}  >
                <Box  
                    rowGap={{xs: 4, md: 2}} 
                    flexDirection={"column"}    
                    display={'flex'}  
                    sx={{
                        zIndex: 10,
                        position: 'relative',
                        boxShadow: '0 3px 50px rgba(0, 0, 0, 0.13)', 
                        backgroundColor: '#FFFFFF', 
                        padding: {xs: 4, md: 5}, 
                        paddingInline: 3, 
                        borderRadius: 3
                    }}
                >
                    <Typography variant="h4">Reset Password</Typography>
                    <TextField 
                        label="New password" 
                        FormHelperTextProps={{
                            style: {
                                color: "#FF0000"
                            }
                        }}
                        helperText={err.passErr}
                        value={password}
                        error={err.passErr ? true : false}
                        type="password"
                        onChange={(e) => {
                            setPassword(e.target.value)
                            if(e.target.value.length < 6 || e.target.value == ""){
                                if(e.target.value == ""){
                                    setErr((prev) => ({...prev, passErr: "Password can't be empty"}))
                                }else{
                                    setErr((prev) => ({...prev, passErr: "Password  must be at least 6 characters"}))
                                }
                            }else{
                                setErr((prev) => ({...prev, passErr: ""}))
                                if(e.target.value == reTypePass) setErr(prev => ({...prev, reTypeErr: ""}))
                            }
                        }}
                    />
                    <TextField  
                        label="Re-type password" 
                        type="password"
                        helperText={err.reTypeErr}
                        error={err.reTypeErr ? true : false}  
                        value={reTypePass} 
                        disabled={!password || err.passErr}
                        onChange={(e) => {
                            setReTypePass(e.target.value)
                            if(e.target.value.length > 5){
                                if(e.target.value !== password){
                                    setErr(prev => ({...prev, reTypeErr: "Password does not match"}))
                                }else{ 
                                    setErr(prev => ({...prev, reTypeErr: ""}))
                                }
                            }else{
                                setErr(prev => ({...prev, reTypeErr: "Password does not match"}))
                            }
                        }}
                        
                    />
                    <Button variant="contained" disabled={err.reTypeErr}>
                        Reset
                    </Button>
                </Box>
                <Box display={{xs: 'none', md: 'block'}} className="box box1"></Box>
                <Box display={{xs: 'none', md: 'block'}} className="box box2"></Box>
            </Grid>
            <Box position={"absolute"} right={{xs: -30, md: -60}} bottom={{xs: -50, md: -120}}  zIndex={-1} style={{opacity: 0.4}} >
                <Box position="relative" minHeight="250px" minWidth="250px" width={{xs: "250px", md: "500px"}} height={{xs: "250px", md: "500px"}} overflow={"hidden"} borderRadius="100%">
                    <Image src="/images/adaptive-icon.png" alt="Background" fill style={{objectFit: 'contain', position: "absolute"}} />
                </Box>
            </Box>
        </Grid>
    )
}
