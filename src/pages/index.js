import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { Backdrop } from './components';
import { supabase } from './supabase';
import { Button } from '@mui/material';
import LayoutAdmin from './layouts/adminlayout';

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); 
  const [isLoadingLogout, setisLoadingLogout] = useState(false)
  const [session, setSession] = useState(null);
  const [message, setMessage] = useState('');

  

  useEffect(() => { 
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
      <div>
        <Backdrop isOpenBD={isLoadingLogout} />
        HomePage
        <Button onClick={async () => {
          setisLoadingLogout(true)
          await supabase.auth.signOut();
          router.push('/auth/login')
        }}>
          Logout
        </Button>
        <p>lorem</p>
        <p>loremasd</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
        <p>lorem</p>
      </div>
    </LayoutAdmin>
  )
}
