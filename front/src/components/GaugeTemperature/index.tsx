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

export interface GaugeTemperatureProps {
    sensor: ISensor;
    rule?: IRule;
}

export const GaugeTemperature = (props: GaugeTemperatureProps) => {
    const { id } = useParams();
    const { rule, sensor } = props;
    var minCritTemperature = rule ? rule.minTemperature : sensor.minCriticalTemperatureThreshold;
    var minWarnTemperature = rule ? rule.minTemperature : sensor.minWarningTemperatureThreshold;
    var maxWarnTemperature = rule ? rule.maxTemperature : sensor.maxWarningTemperatureThreshold;
    var maxCritTemperature = rule ? rule.maxTemperature : sensor.maxCriticalTemperatureThreshold;
    const theme = useTheme()
    return (
        <>
            <GaugeComponent
                type="semicircle"
                value={sensor?.data?.temperature ?? 15}
                minValue={0}
                maxValue={40}
                style={{ width: '100%', textAlign: 'center' }}
                labels={{
                    tickLabels: {
                        defaultTickValueConfig: {
                            formatTextValue(value) {
                                return `${value}°C`;
                            },
                        }
                    },
                    valueLabel: {
                        formatTextValue(value) {
                            return `${value}°C`;
                        },
                        matchColorWithArc: true
                    }
                }}
                arc={{
                    padding: 0.005,
                    cornerRadius: 1,
                    width: 0.2,
                    subArcs: [
                        {
                            limit: minCritTemperature,
                            //@ts-ignore
                            color: theme.palette.error.main,
                            showTick: true,
                        },
                        {
                            limit: minWarnTemperature,
                            //@ts-ignore
                            color: theme.palette.warning.main,
                            showTick: true,
                        },
                        {
                            limit: maxWarnTemperature,
                            //@ts-ignore
                            color: theme.palette.success.main,
                            showTick: true,
                        },
                        {
                            limit: maxCritTemperature,
                            //@ts-ignore
                            color: theme.palette.warning.main,
                            showTick: true,
                        },
                        {
                            // limit: maxCritTemperature,
                            //@ts-ignore
                            color: theme.palette.error.main,
                        }
                    ]
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
export default GaugeTemperature;