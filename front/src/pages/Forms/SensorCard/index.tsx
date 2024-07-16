import { ISensor } from "@/core/types/sensor";
import { Box, Button, Card, CardContent, DialogActions, Grid, Modal, ModalClose, ModalDialog, Typography, Slider } from "@mui/joy";
import LoadingButton from "@mui/lab/LoadingButton";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import * as Yup from "yup";
import { AxiosError, AxiosResponse } from "axios";
import { useApi } from "@/core/services/api";
import { SensorService } from "@/core/services/sensor";
import { TextField } from "@mui/material";
import { CustomSlider } from "@/components/CustomSlider";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const SensorCard = (props: any) => {
    const [showModal, setShowModal] = useState(false);
    const { data: sensorData, isError: isNewSensor } = SensorService.useGetData();
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const { api } = useApi();
    useEffect(() => {
        console.log(sensorData)
        if (sensorData) {
            reset({
                id: sensorData.id,
                name: sensorData.name,
                description: sensorData.description,
                pin: sensorData.pin,
                //Temperature thresholds
                minCriticalTemperatureThreshold: sensorData.minCriticalTemperatureThreshold,
                maxCriticalTemperatureThreshold: sensorData.maxCriticalTemperatureThreshold,
                minWarningTemperatureThreshold: sensorData.minWarningTemperatureThreshold,
                maxWarningTemperatureThreshold: sensorData.maxWarningTemperatureThreshold,
                //Humidity thresholds
                minCriticalHumidityThreshold: sensorData.minCriticalHumidityThreshold,
                maxCriticalHumidityThreshold: sensorData.maxCriticalHumidityThreshold,
                minWarningHumidityThreshold: sensorData.minWarningHumidityThreshold,
                maxWarningHumidityThreshold: sensorData.maxWarningHumidityThreshold,
            });
        }
    }, [sensorData]);
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        pin: Yup.string().required("Pin is required"),
        description: Yup.string().required("Description is required"),
        minCriticalTemperatureThreshold: Yup.number()
            .required("Min Critical Temperature Threshold is required"),
        maxCriticalTemperatureThreshold: Yup.number()
            .required("Max Critical Temperature Threshold is required"),
        minCriticalHumidityThreshold: Yup.number()
            .required("Min Critical Humidity Threshold is required"),
        maxCriticalHumidityThreshold: Yup.number()
            .required("Max Critical Humidity Threshold is required"),
        minWarningTemperatureThreshold: Yup.number()
            .required("Min Warning Temperature Threshold is required"),
        maxWarningTemperatureThreshold: Yup.number()
            .required("Max Warning Temperature Threshold is required"),
        minWarningHumidityThreshold: Yup.number()
            .required("Min Warning Humidity Threshold is required"),
        maxWarningHumidityThreshold: Yup.number()
            .required("Max Warning Humidity Threshold is required"),
    });

    const queryClient = useQueryClient();
    const defaultValuesObj = {
        id: 0,
        name: "Default Sensor",
        description: "Description",
        pin: 1,
        minCriticalTemperatureThreshold: 10,
        maxCriticalTemperatureThreshold: 30,
        minCriticalHumidityThreshold: 10,
        maxCriticalHumidityThreshold: 90,
        minWarningTemperatureThreshold: 15,
        maxWarningTemperatureThreshold: 27,
        minWarningHumidityThreshold: 15,
        maxWarningHumidityThreshold: 80,
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
    } = useForm<ISensor>({
        defaultValues: defaultValuesObj,
        resolver: yupResolver(validationSchema as any)
    });

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

    const marks = new Array(11).fill(1).map((_, i) => ({
        label: i * 10,
        value: i * 10
    }));

    const enumToDo = (sensorData, thresholds) => {
        const { temperature, humidity } = sensorData;
        const {
            minCriticalTemperatureThreshold,
            maxCriticalTemperatureThreshold,
            minCriticalHumidityThreshold,
            maxCriticalHumidityThreshold,
            minWarningTemperatureThreshold,
            maxWarningTemperatureThreshold,
            minWarningHumidityThreshold,
            maxWarningHumidityThreshold,
        } = thresholds;

        if (
            temperature < minCriticalTemperatureThreshold ||
            temperature > maxCriticalTemperatureThreshold ||
            humidity < minCriticalHumidityThreshold ||
            humidity > maxCriticalHumidityThreshold
        ) {
            return "danger";
        } else if (
            temperature < minWarningTemperatureThreshold ||
            temperature > maxWarningTemperatureThreshold ||
            humidity < minWarningHumidityThreshold ||
            humidity > maxWarningHumidityThreshold
        ) {
            return "warning";
        } else {
            return "success";
        }
    };

    const onSubmit = async (data: any) => {
        setLoadingSubmit(true);
        let apiMethod = isNewSensor ? api.post : api.put;
        apiMethod('/sensor', data)
            .then((res: AxiosResponse) => {
                if (res.data.success) {
                    queryClient.invalidateQueries({ queryKey: ['sensor-data'] });
                    setShowModal(false);
                    toast.success("Sensor data saved successfully");

                } else {
                    // handle API response error
                }
            })
            .catch((error: AxiosError) => {
                console.log(error)
                toast.error("Error saving sensor data. details: " + error.message);
            })
            .finally(() => setLoadingSubmit(false));
    };

    const thresholds = getValues();
    const cardColor = sensorData ? enumToDo(sensorData, thresholds) : "danger";

    return (
        <>
            <Card
                color={isNewSensor || !sensorData ? "danger" : cardColor}
                sx={{
                    textAlign: 'right',
                    display: 'flex',
                    paddingY: '5px'
                }}
                onClick={() => setShowModal(true)}>
                <CardContent sx={{ flexDirection: 'row', alignItems: 'center' }}>
                    {isNewSensor || !sensorData ?
                        <>
                            No sensor data. Click here to configure.
                        </>
                        :
                        <>
                            <Box sx={{ height: '100%' }}>
                                <DeviceThermostatIcon />
                            </Box>
                            <Box sx={{ mr: 3 }}>
                                <Typography>
                                    Temperature:
                                </Typography>
                                <Typography>
                                    Humidity:
                                </Typography>
                            </Box>
                            <Box>
                                <Typography>
                                    {sensorData?.data?.temperature} ºC
                                </Typography>
                                <Typography>
                                    {sensorData?.data?.humidity} %
                                </Typography>
                            </Box>
                        </>
                    }
                </CardContent>
            </Card>
            <Modal
                open={showModal}
                onClose={() => setShowModal(false)}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalDialog sx={{ width: '90vw' }}>
                        <ModalClose />
                        <Typography>Sensor Configuration</Typography>
                        <Grid container spacing={2}>
                            <Grid md={4}>
                                <TextField
                                    {...register("name")}
                                    type="text"
                                    fullWidth
                                    focused
                                    label="Name"
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                                {errors.name && <Typography color="danger">{errors?.name?.message}</Typography>}
                            </Grid>
                            <Grid md={4}>
                                <TextField
                                    {...register("description")}
                                    type="text"
                                    fullWidth
                                    focused
                                    label="Description"
                                    error={!!errors.description}
                                    helperText={errors.description?.message}
                                />
                            </Grid>
                            <Grid md={4}>
                                <TextField
                                    {...register("pin")}
                                    type="number"
                                    fullWidth
                                    focused
                                    label="Pin"
                                    error={!!errors.pin}
                                    helperText={errors.pin?.message}
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ border: "1px solid", p: 1 }}>
                            <Grid container spacing={2}>
                                <Grid md={12}>
                                    <Box sx={{ border: "1px solid", p: 1, mt: 2, width: '100%' }}>
                                        <Typography sx={{ textAlign: "center" }}>Temperature Thresholds</Typography>
                                        <CustomSlider
                                            step={0.5}
                                            values={
                                                [
                                                    getValues("minCriticalTemperatureThreshold"),
                                                    getValues("minWarningTemperatureThreshold"),
                                                    getValues("maxWarningTemperatureThreshold"),
                                                    getValues("maxCriticalTemperatureThreshold")
                                                ]
                                            }
                                            min={0}
                                            max={40}
                                            thresholdMarks={[10, 15, 28, 35]}
                                            onChangeCallback={(e, value) => {
                                                setValue("minCriticalTemperatureThreshold", value[0]);
                                                setValue("minWarningTemperatureThreshold", value[1]);
                                                setValue("maxWarningTemperatureThreshold", value[2]);
                                                setValue("maxCriticalTemperatureThreshold", value[3]);
                                            }}
                                            thresholdMarksTitles={
                                                [
                                                    "Critical low",
                                                    "Warning Low",
                                                    "Warning High",
                                                    "Critical High",
                                                ]}
                                            suffix="ºC"
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box sx={{ border: "1px solid", p: 1 }}>
                            <Grid container spacing={2}>
                                <Grid md={12}>
                                    <Box sx={{ border: "1px solid", p: 2, mt: 2, width: '100%' }}>
                                        <Typography sx={{ textAlign: "center" }}>Humidity Thresholds</Typography>
                                        <CustomSlider
                                            step={0.5}
                                            values={
                                                [
                                                    getValues("minCriticalHumidityThreshold"),
                                                    getValues("minWarningHumidityThreshold"),
                                                    getValues("maxWarningHumidityThreshold"),
                                                    getValues("maxCriticalHumidityThreshold")
                                                ]
                                            }
                                            min={0}
                                            max={100}
                                            onChangeCallback={(e, value) => {
                                                setValue("minCriticalHumidityThreshold", value[0]);
                                                setValue("minWarningHumidityThreshold", value[1]);
                                                setValue("maxWarningHumidityThreshold", value[2]);
                                                setValue("maxCriticalHumidityThreshold", value[3]);
                                                return value;
                                            }}
                                            thresholdMarks={[10, 20, 80, 90]}
                                            thresholdMarksTitles={
                                                [
                                                    "Critically low",
                                                    "Warning Low",
                                                    "Warning High",
                                                    "Critically High"
                                                ]}
                                            suffix="%"
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                        <DialogActions>
                            <Grid container spacing={2}>
                                <Grid md={12} sx={{ textAlign: 'center' }}>
                                    <Button
                                        variant="outlined"
                                        color="danger"
                                        sx={{ mr: 3 }}
                                        onClick={() => setShowModal(false)}>
                                        Close
                                    </Button>
                                    <LoadingButton
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
            </Modal>
        </>
    )
}

export default SensorCard;
