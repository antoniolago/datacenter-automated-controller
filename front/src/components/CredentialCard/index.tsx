
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import React, { useEffect, useState, useContext } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import IconButton from '@mui/material/IconButton';
import { Modal } from '../Modal';
import { CredentialForm } from '@/pages/Forms/Credential';
import { useApi } from "@/core/services/api";
import { ICredential } from "@/core/types/credential";
import { Box, Grid } from "@mui/joy";
import KeyIcon from '@mui/icons-material/Key';

export const CredentialCard = (props: any) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [deleteResponse, setDeleteResponse] = useState({});
    const [deleteResponseAlert, setDeleteResponseAlert] = useState();
    const [credential, setCredential] = useState<ICredential>();
    const { api } = useApi();
    useEffect(() => {
        if (props.id != undefined) {
            api.get('/credential/' + props.id).then((res) => {
                setCredential(res.data);
            });
        }
    }, [props.id]);

    useEffect(() => {
        if (props.credential) setCredential(props.credential);
    }, [props.credential]);

    const deleteCredential = () => {
        setLoadingDelete(true);
        api.delete("/credential/" + credential?.id)
            .then((res) => {
                setDeleteResponse(res.data);
                setLoadingDelete(false);
            })
            .catch((error) => {
                setLoadingDelete(false);
            })
    }
    const closeModal = () => {
        setShowDeleteModal(false);
        props.fetchCredentials();
    }

    return (
        <>
            <Modal
                size="sm"
                show={showDeleteModal}
                setShow={setShowDeleteModal}
                title="Delete credential"
                text={`Are you sure you want to delete credential "${credential?.name}"`}
                actions={
                    <>
                        <Button onClick={() => closeModal()}>Close</Button>
                        {/* {deleteResponse?.success != true &&
                            <LoadingButton
                                onClick={() => deleteCredential()} 
                                color="error"
                                loading={loadingDelete}
                                variant="outlined"
                            >
                                <span>Delete</span>
                            </LoadingButton>
                        } */}
                    </>
                }
            >
                {deleteResponseAlert}
            </Modal>
            {credential &&
                <Card >
                    <CardActionArea onClick={() => console.log(`/nobreak/`)}>
                        <CardContent>
                            <Grid container spacing={1}>
                                <Grid md={10}>
                                    <Box>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {credential.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            User: {credential.user}<br />
                                            {/* Password {credential.password} */}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid md={2}>
                                    <KeyIcon color="warning" sx={{width: '100%', height: '100%'}}/>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <CredentialForm credential={credential} edit />
                        <IconButton
                            aria-label="delete credential"
                            color="error"
                            onClick={() => setShowDeleteModal(true)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </CardActions>
                </Card>
            }
        </>
    );
};