
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import React, { createContext, useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { yupResolver } from "@hookform/resolvers/yup";
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { TextField, createTheme, FormHelperText, MenuItem, FormLabel } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import EditIcon from '@mui/icons-material/Edit';
import * as Yup from "yup";
import { RuleInput } from "@/components/RuleInput";
import { CredentialInput } from "@/components/CredentialInput";
import { useApi } from "@/core/services/api";
import { AppSettingsService } from "@/core/services/appsettings";
import Loading from "@/components/Loading";
import { IMachine } from "@/core/types/machine";
import { DialogActions, ModalClose, ModalDialog, Typography, Modal } from "@mui/joy";
import { AxiosError, AxiosResponse } from "axios";
import { useQueryClient } from "@tanstack/react-query";

export const MachineForm = (props: any) => {
    const { api } = useApi();
    const [loading, setLoading] = useState(false);
    const { data: appSettings } = AppSettingsService.useGetAppSettings();
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [alert, setAlert] = useState<any>();
    const queryClient = useQueryClient();
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        description: Yup.string().required("Description is required"),
        host: Yup.string().required("Host is required"),
        mac: Yup.string().required("MAC is required"),
    });
    const defaultValuesObj = {
        id: props.machine?.id || 0,
        name: props.machine?.name || '',
        description: props.machine?.description || '',
        host: props.machine?.host || '',
        mac: props.machine?.mac || '',
        ruleId: props.machine?.inheritRule ? "inherit" : props.machine?.ruleId,
        credentialId: props.machine?.credentialId || 0,
        inheritRule: props.machine?.inheritRule || false
    }
    const {
        control,
        register,
        handleSubmit,
        getValues,
        formState: { errors },
        reset,
        setValue,
        watch,
        setError,
        clearErrors
    } = useForm<IMachine>({
        defaultValues: defaultValuesObj,
        resolver: yupResolver(validationSchema as any)
    })

    useEffect(() => {
        reset(defaultValuesObj)
    }, [props.machine]);
    const form = {
        control,
        register,
        handleSubmit,
        getValues,
        errors,
        reset,
        setValue,
        watch,
        setError,
        clearErrors
    }
    const onSubmit = async (data: any) => {
        setLoadingSubmit(true);
        let apiMethod = props.edit ? api.put : api.post;
        apiMethod('/machine', data)
            .then((res: AxiosResponse) => {
                if (res.data.success) {
                    setAlert(<Alert severity="success">{res.data.message}</Alert>);
                } else {
                    setAlert(<Alert severity="error"><AlertTitle>{res.data.message}</AlertTitle>{res.data.error}</Alert>);
                }
                setLoadingSubmit(false);
                queryClient.refetchQueries({queryKey: ['machines']});
            })
            .catch((error: AxiosError) => {
                console.log(error)
                setAlert(<Alert severity="error">This is an error alert — check it out!</Alert>);
                setLoadingSubmit(false);
            });
    };

    useEffect(() => {
        //@ts-ignore
        if(watch("ruleId") == 'inherit')
            setValue("inheritRule", true);
        else
            setValue("inheritRule", false);
    }, [watch("ruleId")]);
    return (
        loading ?
            <Loading />
            :
            <>
                {props.add &&
                    <IconButton aria-label="add" color="primary" onClick={() => setShowModal(true)}>
                        <AddIcon />
                    </IconButton>
                }
                {props.edit &&
                    <IconButton
                        aria-label="edit machine"
                        color="warning"
                        onClick={() => setShowModal(true)}>
                        <EditIcon />
                    </IconButton>
                }
                <Modal
                    open={showModal}
                    onClose={() => setShowModal(false)}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <ModalDialog size="md">
                            <ModalClose />
                            <Typography>Add new machine</Typography>
                            <Grid container spacing={2}>
                                <Grid item md={12}>
                                    <Grid container spacing={2}>
                                        <Grid item md={6} sm={12}>
                                            <div hidden>
                                                <TextField
                                                    {...register("id")}
                                                    error={errors?.id?.message != "" && errors?.id?.message != undefined}
                                                    style={{ width: "100%" }}
                                                    variant="outlined"
                                                    label="id" />
                                            </div>
                                            <div hidden>
                                                <TextField
                                                    {...register("inheritRule")}
                                                    error={errors?.inheritRule?.message != "" && errors?.inheritRule?.message != undefined}
                                                    style={{ width: "100%" }}
                                                    variant="outlined"
                                                    label="inheritRule" />
                                            </div>
                                            <TextField
                                                {...register("name")}
                                                error={errors?.name?.message != undefined && errors?.name?.message != ""}
                                                required
                                                style={{ width: "100%" }}
                                                variant="outlined"
                                                label="Name" />
                                            <FormLabel error={true}>{errors?.id?.message}</FormLabel>
                                            <FormHelperText error={true}>{errors?.name?.message}</FormHelperText>
                                        </Grid>
                                        <Grid item md={6} sm={12}>
                                            <TextField
                                                {...register("description")}
                                                error={errors?.description?.message != undefined}
                                                required
                                                style={{ width: "100%" }}
                                                variant="outlined"
                                                label="Description" />
                                            <FormHelperText error={true}>{errors?.description?.message}</FormHelperText>
                                        </Grid>
                                        <Grid item md={6} sm={12}>
                                            <TextField
                                                {...register("host")}
                                                error={errors?.host?.message != undefined && errors?.host?.message != ""}
                                                style={{ width: "100%" }}
                                                required
                                                variant="outlined"
                                                label="Host" />
                                            <FormHelperText error={true}>{errors?.host?.message}</FormHelperText>
                                        </Grid>
                                        <Grid item md={6} sm={12}>
                                            <TextField
                                                {...register("mac")}
                                                error={errors?.mac?.message != undefined && errors?.mac?.message != ""}
                                                style={{ width: "100%" }}
                                                required
                                                variant="outlined"
                                                label="MAC" />
                                            <FormHelperText error={true}>{errors?.mac?.message}</FormHelperText>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item md={12}>
                                    <Grid container spacing={2}>
                                        <Grid item md={6}>
                                            <RuleInput
                                                form={form}
                                                source="machineForm" />
                                        </Grid>
                                        <Grid item md={6}>
                                            <CredentialInput
                                                form={form}/>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <DialogActions>
                                <Grid container spacing={2}>
                                    {!loadingSubmit && alert &&
                                        <Grid md={12} item>
                                            {alert}
                                        </Grid>
                                    }
                                    <Grid item md={12} sx={{ textAlign: 'center' }}>
                                        <Button
                                            color="primary"
                                            variant="outlined"
                                            onClick={() => setShowModal(false)}
                                            sx={{ mr: 2 }}>
                                            Close
                                        </Button>
                                        <LoadingButton
                                            type="submit"
                                            loading={loadingSubmit}
                                            color="primary"
                                            variant="contained"
                                        >
                                            <span>Submit</span>
                                        </LoadingButton>
                                    </Grid>
                                </Grid>
                            </DialogActions>
                        </ModalDialog>
                    </form>
                </Modal>
            </>
    )
};