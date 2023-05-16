import { Alert, Snackbar as Snack } from "@mui/material";
import theme from "@/customization";

export default function Snackbar({
    message,
    duration,
    isOpen,
    handleClose,
    type, 
    color
}) {
    return (
        <Snack
            sx={{
                position: "absolute", 
                zIndex: 5,   
            }}
            open={isOpen}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            onClose={handleClose}
            autoHideDuration={duration} 
        >
            <Alert sx={{backgroundColor: color }} severity={type} variant="filled" onClose={handleClose}>
                {message}
            </Alert>
        </Snack>
    )
}
