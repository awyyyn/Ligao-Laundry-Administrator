import { Snackbar, colors, createTheme } from "@mui/material";
import * as React from 'react';
import { Button } from '@mui/material';
import { styled } from "@mui/material/styles";



const theme = createTheme({
    palette: {
        primary: {
            light: '#00a7cc',
            main: '#00667e', 
            dark: '#002a33',
        }, 
        Whitecolor: {
            light: '#FFFFFF',
            main: '#f6f6f6',
            dark: '#d0d0d0'
        }
    }
});

const PrimaryBTN = styled(Button)(({ theme }) => ({
    color: "white",
    
    backgroundColor: theme.palette.primary.main,
    '&:hover, .MuiButton-root ': {
        color: theme.palette.primary.main, 
        border: '1px solid', 
    },
    '&:focus, .MuiButton-root ': {
        color: '#FFFFFF', 
        border: '1px solid', 
    },
    
    
}));

const SnackInfo = styled(Snackbar)(({theme}) => ({
    
}))

export { PrimaryBTN }
export default theme