
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
import { RuleForm } from '@/pages/Forms/Rule';
import { useParams } from "react-router-dom";
import { NobreakService } from "@/core/services/nobreak";
import { RuleService } from "@/core/services/rules";
import { useApi } from "@/core/services/api";
import { IRule } from "@/core/types/rule";
import { Box, Grid } from "@mui/joy";
import SquareFootIcon from '@mui/icons-material/SquareFoot';

export const RuleCard = (props: { rule: IRule | undefined }) => {
    const { id } = useParams();
    const { api } = useApi();
    const { data: nobreak, refetch: getNobreak } = NobreakService.useGetNobreakById(id);
    const [showModal, setShowModal] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [deleteResponse, setDeleteResponse] = useState<any>({});
    const [deleteResponseAlert, setDeleteResponseAlert] = useState<any>();
    const [selectedId, setSelectedId] = useState<string>("");
    const { data: rule, refetch: getRule } = RuleService.useGetRuleById(selectedId);

    useEffect(() => {
        if (id != undefined) {
            getNobreak();
        }
    }, [])
    useEffect(() => {
        if (props?.rule?.id != undefined) {
            setSelectedId(props?.rule?.id.toString());
        }
    }, [props?.rule])
    // useEffect(() => {
    //     if (nobreak?.id) {
    //         setSelectedId(nobreak?.id.toString());
    //     }
    // }, [nobreak])

    useEffect(() => {
        if (selectedId != rule?.id && selectedId != "")
            getRule();
    }, [selectedId]);

    const deleteRule = () => {
        setLoadingDelete(true);
        api.delete("/rule/" + rule?.id)
            .then((res: any) => {
                setDeleteResponse(res.data);
                if (res.data.success) {
                    setDeleteResponseAlert(<Alert severity="success">{res.data.message}</Alert>);
                } else {
                    setDeleteResponseAlert(<Alert severity="error"><AlertTitle>{res.data.message}</AlertTitle>{res.data.error}</Alert>);
                }
                setLoadingDelete(false);
            })
            .catch((error: any) => {
                setDeleteResponseAlert(<Alert severity="error">Failed to delete rule!</Alert>);
                setLoadingDelete(false);
            })
    }
    const closeModal = () => {
        setShowModal(false);
        // props.fetchRules();
    }

    return (
        rule &&
        <>
            <Modal
                size="sm"
                show={showModal}
                setShow={setShowModal}
                title="Delete rule"
                text={`Are you sure you want to delete rule "${rule?.name}"`}
                actions={
                    <>
                        <Button onClick={() => closeModal()}>Close</Button>
                        {deleteResponse?.success != true &&
                            <LoadingButton
                                onClick={() => deleteRule()} color="error"
                                loading={loadingDelete}
                                variant="outlined"
                            >
                                <span>Delete</span>
                            </LoadingButton>

                            // <Button onClick={() => deleterule()} color="error">
                            //     Delete
                            // </Button>
                        }
                    </>
                }
            >
                {deleteResponseAlert}
            </Modal>
            <Card>
                <CardActionArea onClick={() => console.log(`/nobreak/`)}>
                    <CardContent>
                        <Grid container spacing={1}>
                            <Grid md={10}>
                                <Box>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {rule?.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {rule?.description}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid md={2}>
                                <SquareFootIcon color="info" sx={{ width: '100%', height: '100%' }} />
                            </Grid>
                        </Grid>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <RuleForm rule={rule} edit />
                    <IconButton
                        aria-label="delete rule"
                        color="error"
                        onClick={() => setShowModal(true)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </CardActions>
            </Card>
        </>
    );
};