import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { useNavigate, useParams } from "react-router-dom";
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
import { Accordion, AccordionDetails, AccordionGroup, AccordionSummary, Box, Grid, Modal, ModalClose, ModalDialog } from '@mui/joy';
import { useApi } from '@/core/services/api';
import { AxiosResponse } from 'axios';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { MachineService } from '@/core/services/machines';
import Loading from '../Loading';
import GaugeComponent from '../GaugeComponent';
import { SensorService } from '@/core/services/sensor';
import { GridExpandMoreIcon } from '@mui/x-data-grid';
import RulesDashboard from '../RulesDashboard';
import { NobreakService } from '@/core/services/nobreak';

export const MachineCard = (props: any) => {

    const { id } = useParams();
    const machine = props.machine;
    const { data: nobreak } = NobreakService.useGetNobreakById(id);
    const queryClient = useQueryClient();
    const { data: sensor, isFetching } = SensorService.useGetData();
    const [showModalDelete, setShowModalDelete] = useState(false);
    const { mutate: wolMachine, isPending: loadingWol } = MachineService.usePostWolMachine(machine.id);
    const { mutate: shutdownMachine, isPending: loadingShutdown } = MachineService.usePostShutdownMachine(machine.id);
    const [showModal, setShowModal] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [deleteResponseAlert, setDeleteResponseAlert] = useState<any>();
    const { api } = useApi();
    const navigate = useNavigate();

    const deleteMachine = () => {
        setLoadingDelete(true);
        api.delete("/machine/" + machine.id)
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
    const machineRule = machine?.ruleId == "inherit" ? nobreak?.rule : machine?.rule;
    return (
        machine &&
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
                            Are you sure you want to delete machine "{machine?.name}""
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
            </Modal>
            <Modal
                open={showModal}
                onClose={closeModal}
                aria-labelledby="change-machine-modal-title"
                aria-describedby="change-machine-modal-description"
            >
                <ModalDialog size="lg" sx={{ width: "90%" }}>
                    <ModalClose />
                    <form>
                        <Box sx={{ display: 'flex' }}>
                            <Typography
                                style={{ fontSize: "42px", textAlign: "center", marginRight: '40px' }}
                            >
                                {machine?.name}
                            </Typography>
                            <MachineForm machine={machine} edit />
                            <IconButton
                                aria-label="delete machine"
                                color="error"
                                onClick={() => setShowModalDelete(true)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                        <hr />
                        <Grid container spacing={2}>
                            <Grid md={12}>
                                <RulesDashboard rule={machineRule} machine={machine} />
                            </Grid>
                            <Grid md={12} sx={{textAlign: "center", mt: 3}}>
                            <hr />
                                <LoadingButton
                                    sx={{mr: 2}}
                                    onClick={() => shutdownMachine()} color="error"
                                    loading={loadingShutdown}
                                    variant="outlined"
                                >
                                    <PowerSettingsNewIcon />
                                    <span>Shutdown</span>
                                </LoadingButton>
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