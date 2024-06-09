
import React, { createContext, useEffect, useState } from 'react';
import { useApi } from '@/core/services/api';
// import { SensorCard } from "@/components/SensorCard";
// import { SensorForm } from '@/pages/Forms/Sensor';
import { AxiosError, AxiosResponse } from "axios";
import {
    Button,
    Modal,
    ModalClose,
    ModalDialog,
} from "@mui/joy";
export const AppContext = createContext(undefined);

export const Sensors = (props: any) => {
    const [showForm, setShowForm] = useState(false);
    const [sensors, setSensors] = useState([]);
    const { api } = useApi();

    useEffect(() => {
        fetchSensors();
    }, []);

    const fetchSensors = () => {
        api.get("/sensors")
            .then((res: AxiosResponse) => setSensors(res.data.data))
            .catch((error: AxiosError) => { })
    }

    return (
        <Modal
            open={props.show}
            onClose={props.setShow}
        >
            <ModalDialog>
                <ModalClose />
                {/* <SensorForm fetchSensors={fetchSensors} show={showForm} setShow={setShowForm} add /> */}
                {/* {sensors?.map((sensor, index) => (
                    <SensorCard fetchSensors={fetchSensors} sensor={sensor} key={index} />
                ))} */}
            </ModalDialog>
        </Modal>
    )
};