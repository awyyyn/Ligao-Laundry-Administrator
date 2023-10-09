'use client';
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/supabase";
import { useRouter } from "next/router";  
import theme, { PrimaryBTN } from "@/customization";
import { Box, Button, Backdrop as BackD, Fade, Modal, Stack, TextField, Typography } from "@mui/material";
import Image from "next/image";
import { Backdrop, CustomHead, Snackbar } from "@/components";
import { Formik } from "formik";
import * as yup from 'yup'; 
import Head from "next/head"; 
import { useDispatch } from "react-redux";
import { toggleSnackBar } from "@/slices/uxSlice";

export default function Home () { 
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isExist, setIsExist] = useState(true);
  const [forgotEmail, setForgotEmail] = useState('')
  const [openModal, setOpenModal] = useState(false);
  const [message, setIsMessage] = useState(false);
  const dispatch = useDispatch();

  const handleForgotEmail = (e) => setForgotEmail(e?.target.value) 
 
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

  const closeSnackBar = setTimeout((param1, param2) => dispatch(toggleSnackBar({isOpen: false, message, type: param1, color: param2})), 3000)

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
      minHeight='700px'
    >  
      <CustomHead />
      <Backdrop 
        isOpenBD={isLoading}
      />

      <Snackbar  
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
        maxHeight='500px'
        maxWidth={{xs: '500px', sm: '800px'}}
        sx={{minHeight: '480px'}}  
        display='flex' 
        justifyContent='space-between' 
        zIndex={2} 

      > 
        <Box height='100%' width="100%" position='relative' overflow="hidden" display={{xs: 'none', sm: 'flex'}}>
          <Image 
            fill
            alt="logo"
            src="/images/adaptive-icon.png"
            style={{objectFit: 'cover'}}
          />
        </Box>
        <Box width="100%"  display='flex' justifyContent='center' bgcolor="rgba(255, 255, 255, 0.8)" alignItems='center'> 
          <Box display={{xs: 'block', sm: 'none'}} position='absolute' height='100%' width="100%"> 
            <Image 
              alt="logo"
              src="/images/adaptive-icon.png"
              loading="lazy"  
              height={200}
              width={200}

              style={{
                borderRadius: '100%',
                zIndex: -1,
                position: 'absolute',
                bottom: -50,
                right: -20
              }}
            />

          </Box>
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
                dispatch(toggleSnackBar({
                  isOpen: true,
                  message: "Unauthorized User!",
                  type: "error",
                  color: "#FF0000"
                }))
                setIsMessage("Unauthorized User!")
                return closeSnackBar("error", "#FF0000")
              }
              if(error){
                setIsLoading(false);
                setIsOpen(true)
                dispatch(toggleSnackBar({
                  isOpen: true,
                  message: error.message,
                  type: "error",
                  color: "#FF0000"
                }))
                setIsMessage(error.message)
                return  closeSnackBar("error", "#FF0000")
              }
              const { error: adminError } = await supabase.auth.signInWithPassword({
                email: values.email,
                password: values.password
              }); 

              if(adminError?.message){
                setIsLoading(false);
                setIsOpen(true) 
                dispatch(toggleSnackBar({
                  isOpen: true,
                  message: adminError.message,
                  type: "error",
                  color: "#FF0000"
                }))
                setIsMessage(adminError.message)
                return  closeSnackBar("error", "#FF0000")
              }
              

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
                <>
                
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
                    <Stack direction={'column'} spacing={1}>
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
                      <button 
                        onClick={() => setOpenModal(true)}
                        className="forgot-password"
                      >
                        Forgot Password?
                      </button>
                    </Stack>
                    <PrimaryBTN size="large"  onClick={handleSubmit} disabled={isLoading}>
                      {isLoading ? 'Signing in...' : 'Signin'}
                    </PrimaryBTN>  
                  </Stack>
                </>
              )
            }}
          </Formik>
        </Box>
      </Box>
      {/* =========================== MODAL ============================ */}
      <Modal

        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModal}
        onClose={() => setOpenModal(false)}
        closeAfterTransition
        slots={{ backdrop: BackD }}
        slotProps={{
          backdrop: {
            timeout: 300, 
          },
        }}
      >
        <Fade in={openModal}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Reset Password
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              Enter the email associated with your account and we&apos;ll send an email with instructions to reset your password.
            </Typography>
            <TextField
              type="email"
              value={forgotEmail}
              onChange={(e) => handleForgotEmail(e)}
              fullWidth
              sx={{mt: 3}}
              placeholder="your_email@gmail.com"
            />
            <Button
              variant="contained"
              fullWidth
              sx={{my: 3}}
              onClick={async() => {
                const { error, data } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
                  redirectTo: 'https://ligao-laundry.vercel.app/resetpassword'
                })
                if(error) {
                  
                }
              }}
            >
              Reset Password
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Box>
  )
}; 


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper', 
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  border: "none",
  outline: "none"
};