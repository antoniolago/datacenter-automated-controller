
// import { useForm, useFieldArray, useWatch, Controller } from "react-hook-form";
// import React, { createContext, useEffect, useState } from 'react';
// import Alert from '@mui/material/Alert';
// import AlertTitle from '@mui/material/AlertTitle';
// // import { yupResolver } from "@/hookform/resolvers/yup";
// // import { Loading } from '@/components/Loading';
// import IconButton from '@mui/material/IconButton';
// import AddIcon from '@mui/icons-material/Add';
// import * as Yup from "yup";
// import { RadioGroup, FormControlLabel, Radio } from "@mui/material";
// import { Modal } from "@/components/Modal";
// import Button from '@mui/material/Button';
// import Grid from '@mui/material/Grid';
// import { TextField, createTheme, FormHelperText, MenuItem } from "@mui/material";
// import LoadingButton from '@mui/lab/LoadingButton';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import { TemperatureSlider } from "@/components/Sliders/TemperatureSlider";
// import { HumiditySlider } from "@/components/Sliders/HumiditySlider";
// import { useApi } from "@/core/services/api";
// import Loading from "@/components/Loading";
// export const AppContext = createContext(undefined);

// export const SensorForm = (props: any) => {
//     const [loading, setLoading] = useState(false);
//     const [loadingSubmit, setLoadingSubmit] = useState(false);
//     const [show, setShow] = useState(false);
//     const [alert, setAlert] = useState();
//     const [json, setJson] = useState([]);
//     const {api} = useApi();
//     const validationSchema = Yup.object().shape({
//         name: Yup.string(),
//         description: Yup.string()
//     });
//     const defaultValuesObj = {
//         name: props.sensor?.name || 'Teste11',
//         description: props.sensor?.description || 'Teste222',
//         endpoint: props.sensor?.minTemperature || 0,
//         jsonProperty: props.sensor?.minTemperature || 0,
//     }
//     const {
//         control,
//         register,
//         handleSubmit,
//         getValues,
//         formState: { errors },
//         reset,
//         setValue,
//         watch,
//         setError,
//         clearErrors
//     } = useForm({
//         defaultValues: defaultValuesObj,
//         // resolver: yupResolver(validationSchema)
//     })
//     useEffect(() => {
//         reset(defaultValuesObj)
//     }, [props.sensor]);

//     const onSubmit = async (data: any) => {
//         setLoadingSubmit(true);
//         let apiMethod = props.edit ? api.put : api.post;
//         apiMethod('/sensor', data)
//             .then((res: any) => {
//                 console.log(res)
//                 setLoadingSubmit(false);
//                 if (props.fetchSensors) props.fetchSensors();
//             })
//             .catch((error: any) => {
//                 console.log(error)
//                 setLoadingSubmit(false);
//             });
//     };
//     const getEndpointJson = (endpoint) => {
//         if (endpoint === '') return;
//         // axios.get(endpoint).then((response) => {
//         //     setJson(Object.keys(response.data));
//         // });
//     }

//     return (
//         loading ?
//             <Loading />
//             :
//             <>
//                 {props.add &&
//                     <IconButton aria-label="add" color="primary" onClick={() => setShow(true)}>
//                         <AddIcon />
//                     </IconButton>
//                 }
//                 {props.edit &&
//                     <IconButton
//                         aria-label="edit sensor"
//                         color="warning"
//                         onClick={() => setShow(true)}>
//                         <EditIcon />
//                     </IconButton>
//                 }
//                 <Modal
//                     show={show}
//                     setShow={setShow}
//                     title="Add new sensor"
//                     text="Fill in this form to create a new sensor"
//                     actions={
//                         <>
//                             {!loadingSubmit && alert && alert}
//                             <Button onClick={() => setShow(false)}>Close</Button>
//                             <LoadingButton
//                                 onClick={() => onSubmit(getValues())}
//                                 // size="small"
//                                 loading={loadingSubmit}
//                                 variant="outlined"
//                             >
//                                 <span>Submit</span>
//                             </LoadingButton>
//                         </>
//                     }
//                     size="lg"
//                 >
//                     <Grid container spacing={2}>
//                         <Grid item md={6} sm={12} className="my-2">
//                             <h4 className="bold mb-2">Name <span className="red">*</span></h4>
//                             // {props.sensor?.id &&
//                             //     <div hidden>
//                             //         <TextField
//                             //             {...register("id")}
//                             //             // error={errors?.id?.message}
//                             //             fullWidth
//                             //             variant="outlined"
//                             //             value={props.sensor?.id}
//                             //             label="Sensor's id" />
//                             //     </div>
//                             // }
//                             <TextField
//                                 {...register("name")}
//                                 error={errors?.name?.message != undefined}
//                                 fullWidth
//                                 variant="outlined"
//                                 label="Sensor's name" />
//                             // <FormHelperText error={true}>
//                             //     // {errors?.name?.message}
//                             // </FormHelperText>
//                         </Grid>
//                         <Grid item md={6} sm={12} className="my-2">
//                             <h4 className="bold mb-2">Description <span className="red">*</span></h4>
//                             <TextField
//                                 {...register("description")}
//                                 error={errors?.description?.message != undefined}
//                                 fullWidth
//                                 variant="outlined"
//                                 label="Sensor's description" />
//                             // <FormHelperText error={true}>{errors?.description?.message}</FormHelperText>
//                         </Grid>
//                         <Grid item md={6} sm={12} className="my-2">
//                             <h4 className="bold mb-2">Type <span className="red">*</span></h4>
//                             <TextField
//                                 {...register("description")}
//                                 error={errors?.description?.message != undefined}
//                                 fullWidth
//                                 variant="outlined"
//                                 label="Sensor's description" />
//                             // <FormHelperText error={true}>{errors?.description?.message}</FormHelperText>
//                         </Grid>
//                         <Grid item md={6}>
//                             // <Controller
//                             //     // name="radioGroup"
//                             //     control={control}
//                             //     defaultValue="Temperature"
//                             //     render={({ field }: any) => (
//                             //         <RadioGroup {...field}>
//                             //             <FormControlLabel
//                             //                 value="Temperature"
//                             //                 control={<Radio />}
//                             //                 label="Temperature"
//                             //             />
//                             //             <FormControlLabel
//                             //                 value="Humidity"
//                             //                 control={<Radio />}
//                             //                 label="Humidity"
//                             //             />
//                             //         </RadioGroup>
//                             //     )}
//                             // />
//                         </Grid>
//                         <Grid item md={6}>
//                             {/* <Controller
//                                 // name="url"
//                                 control={control}
//                                 defaultValue=""
//                                 render={({ field }) => (
//                                     <TextField
//                                         {...field}
//                                         label="API Endpoint URL"
//                                         onChange={(e) => getEndpointJson(e.target.value)}
//                                     />
//                                 )}
//                             /> */}
//                         </Grid>
//                     </Grid>
//                 </Modal >
//             </>
//     )
// };