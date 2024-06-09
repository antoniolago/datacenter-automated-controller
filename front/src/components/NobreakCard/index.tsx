import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions, FormHelperText, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { NobreakForm } from '@/pages/Forms/Nobreak';
import { useApi } from '@/core/services/api';
import { Grid, Modal, ModalClose, ModalDialog } from '@mui/joy';
import DeleteNobreakModal from '../DeleteNobreakModal';

export const NobreakCard = (props: any) => {
    const { api } = useApi();
    const [showModal, setShowModal] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [deleteResponseAlert, setDeleteResponseAlert] = useState<any>({});

    const navigate = useNavigate();

    const deleteNobreak = () => {
        setLoadingDelete(true);
        api.delete("/nobreak/" + props.nobreak.id)
            .then((res: any) => {
                if (res.data.success) {
                    setDeleteResponseAlert(<Alert severity="success">Nobreak deleted successfully</Alert>);
                } else {
                    setDeleteResponseAlert(<Alert severity="error"><AlertTitle>{res.data.message}</AlertTitle>{res.data.error}</Alert>);
                }
                setLoadingDelete(false);
            })
            .catch((error: any) => {
                setDeleteResponseAlert(<Alert severity="error">Failed to delete nobreak!</Alert>);
                setLoadingDelete(false);
            })
    }
    const closeModal = () => {
        setShowModal(false);
        props.fetchNobreaks();
    }
    return (
        <>
            <Card>
                <CardActionArea onClick={() => navigate(`/nobreak/${props.nobreak.id}`)}>
                    {/* <CardMedia
                component="img"
                height="140"
                image="/static/images/cards/contemplative-reptile.jpg"
                alt="green iguana"
                /> */}
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {props.nobreak.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {props.nobreak.description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <NobreakForm nobreak={props.nobreak} edit />
                    <DeleteNobreakModal
                        nobreak={props.nobreak}
                        deleteResponseAlert={deleteResponseAlert}
                    />
                    {/* <Button size="small" color="error">
                        Delete
                    </Button> */}
                </CardActions>
            </Card>
        </>
    );
}