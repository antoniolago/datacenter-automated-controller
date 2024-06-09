import { Paper } from "@mui/material";

const ContentContainer = (props: any) => {
    return(
        <>
            {/* <Abas abas={props.abas} /> */}
            {/* <Abas /> */}
            <Paper elevation={3} className="p-3">
                {props.children}
            </Paper>
        </>
    );
}

export default ContentContainer;