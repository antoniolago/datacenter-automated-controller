import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { MachineCard } from '@/components/MachineCard';
import { MachineForm } from '@/pages/Forms/Machine'
import { MachineService } from '@/core/services/machines';
import { useState } from "react";
import { useParams } from 'react-router-dom';

export const Machines = () => {
	const { id } = useParams();
    const { data: machines } = MachineService.useGetMachines();
    
    return (
        <Paper className="p-4">
            <h2>Machines <MachineForm add /></h2>
            <Grid container spacing={2}>
                {machines?.map((machine) => (
                    <Grid item md={3} key={machine.id}>
                        <MachineCard machine={machine} />
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
}

export default Machines;
