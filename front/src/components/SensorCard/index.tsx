
// import { useForm, useFieldArray, useWatch } from "react-hook-form";
// import React, { useEffect, useState, useContext } from 'react';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Typography from '@mui/material/Typography';
// import { Button, CardActionArea, CardActions } from '@mui/material';
// import LoadingButton from '@mui/lab/LoadingButton';
// import DeleteIcon from '@mui/icons-material/Delete';
// import Alert from '@mui/material/Alert';
// import AlertTitle from '@mui/material/AlertTitle';
// import IconButton from '@mui/material/IconButton';
// import { Modal } from '../Modal';
// // import { SensorForm } from '@/pages/Forms/Sensor';
// import { SensorService } from "@/core/services/sensor";
// import { useApi } from "@/core/services/api";

// export const SensorCard = (props: any) => {
//     const { api } = useApi();
//     const [showModal, setShowModal] = useState(false);
//     const [loadingDelete, setLoadingDelete] = useState(false);
//     const [deleteResponse, setDeleteResponse] = useState<any>({});
//     const [deleteResponseAlert, setDeleteResponseAlert] = useState<any>();
//     // const { data: sensor } = SensorService.useGetSensorById(props.id);

//     const deleteSensor = () => {
//         setLoadingDelete(true);
//         api.delete("/sensor/" + sensor?.id)
//             .then((res) => {
//                 setDeleteResponse(res.data);
//                 if (res.data.success) {
//                     setDeleteResponseAlert(<Alert severity="success">sensor deleted successfully</Alert>);
//                 } else {
//                     setDeleteResponseAlert(<Alert severity="error"><AlertTitle>{res.data.message}</AlertTitle>{res.data.error}</Alert>);
//                 }
//                 setLoadingDelete(false);
//             })
//             .catch((error) => {
//                 setDeleteResponseAlert(<Alert severity="error">Failed to delete sensor!</Alert>);
//                 setLoadingDelete(false);
//             })
//     }
//     const closeModal = () => {
//         setShowModal(false);
//         props.fetchSensors();
//     }

//     return (
//         <>
//             <Modal
//                 size="sm"
//                 show={showModal}
//                 setShow={setShowModal}
//                 title="Delete sensor"
//                 text={`Are you sure you want to delete sensor "${sensor?.name}"`}
//                 actions={
//                     <>
//                         <Button onClick={() => closeModal()}>Close</Button>
//                         {deleteResponse?.success != true &&
//                             <LoadingButton
//                                 onClick={() => deleteSensor()} color="error"
//                                 loading={loadingDelete}
//                                 variant="outlined"
//                             >
//                                 <span>Delete</span>
//                             </LoadingButton>

//                             // <Button onClick={() => deletesensor()} color="error">
//                             //     Delete
//                             // </Button>
//                         }
//                     </>
//                 }
//             >
//                 {deleteResponseAlert}
//             </Modal>
//             <Card>
//                 <CardActionArea onClick={() => console.log(`/nobreak/`)}>
//                     <CardContent>
//                         <Typography gutterBottom variant="h5" component="div">
//                             {sensor?.name}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                             {sensor?.description}
//                         </Typography>
//                     </CardContent>
//                 </CardActionArea>
//                 <CardActions>
//                     {/* <SensorForm sensor={sensor} edit /> */}
//                     <IconButton
//                         aria-label="delete sensor"
//                         color="error"
//                         onClick={() => setShowModal(true)}
//                     >
//                         <DeleteIcon />
//                     </IconButton>
//                 </CardActions>
//             </Card>
//         </>
//     );
// };