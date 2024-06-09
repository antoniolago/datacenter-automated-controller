import { HumiditySwitch, StyledHumiditySlider } from './styles';
import { useForm, Controller } from "react-hook-form";
import Grid from '@mui/material/Grid';

export const HumiditySlider = (props: any) => {
    function valuetext(value: any) {
        return `${value}%`;
    }

    const marks = [
        {
            value: 0,
            label: '0%',
        },
        {
            value: 25,
            label: '25%',
        },
        {
            value: 50,
            label: '50%',
        },
        {
            value: 75,
            label: '75%',
        },
        {
            value: 100,
            label: '100%',
        }
    ];
    return (
        <Grid container spacing={2}>
            <Grid item md={2}>
                <Controller
                    control={props.control}
                    name="humidityAutomationEnabled"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <HumiditySwitch 
                            sx={{ m: 1 }} 
                            defaultChecked
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value}
                        />
                    )}
                />
            </Grid>
            <Grid item>
                <Controller
                    control={props.control}
                    name="humidityAutomationRange"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <StyledHumiditySlider
                            getAriaLabel={() => 'Umidity'}
                            // orientation="vertical"
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value}
                            getAriaValueText={valuetext}
                            defaultValue={[16, 30]}
                            valueLabelDisplay="auto"
                            track="inverted"
                            marks={marks}
                        />
                    )}
                />
            </Grid>
        </Grid>
    );
}