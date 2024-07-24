import Typography from '@mui/material/Typography';
import { Alert, Box, Grid, useTheme } from '@mui/joy';
import { useApi } from '@/core/services/api';
import GaugeComponent from '../GaugeComponent';
import { SensorService } from '@/core/services/sensor';
import { IRule } from '@/core/types/rule';
import Warning from '@mui/icons-material/Warning';
import { NobreakService } from '@/core/services/nobreak';
import { useParams } from 'react-router-dom';
import { IMachine } from '@/core/types/machine';
import GaugeCharge from '../GaugeCharge';
import GaugeHumidity from '../GaugeHumidity';
import GaugeTemperature from '../GaugeTemperature';

interface RulesDashBoardProps {
    rule: IRule;
    machine: IMachine;
}

export const RulesDashboard = (props: RulesDashBoardProps) => {
    const { id } = useParams();
    const { data: nobreak } = NobreakService.useGetNobreakById(id);
    const { rule, machine } = props;
    const { data: sensor, isFetching } = SensorService.useGetData();
    const theme = useTheme()
    const { api } = useApi();
    return (
        rule && sensor &&
        <>
            <Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
                Automated Rule "{rule.name}" Stats
            </Typography>
            {!sensor || !rule ? <>Erro</> :
                <Grid container>
                    <Grid md={4} sx={{
                        height: "40px"
                    }}>
                        <GaugeTemperature sensor={sensor} rule={rule} />
                        <Typography sx={{ textAlign: "center" }} variant="body2" color="text.secondary">
                            Temperature
                        </Typography>
                        <Typography
                            sx={{ textAlign: "center" }}
                            variant="body2"
                            color="error.main"
                        >
                            This machine will <b>SHUTDOWN</b> if the temperature is below {" "}
                            <b>{rule.minTemperature}ºC</b> or above <b>{rule.maxTemperature}ºC</b>
                        </Typography>
                    </Grid>
                    <Grid md={4}>
                        <GaugeHumidity rule={rule} sensor={sensor} />
                        <Typography sx={{ textAlign: "center" }} variant="body2" color="text.secondary">
                            Humidity
                        </Typography>
                        <Typography
                            sx={{ textAlign: "center" }}
                            variant="body2"
                            color="error.main"
                        >
                            This machine will <b>SHUTDOWN</b> if the humidity gets below {" "}
                            <b>{rule.minHumidity}%</b> or above <b>{rule.maxHumidity}%</b>
                        </Typography>
                    </Grid>

                    <Grid md={4}>
                        <GaugeCharge rule={rule} />
                        <Typography
                            sx={{ textAlign: "center" }}
                            variant="body2"
                            color="error.main"
                        >
                            This machine will: <br /><b>SHUTDOWN</b>: if power is off and battery charge is below {" "}
                            <b> {rule.chargeToShutdown}%</b><br />
                            <b>Wake-On-Lan</b> if power is on and battery charge is higher than <b>{rule.chargeToWol}%</b>
                        </Typography>
                    </Grid>
                </Grid>
            }
        </>
    );
}
export default RulesDashboard;