import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { MachineForm } from '@/pages/Forms/Machine';
import { Box, Grid, Modal, ModalClose, ModalDialog } from '@mui/joy';
import { useApi } from '@/core/services/api';
import { AxiosResponse } from 'axios';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { MachineService } from '@/core/services/machines';
import Loading from '../Loading';

export const MachineCard = (props: any) => {
    const queryClient = useQueryClient();
    const [showModalDelete, setShowModalDelete] = useState(false);
    const { mutate: wolMachine, isPending: loadingWol } = MachineService.usePostWolMachine(props.machine.id);
    const { mutate: shutdownMachine, isPending: loadingShutdown } = MachineService.usePostShutdownMachine(props.machine.id);
    const [showModal, setShowModal] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [deleteResponseAlert, setDeleteResponseAlert] = useState<any>();
    const { api } = useApi();
    const navigate = useNavigate();

    const deleteMachine = () => {
        setLoadingDelete(true);
        api.delete("/machine/" + props.machine.id)
            .then((res: AxiosResponse) => {
                if (res.data.success) {
                    toast.success("Machine deleted successfully");
                } else {
                    toast.error(res.data.message);
                }
                setLoadingDelete(false);
                setShowModalDelete(false);
                queryClient.invalidateQueries({ queryKey: ['machines'] })
            })
            .catch((error: AxiosResponse) => {
                toast.error("Failed to delete machine");
                setLoadingDelete(false);
            })
    }
    const closeModal = () => {
        setShowModalDelete(false);
        setShowModal(false);
    }
    return (
        props?.machine &&
        <>
            <Modal
                open={showModalDelete}
                onClose={closeModal}
                aria-labelledby="change-machine-modal-title"
                aria-describedby="change-machine-modal-description"
            >
                <ModalDialog size="md">
                    <ModalClose />
                    <form>
                        <Typography
                            style={{ fontSize: "17px", textAlign: "center", marginRight: '40px' }}
                        >
                            Are you sure you want to delete machine "{props?.machine?.name}""
                        </Typography>
                        <br />
                        <Grid>
                            <Grid className="my-2">
                                <LoadingButton
                                    onClick={() => deleteMachine()} color="error"
                                    loading={loadingDelete}
                                    variant="outlined"
                                >
                                    <span>Delete</span>
                                </LoadingButton>
                            </Grid>
                        </Grid>
                        {/* {deleteResponseAlert} */}
                        <hr />
                    </form>
                </ModalDialog>
            </Modal><Modal
                open={showModal}
                onClose={closeModal}
                aria-labelledby="change-machine-modal-title"
                aria-describedby="change-machine-modal-description"
            >
                <ModalDialog size="md">
                    <ModalClose />
                    <form>
                        <Box sx={{ display: 'flex' }}>
                            <Typography
                                style={{ fontSize: "42px", textAlign: "center", marginRight: '40px' }}
                            >
                                {props?.machine?.name}
                            </Typography>
                            <MachineForm machine={props?.machine} edit />
                            <IconButton
                                aria-label="delete machine"
                                color="error"
                                onClick={() => setShowModalDelete(true)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                        <br />
                        <Grid container spacing={2}>
                            <Grid md={6}>
                                <LoadingButton
                                    onClick={() => shutdownMachine()} color="error"
                                    loading={loadingShutdown}
                                    variant="outlined"
                                >
                                    <PowerSettingsNewIcon />
                                    <span>Shutdown</span>
                                </LoadingButton>
                            </Grid>
                            <Grid md={6}>
                                <LoadingButton
                                    onClick={() => wolMachine()}
                                    color="success"
                                    loading={loadingWol}
                                    loadingIndicator={<Loading />}
                                    variant="outlined"
                                >
                                    <span>Wake on Lan</span>
                                </LoadingButton>
                            </Grid>
                        </Grid>
                        {/* {deleteResponseAlert} */}
                        <hr />
                    </form>
                </ModalDialog>
            </Modal>
            <Card sx={{ border: '1px solid', borderColor: props?.machine?.isOnline ? 'green' : 'red' }}>
                <CardActionArea onClick={() => setShowModal(true)}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {props?.machine?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {props?.machine?.description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                {/* <CardActions>
                    <MachineForm machine={props?.machine} edit />
                    <IconButton
                        aria-label="delete machine"
                        color="error"
                        onClick={() => setShowModalDelete(true)}>
                        <DeleteIcon />
                    </IconButton>
                </CardActions> */}
            </Card>
        </>
    );
}