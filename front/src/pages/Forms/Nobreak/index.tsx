
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import React, { createContext, useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
// @ts-ignore
import { yupResolver } from "@hookform/resolvers/yup";
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import * as Yup from "yup";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import LoadingButton from '@mui/lab/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useApi } from "@/core/services/api";
import Loading from "@/components/Loading";
import { DialogActions, FormHelperText, TextField, Typography } from "@mui/material";
import { INobreak } from "@/core/types/nobreak";
import { RuleInput } from "@/components/RuleInput";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosResponse } from "axios";
import { ModalClose, ModalDialog, Modal } from "@mui/joy";
export const AppContext = createContext(undefined);

export const NobreakForm = (props: any) => {
    const [loading, setLoading] = useState(false);
    const { api } = useApi();
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [alert, setAlert] = useState<any>();
    const queryClient = useQueryClient();
    const validationSchema = Yup.object().shape({
        name: Yup.string(),
        description: Yup.string(),
        driver: Yup.string(),
        port: Yup.string(),
        arguments: Yup.array()
            .of(
                Yup.object().shape({
                    key: Yup.string().required(),
                    value: Yup.string() //.required(), Not always a value is required (novendor, norating, etc.)
                })
            )
    });
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
    } = useForm<INobreak>({
        defaultValues: {
            name: props.edit ? props.nobreak?.name : "NobreakName",
            description: props.edit ? props.nobreak?.description : "Datacenter Nobreak",
            driver: props.edit ? props.nobreak?.driver : "dummy-ups",
            port: props.edit ? props.nobreak?.port : "auto",
            arguments: []
        },
        resolver: yupResolver(validationSchema as any)
    })
    const form = {
        control,
        register,
        handleSubmit,
        getValues,
        watch,
        errors,
        reset,
        setValue,
        setError,
        clearErrors
    }
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control,
        name: "arguments"
    });
    useEffect(() => {
        reset({
            name: props.edit ? props.nobreak?.name : "NobreakName",
            description: props.edit ? props.nobreak?.description : "Datacenter Nobreak",
            driver: props.edit ? props.nobreak?.driver : "dummy-ups",
            port: props.edit ? props.nobreak?.port : "auto",
            arguments: props.edit ? props.nobreak?.arguments : [],
            ruleId: props.edit ? props.nobreak?.ruleId : ""
        })
    }, [props.nobreak]);

    const onSubmit = async (data: any) => {
        setLoadingSubmit(true);
        let apiMethod = props.edit ? api.put : api.post;
        var url = `/nobreak${props.edit ? '/' + props.nobreak.id : ''}`;
        console.log(url)
        apiMethod(url, data)
            .then((res: AxiosResponse<string>) => {
                console.log(res)
                if (res.data) {
                    toast.success("Nobreak saved successfully");
                }
                setLoadingSubmit(false);
                queryClient.invalidateQueries({ queryKey: ['nobreaks', 'machines'] });
                setShowModal(false);
            })
            .catch((error: any) => {
                console.log(error)
                toast.error("Failed to save nobreak!");
                setLoadingSubmit(false);
            });
    };
    //@ts-ignore
    const upsConfValue = () => (`[${watchForm?.name ?? ''}]\n    desc="${watchForm?.description ?? ''}"\n    driver="${watchForm?.driver ?? ''}"\n    port="${watchForm?.port ?? ''}"\n    ${fields?.map((field, index) => ('' + watchForm.arguments[index].key + ((watchForm.arguments[index].value) ? '=' : '') + watchForm.arguments[index].value + '\n    '))}`).replaceAll(",", "")
    const watchForm = watch();

    return (
        loading ?
            <Loading />
            :
            watchForm &&
            <>
                {props.add &&
                    <IconButton aria-label="add" color="primary" onClick={() => setShowModal(true)}>
                        <AddIcon />
                    </IconButton>
                }
                {props.edit &&
                    <IconButton
                        aria-label="edit nobreak"
                        color="warning"
                        onClick={() => setShowModal(true)}>
                        <EditIcon />
                    </IconButton>
                }

                <Modal
                    open={showModal}
                    onClose={() => setShowModal(false)}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <ModalDialog sx={{ width: '90vw' }}>
                            <ModalClose />
                            <Typography>Add new nobreak</Typography>
                            <Grid container spacing={2}>
                                <Grid item md={8}>
                                    <Grid container spacing={2}>
                                        <Grid item md={6} sm={12}>
                                            {/* <h4 className="bold mb-2">Name <span className="red">*</span></h4> */}
                                            <TextField
                                                {...register("name")}
                                                error={errors?.name?.message != undefined}
                                                fullWidth
                                                variant="outlined"
                                                required
                                                // inputProps={{ pattern: "[a-z]" }}
                                                label="Name" />
                                            <FormHelperText error={true}>{errors?.name?.message}</FormHelperText>
                                        </Grid>
                                        <Grid item md={6} sm={12}>
                                            {/* <h4 className="bold mb-2">Description <span className="red">*</span></h4> */}
                                            <TextField
                                                {...register("description")}
                                                error={errors?.description?.message != undefined}
                                                fullWidth
                                                variant="outlined"
                                                label="Description" />
                                            <FormHelperText error={true}>{errors?.description?.message}</FormHelperText>
                                        </Grid>
                                        <Grid item md={6} sm={12}>
                                            {/* <h4 className="bold mb-2">Driver <span className="red">*</span></h4> */}
                                            <TextField
                                                {...register("driver")}
                                                error={errors?.driver?.message != undefined}
                                                fullWidth
                                                variant="outlined"
                                                label="Driver" />
                                            <FormHelperText error={true}>{errors?.driver?.message}</FormHelperText>
                                        </Grid>
                                        <Grid item md={6} sm={12}>
                                            {/* <h4 className="bold mb-2">Port <span className="red">*</span></h4> */}
                                            <TextField
                                                {...register("port")}
                                                error={errors?.port?.message != undefined}
                                                fullWidth
                                                variant="outlined"
                                                label="Port" />
                                            <FormHelperText error={true}>{errors?.port?.message}</FormHelperText>
                                        </Grid>
                                        {/* <Grid item md={12}>
                                    <h4 className="bold mb-2">Working temperature range<span className="red">*</span></h4>
                                    <TemperatureSlider control={control}/>
                                </Grid>
                                <Grid item md={12}>
                                    <h4 className="bold mb-2">Working Umidity Range <span className="red">*</span></h4>
                                    <HumiditySlider  control={control}/>
                                </Grid> */}
                                        <Grid item md={12}>
                                            <h5 className="mb-1">
                                                Arguments
                                                <IconButton
                                                    size="small"
                                                    onClick={() => append({ key: "" } as any)}
                                                    aria-label="add argument">
                                                    <AddIcon color="success" />
                                                </IconButton>
                                            </h5>
                                            {/* <span>Provide your arguments for the ups.conf</span> */}
                                            {fields.map((field, index) => (
                                                <>
                                                    <Grid container spacing={2}>
                                                        <Grid item md={5} sm={12}>
                                                            {/* <h4 className="bold font-preta mb-2">Key<span className="red">*</span></h4> */}
                                                            <TextField
                                                                key={field.id} // important to include key with field's id
                                                                {...register(`arguments.${index}.key`)}
                                                                // @ts-ignore
                                                                error={errors?.arguments?.[index]?.key?.message != undefined}
                                                                fullWidth
                                                                size="small"
                                                                variant="outlined"
                                                                label="Argument key" />
                                                            {/* // @ts-ignore */}
                                                            {/* <FormHelperText error={true}>{errors?.arguments?.[index]?.key?.message}</FormHelperText> */}
                                                        </Grid>
                                                        <Grid item md={5} sm={12}>
                                                            {/* <h4 className="bold mb-2">Value<span className="red">*</span></h4> */}
                                                            <TextField
                                                                key={field.id} // important to include key with field's id
                                                                {...register(`arguments.${index}.value`)}
                                                                // @ts-ignore
                                                                error={errors?.arguments?.[index]?.value?.message != undefined}
                                                                fullWidth
                                                                size="small"
                                                                variant="outlined"
                                                                label="Argument value" />
                                                            <FormHelperText error>
                                                                {/* {errors?.arguments?.[index]?.value?.message} */}
                                                            </FormHelperText>
                                                        </Grid>
                                                        <Grid item md={2} style={{ textAlign: 'center', placeSelf: 'center' }}>
                                                            <IconButton
                                                                onClick={() => remove(index)}
                                                                aria-label="delete">
                                                                <DeleteIcon color="error" />
                                                            </IconButton>
                                                        </Grid>
                                                        {/* <div hidden>
                                                    <TextField
                                                        key={field.id} // important to include key with field's id
                                                        {...register(`arguments.${index}.nobreakId`)}
                                                        error={errors?.arguments?.[index]?.nobreakId?.message}
                                                        fullWidth 
                                                        variant="outlined"
                                                        label="Argument nobreakId"
                                                        value={watchForm.id}
                                                    />
                                                </div> */}
                                                    </Grid><hr style={{ margin: 0 }} />
                                                </>
                                            ))}
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid md={4} item>
                                    <div style={{ width: '100%', position: 'sticky', top: '0' }}>
                                        {/* <h4 className="bold mb-2">ups.conf</h4> */}
                                        <Grid container sx={{ mb: 2 }}>
                                            <Grid item md={12}>
                                                <TextField
                                                    disabled
                                                    label="ups.conf"
                                                    value={upsConfValue()}
                                                    error={errors?.description?.message != undefined}
                                                    multiline
                                                    rows={5}
                                                    fullWidth
                                                    variant="outlined" />
                                            </Grid>
                                        </Grid>
                                        <FormHelperText error={true}>{errors?.description?.message}</FormHelperText>
                                        <RuleInput nobreak={props.nobreak} form={form} source="nobreakForm" />
                                    </div>
                                </Grid>
                            </Grid>
                            <DialogActions>
                                <Grid container spacing={2}>
                                    {!loadingSubmit && alert &&
                                        <Grid item>
                                            {alert}
                                        </Grid>
                                    }
                                    <Grid md={12} item sx={{ textAlign: 'center' }}>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            sx={{ mr: 3 }}
                                            onClick={() => setShowModal(false)}>
                                            Close
                                        </Button>
                                        <LoadingButton
                                            // size="small"
                                            color="success"
                                            type="submit"
                                            loading={loadingSubmit}
                                            variant="contained"
                                        >
                                            <span>Submit</span>
                                        </LoadingButton>
                                    </Grid>
                                </Grid>
                            </DialogActions>
                        </ModalDialog>
                    </form>
                </Modal >
            </>
    )
};