import { Alert, Snackbar as Snack } from "@mui/material"; 
import { useSelector } from "react-redux";

export default function Snackbar() {

    const { snackbar } = useSelector(state => state.ux)

    return (
        <Snack
            sx={{
                position: "absolute", 
                zIndex: 5,   
            }}
            open={snackbar.isOpen}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            autoHideDuration={5000} 
        >
            <Alert sx={{backgroundColor: snackbar.color }} severity={snackbar.type} variant="filled"> 
                {snackbar.message}
            </Alert>
        </Snack>
    )
}
