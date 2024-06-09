import { MaterialUISwitch, StyledTemperatureSlider } from './styles';
import Grid from '@mui/material/Grid';

export const TemperatureSlider = (props: any) => {
    function valuetext(value: any) {
        return `${value}°C`;
    }
    const marks = [
        {
            value: 10,
            label: '10°C',
        },
        {
            value: 16,
            label: '16°C',
        },
        {
            value: 30,
            label: '30°C',
        },
        {
            value: 40,
            label: '40°C',
        },
    ];
    return (
        <>
            <Grid container spacing={2}>
                <Grid item md={2}>
                    <MaterialUISwitch sx={{ m: 1 }} defaultChecked />
                </Grid>
                <Grid item>
                    <StyledTemperatureSlider
                        getAriaLabel={() => 'Temperature'}
                        // orientation="vertical"
                        min={10}
                        max={40}
                        getAriaValueText={valuetext}
                        defaultValue={[16, 30]}
                        valueLabelDisplay="auto"
                        marks={marks}
                    />
                </Grid>
            </Grid>
        </>
    );
}