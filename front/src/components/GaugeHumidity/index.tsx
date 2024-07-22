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
import { ISensor } from '@/core/types/sensor';

export interface GaugeHumidityProps {
    sensor: ISensor;
    rule?: IRule;
}

export const GaugeHumidity = (props: GaugeHumidityProps) => {
    const { id } = useParams();
    const { data: nobreak } = NobreakService.useGetNobreakById(id);
    const { rule, sensor } = props;
    var minCritHumidity = (rule ? rule.minHumidity : sensor.minCriticalHumidityThreshold);
    var minWarnHumidity = (rule ? rule.minHumidity : sensor.minWarningHumidityThreshold);
    var maxWarnHumidity = (rule ? rule.maxHumidity : sensor.maxWarningHumidityThreshold);
    var maxCritHumidity = (rule ? rule.maxHumidity : sensor.maxCriticalHumidityThreshold);
    console.log("minCritHumidity", minCritHumidity)
    console.log("minWarnHumidity", minWarnHumidity)
    console.log("maxWarnHumidity", maxWarnHumidity)
    console.log("maxCritHumidity", maxCritHumidity)
    const theme = useTheme()
    var tresholds = [
        {
            limit: minCritHumidity,
            //@ts-ignore
            color: theme.palette.error.main,
            showTick: true,
        },
        {
            limit: minWarnHumidity,
            //@ts-ignore
            color: theme.palette.warning.main,
            showTick: true,
        },
        {
            limit: maxWarnHumidity,
            //@ts-ignore
            color: theme.palette.success.main,
            showTick: true,
        },
        {
            limit: maxCritHumidity,
            //@ts-ignore
            color: theme.palette.warning.main,
            showTick: true,
        },
        {
            //@ts-ignore
            color: theme.palette.error.main,
        }
    ]
    return (
        <>

            <GaugeComponent
                type="semicircle"
                value={sensor?.data?.humidity ?? 50}
                minValue={0}
                maxValue={100}
                style={{ width: '100%', textAlign: 'center' }}
                labels={{
                    tickLabels: {
                        defaultTickValueConfig: {
                            formatTextValue(value) {
                                return `${value}%`;
                            },
                        }
                    },
                    valueLabel: {
                        formatTextValue(value) {
                            return `${value}%`;
                        },
                        matchColorWithArc: true
                    }
                }}
                arc={{
                    width: 0.2,
                    padding: 0.005,
                    cornerRadius: 1,
                    subArcs: tresholds
                }}
                pointer={{
                    //@ts-ignore
                    color: theme.palette.text.main,
                    length: 0.90,
                    width: 25,
                    // elastic: true,
                }}
            />
        </>
    );
}
export default GaugeHumidity;