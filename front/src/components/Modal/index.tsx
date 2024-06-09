import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export const Modal = (props: any) => {
    // const theme = useTheme();
    return (
        <Dialog open={props.show} onClose={() => props.setShow(false)} maxWidth={props.size} fullWidth={true}>
            <DialogTitle>{props.title}{props.titleActions}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {props.text}
                </DialogContentText>
                <br/>
                {props.children}
            </DialogContent>
            <DialogActions>
                {props.actions}
                {/* <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleClose}>Send</Button> */}
            </DialogActions>
        </Dialog>
    );
}