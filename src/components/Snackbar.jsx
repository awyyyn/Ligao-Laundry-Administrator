import { Alert, Snackbar as Snack } from "@mui/material"; 
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Snackbar() {

    const { snackbar } = useSelector(state => state.ux)
 

    return (
        <Snack
            sx={{
                position: "absolute", 
                zIndex: 999999,   
            }}
            open={snackbar.isOpen}
            // style={{}}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            autoHideDuration={3000} 
            
        >
            <Alert sx={{backgroundColor: snackbar.color }} severity={snackbar.type} variant="filled"> 
                {snackbar.message}
            </Alert>
        </Snack>
    )
}
