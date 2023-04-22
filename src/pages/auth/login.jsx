'use client';
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useRouter } from "next/router";  
import theme, { PrimaryBTN } from "../customization";
import { Box, Stack, TextField, Typography } from "@mui/material";
import Image from "next/image";
import { Backdrop, Snackbar } from "../components";
import { Formik } from "formik";
import * as yup from 'yup';

export default function Home () { 
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isExist, setIsExist] = useState(true);
  const [message, setIsMessage] = useState(false);
 
  useEffect(() => {
    const item = localStorage.getItem('sb-yuvybxqtufuikextocdz-auth-token');  
    if(item){ 
      router.push('/')
    }else{
      setIsExist(false)
    }

  }, [router])

  if(isExist) return <Backdrop isOpenBD={isExist} />

  const validationSchema = yup.object({
    email: 
      yup.string()
      .required('Email Required!')
      .email('Invalid Email Format!'),
    password: 
      yup.string()
      .required('Password Required!')
      .min(6, "Password is too short!")
  })

  const handleClose = () => {
    setIsOpen(false)
  }

  return (  
    <Box
      width='100%'  
      height='100vh' 
      position='relative' 
      display="flex"
      alignItems="center"
      justifyContent='center' 
    >
      <Backdrop 
        isOpenBD={isLoading}
      />
      <Snackbar 
        duration={5000}
        isOpen={isOpen}
        handleClose={handleClose}
        type="error" 
        color="red"
        message={message}
      />
      <Box width='100%' height='100%' position='absolute' bgcolor='rgba(0, 102, 126, 0.1)' zIndex={1} sx={{backdropFilter: 'blur(100px)'}} />
      <Box   
        borderTop='1px solid rgba(0, 102, 126, 0.1)'
        overflow='hidden'
        borderRadius={5}
        boxShadow='0px 5px 6px rgba(0, 102, 126, 0.2)'
        position='absolute' 
        width={{xs: '95%', sm: '95%', md: '60%'  }}
        height='70%'  
        display='flex' 
        justifyContent='space-between' 
        zIndex={2} 
      > 
        <Box height='100%' width="100%" position='relative' overflow="hidden" display={{xs: 'none', sm: 'flex'}}>
          <Image 
            fill
            alt="logo"
            src="/images/adaptive-icon.png"
          />
        </Box>
        <Box width="100%"  display='flex' justifyContent='center' bgcolor="rgba(255, 255, 255, 0.8)" alignItems='center'> 
          <Formik
            initialValues={{
              email: '',
              password: ''
            }} 
            validateOnBlur={false}
            validationSchema={validationSchema}
            onSubmit={async(values) => {
              /* CHECK THE USER IS ONE OF THE ADMINISTRATOR */
              setIsLoading(true);
              const { data, error } = await supabase.from('administrator').select().eq('email', values.email);
              if(data.length < 1) {
                setIsLoading(false);
                setIsOpen(true)
                return setIsMessage("Unauthorized User!")
              }
              if(error){
                setIsLoading(false);
                setIsOpen(true)
                return setIsMessage(error.message)
              }
              const { data: adminData, error: adminError } = await supabase.auth.signInWithPassword({
                email: values.email,
                password: values.password
              });

              if(adminError?.message){
                setIsLoading(false);
                setIsOpen(true)
                return setIsMessage(adminError.message) 
              }
              console.log(adminData)
              router.push('/'); 
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              handleReset,
              touched,
              values
            }) => {
              return(  
                <Stack width='80%' spacing={4}>
                  <Typography 
                    color='primary' 
                    variant="h3" 
                    textAlign='center' 
                    fontWeight='bold' 
                  >Login</Typography>
                  <TextField 
                    label="Email"  
                    error={errors.email && true}
                    onChange={handleChange('email')} 
                    onBlur={handleBlur('email')} 
                    helperText={errors.email && errors.email} 
                    name="email"
                    value={values.email}
                  />
                  <TextField 
                    label="Password" 
                    type="password"
                    error={errors.password  && true}
                    onChange={handleChange('password')}  
                    onBlur={handleBlur('password')}
                    helperText={errors.password && errors.password}  
                    name="password"
                    value={values.password}
                  />
                  <PrimaryBTN size="large"  onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Signin'}
                  </PrimaryBTN>
                  
                </Stack>
              )
            }}
          </Formik>
        </Box>
      </Box>
    </Box>
  )
}; 