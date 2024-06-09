
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import React, { createContext, useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { yupResolver } from "@hookform/resolvers/yup";
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import * as Yup from "yup";
import { Modal } from "@/components/Modal";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { TextField, createTheme, FormHelperText, MenuItem, InputAdornment } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import EditIcon from '@mui/icons-material/Edit';
import { AppSettingsService } from "@/core/services/appsettings";
import { useApi } from "@/core/services/api";
import { IRule } from "@/core/types/rule";
import Loading from "@/components/Loading";
import { useQueryClient } from "@tanstack/react-query";

export const RuleForm = (props: any) => {
    const { api } = useApi();
    const [loading, setLoading] = useState(false);
    const { data: appSettings } = AppSettingsService.useGetAppSettings();
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [show, setShow] = useState(false);
    const [alert, setAlert] = useState<any>();
    const queryClient = useQueryClient();
    const validationSchema = Yup.object().shape({
        name: Yup.string(),
        description: Yup.string()
    });
    const defaultValuesObj = {
        name: props.rule?.name || 'Teste11',
        description: props.rule?.description || 'Teste222',
        minTemperature: props.rule?.minTemperature || 0,
        maxTemperature: props.rule?.maxTemperature || 0,
        minHumidity: props.rule?.minHumidity || 0,
        maxHumidity: props.rule?.maxHumidity || 0,
        forceOnline: props.rule?.forceOnline || 0,
        wolAttempts: props.rule?.wolAttempts || 0,
        chargeToShutdown: props.rule?.chargeToShutdown || 0,
        chargeToWol: props.rule?.chargeToWol || 0,
        ruleId: props.rule?.ruleId || 0
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
    } = useForm<IRule>({
        defaultValues: defaultValuesObj,
        resolver: yupResolver(validationSchema as any)
    })
    useEffect(() => {
        reset(defaultValuesObj)
    }, [props.rule]);

    const onSubmit = async (data: any) => {
        setLoadingSubmit(true);
        let apiMethod = props.edit ? api.put : api.post;
        apiMethod('/rule', data)
            .then((res: any) => {
                console.log(res)
                if (res.data.success) {
                    setAlert(<Alert severity="success">Rule inserted successfully</Alert>);
                } else {
                    setAlert(<Alert severity="error"><AlertTitle>{res.data.message}</AlertTitle>{res.data.error}</Alert>);
                }
                setLoadingSubmit(false);
                queryClient.refetchQueries({queryKey: ["rules"]})
            })
            .catch((error: any) => {
                console.log(error)
                setAlert(<Alert severity="error">This is an error alert — check it out!</Alert>);
                setLoadingSubmit(false);
            });
    };

    return (
        loading ?
            <Loading />
            :
            <>
                {props.add &&
                    <IconButton
                        aria-label="add"
                        color="success"
                        onClick={() => setShow(true)}
                        sx={{placeSelf: 'center'}}>
                        <AddIcon />
                    </IconButton>
                }
                {props.edit &&
                    <IconButton
                        aria-label="edit rule"
                        color="warning"
                        onClick={() => setShow(true)}>
                        <EditIcon />
                    </IconButton>
                }
                <Modal
                    show={show}
                    setShow={setShow}
                    title="Add new rule"
                    text="Fill in this form to create a new rule"
                    actions={
                        <>
                            {!loadingSubmit && alert && alert}
                            <Button onClick={() => setShow(false)}>Close</Button>
                            <LoadingButton
                                onClick={() => onSubmit(getValues())}
                                // size="small"
                                loading={loadingSubmit}
                                variant="outlined"
                            >
                                <span>Submit</span>
                            </LoadingButton>
                        </>
                    }
                    size="lg"
                >
                    <Grid container spacing={2}>
                        <Grid item md={6} sm={12} className="my-2">
                            {props.rule?.id &&
                                <div hidden>
                                    <TextField
                                        {...register("id")}
                                        error={errors?.id?.message != undefined}
                                        fullWidth
                                        variant="outlined"
                                        value={props.rule?.id}
                                        label="Rule's id" />
                                </div>
                            }
                            <TextField
                                {...register("name")}
                                error={errors?.name?.message != undefined}
                                fullWidth
                                variant="outlined"
                                inputProps={{ pattern: "[a-z]{1,15}" }}
                                label="Rule's name" />
                            <FormHelperText error={true}>{errors?.name?.message}</FormHelperText>
                        </Grid>
                        <Grid item md={6} sm={12} className="my-2">
                            <TextField
                                {...register("description")}
                                error={errors?.description?.message != undefined}
                                fullWidth
                                variant="outlined"
                                label="Rule's description" />
                            <FormHelperText error={true}>{errors?.description?.message}</FormHelperText>
                        </Grid>
                        <Grid item md={6} sm={12} className="my-2">
                            <TextField
                                {...register("forceOnline")}
                                error={errors?.forceOnline?.message != undefined}
                                fullWidth
                                variant="outlined"
                                label="Keep machine online" />
                            <FormHelperText error={true}>{errors?.forceOnline?.message}</FormHelperText>
                        </Grid>
                        <Grid item md={6} sm={12} className="my-2">
                            <TextField
                                {...register("minTemperature")}
                                error={errors?.minTemperature?.message != undefined}
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                  endAdornment: <InputAdornment position="end">Cº</InputAdornment>,
                                }}
                                label="Rule's minTemperature"
                                type="number" />
                            <FormHelperText error={true}>{errors?.minTemperature?.message}</FormHelperText>
                        </Grid>
                        <Grid item md={6} sm={12} className="my-2">
                            <TextField
                                {...register("maxTemperature")}
                                error={errors?.maxTemperature?.message != undefined}
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                  endAdornment: <InputAdornment position="end">Cº</InputAdornment>,
                                }}
                                label="Rule's maxTemperature"
                                type="number" />
                            <FormHelperText error={true}>{errors?.maxTemperature?.message}</FormHelperText>
                        </Grid>
                        <Grid item md={6} sm={12} className="my-2">
                            <TextField
                                {...register("minHumidity")}
                                error={errors?.minHumidity?.message != undefined}
                                fullWidth
                                InputProps={{
                                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                }}
                                variant="outlined"
                                label="Rule's minHumidity"
                                type="number" />
                            <FormHelperText error={true}>{errors?.minHumidity?.message}</FormHelperText>
                        </Grid>
                        <Grid item md={6} sm={12} className="my-2">
                            <TextField
                                {...register("maxHumidity")}
                                error={errors?.maxHumidity?.message != undefined}
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                }}
                                label="Rule's maxHumidity"
                                type="number" />
                            <FormHelperText error={true}>{errors?.maxHumidity?.message}</FormHelperText>
                        </Grid>
                        <Grid item md={6} sm={12} className="my-2">
                            <TextField
                                {...register("wolAttempts")}
                                error={errors?.wolAttempts?.message != undefined}
                                fullWidth
                                variant="outlined"
                                label="Rule's wolAttempts"
                                type="number" />
                            <FormHelperText error={true}>{errors?.wolAttempts?.message}</FormHelperText>
                        </Grid>
                        <Grid item md={6} sm={12} className="my-2">
                            <TextField
                                {...register("chargeToWol")}
                                error={errors?.chargeToWol?.message != undefined}
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                }}
                                label="Rule's chargeToWol"
                                type="number" />
                            <FormHelperText error={true}>{errors?.chargeToWol?.message}</FormHelperText>
                        </Grid>
                        <Grid item md={6} sm={12} className="my-2">
                            <TextField
                                {...register("chargeToShutdown")}
                                error={errors?.chargeToShutdown?.message != undefined}
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                }}
                                label="Rule's chargeToShutdown"
                                type="number" />
                            <FormHelperText error={true}>{errors?.chargeToShutdown?.message}</FormHelperText>
                        </Grid>
                    </Grid>
                </Modal >
            </>
    )
};