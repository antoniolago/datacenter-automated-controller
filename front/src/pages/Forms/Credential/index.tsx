
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
import { TextField, createTheme, FormHelperText, MenuItem } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import EditIcon from '@mui/icons-material/Edit';
import Loading from "@/components/Loading";
import { ICredential } from "@/core/types/credential";
import { useApi } from "@/core/services/api";
export const AppContext = createContext(undefined);

export const CredentialForm = (props: any) => {
    const { api } = useApi();
    const [loading, setLoading] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [show, setShow] = useState(false);
    const [alert, setAlert] = useState<any>();
    const validationSchema = Yup.object().shape({
        name: Yup.string(),
        description: Yup.string()
    });
    const defaultValuesObj = {
        // id: props.credential?.id || 'IdTest',
        name: props.credential?.name || 'NameTest',
        user: props.credential?.user || 'UserTest',
        password: props.credential?.password || 'PassTest',
        publicKey: props.credential?.publicKey || 'PassTest',
        privateKey: props.credential?.privateKey || 'PassTest'
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
    } = useForm<ICredential>({
        defaultValues: defaultValuesObj,
        resolver: yupResolver(validationSchema as any)
    })
    useEffect(() => {
        reset(defaultValuesObj)
    }, [props.credential]);

    const onSubmit = async (data: any) => {
        setLoadingSubmit(true);
        let apiMethod = props.edit ? api.put : api.post;
        apiMethod('/credential', data)
            .then((res: any) => {
                console.log(res)
                if (res.data.success) {
                    setAlert(<Alert severity="success">Credential inserted successfully</Alert>);
                } else {
                    setAlert(<Alert severity="error"><AlertTitle>{res.data.message}</AlertTitle>{res.data.error}</Alert>);
                }
                setLoadingSubmit(false);
                if (props.fetchCredentials) props.fetchCredentials();
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
                        color="primary"
                        onClick={() => setShow(true)}
                        sx={{ placeSelf: 'center' }}>
                        <AddIcon />
                    </IconButton>
                }
                {props.edit &&
                    <IconButton
                        aria-label="edit credential"
                        color="warning"
                        onClick={() => setShow(true)}>
                        <EditIcon />
                    </IconButton>
                }
                <Modal
                    show={show}
                    setShow={setShow}
                    title="Add new credential"
                    text="Fill in this form to create a new credential"
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
                            <h4 className="bold mb-2">Name <span className="red">*</span></h4>
                            {props.credential?.id &&
                                <div hidden>
                                    <TextField
                                        {...register("id")}
                                        error={errors?.id?.message != undefined}
                                        fullWidth
                                        variant="outlined"
                                        value={props.credential?.id}
                                        label="Credential's id" />
                                </div>
                            }
                            <TextField
                                {...register("name")}
                                error={errors?.name?.message != undefined}
                                fullWidth
                                variant="outlined"
                                label="Credential's name" />
                            <FormHelperText error={true}>{errors?.name?.message?.toString()}</FormHelperText>
                        </Grid>
                        <Grid item md={6} sm={12} className="my-2">
                            <h4 className="bold mb-2">User <span className="red">*</span></h4>
                            <TextField
                                {...register("user")}
                                error={errors?.user?.message != undefined}
                                fullWidth
                                variant="outlined"
                                label="Credential's user" />
                            <FormHelperText error={true}>{errors?.user?.message?.toString()}</FormHelperText>
                        </Grid>

                        {/* <Grid item md={12} sm={12} className="my-2" sx={{display: 'hidden'}}>
                            <h4 className="bold mb-2">Password<span className="red">*</span></h4>
                            <TextField
                                {...register("password")}
                                error={errors?.password?.message != undefined}
                                fullWidth
                                multiline
                                minRows={4}
                                maxRows={999}
                                variant="outlined"
                                label="Credential's password" />
                        </Grid> */}
                        <Grid item md={6} sm={6} className="my-2">
                            <h4 className="bold mb-2">Public Key<span className="red">*</span></h4>
                            <TextField
                                {...register("publicKey")}
                                error={errors?.publicKey?.message != undefined}
                                fullWidth
                                multiline
                                minRows={4}
                                maxRows={999}
                                variant="outlined"
                                label="Credential's publicKey" />
                            <FormHelperText error={true}>{errors?.publicKey?.message?.toString()}</FormHelperText>
                        </Grid>
                        <Grid item md={6} sm={6} className="my-2">
                            <h4 className="bold mb-2">Private Key<span className="red">*</span></h4>
                            <TextField
                                {...register("privateKey")}
                                error={errors?.privateKey?.message != undefined}
                                fullWidth
                                multiline
                                minRows={4}
                                maxRows={999}
                                variant="outlined"
                                label="Credential's privateKey" />
                            <FormHelperText error={true}>{errors?.privateKey?.message?.toString()}</FormHelperText>
                        </Grid>
                    </Grid>
                </Modal >
            </>
    )
};
