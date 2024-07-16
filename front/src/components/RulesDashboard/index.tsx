import Typography from '@mui/material/Typography';
import { Alert, Box, Grid } from '@mui/joy';
import { useApi } from '@/core/services/api';
import GaugeComponent from '../GaugeComponent';
import { SensorService } from '@/core/services/sensor';
import { IRule } from '@/core/types/rule';
import Warning from '@mui/icons-material/Warning';
import { NobreakService } from '@/core/services/nobreak';
import { useParams } from 'react-router-dom';
import { IMachine } from '@/core/types/machine';

interface RulesDashBoardProps {
    rule: IRule;
    machine: IMachine;
}

export const RulesDashboard = (props: RulesDashBoardProps) => {
    const { id } = useParams();
    const { data: nobreak } = NobreakService.useGetNobreakById(id);
    const { rule, machine } = props;
    const { data: sensor, isFetching } = SensorService.useGetData();
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
                        <GaugeComponent
                            type='semicircle'
                            arc={{
                                width: 0.2,
                                padding: 0.005,
                                cornerRadius: 1,
                                // gradient: true,
                                subArcs: [
                                    {
                                        limit: rule.minTemperature,
                                        color: '#EA4228',
                                        showTick: false,
                                        tooltip: {
                                            text: `Too low temperature! ${machine?.name} will shutdown`
                                        },
                                        onClick: () => console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"),
                                        onMouseMove: () => console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB"),
                                        onMouseLeave: () => console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC"),
                                    },
                                    {
                                        limit: rule.minTemperature + 2,
                                        color: '#F5CD19',
                                        showTick: true,
                                        tooltip: {
                                            text: 'Low temperature!'
                                        }
                                    },
                                    {
                                        limit: rule.maxTemperature - 4,
                                        color: '#5BE12C',
                                        showTick: true,
                                        tooltip: {
                                            text: 'OK temperature!'
                                        }
                                    },
                                    {
                                        limit: rule.maxTemperature - 2,
                                        color: '#F5CD19',
                                        showTick: true,
                                        tooltip: {
                                            text: 'High temperature!'
                                        }
                                    },
                                    {
                                        limit: rule.maxTemperature,
                                        color: '#EA4228',
                                        tooltip: {
                                            text: `Too high temperature! ${machine?.name} will shutdown`
                                        }
                                    }
                                ]
                            }}
                            pointer={{
                                color: '#345243',
                                length: 0.90,
                                width: 25,
                                // elastic: true,
                            }}
                            labels={{
                                descriptionLabel: {
                                    labelText: 'Temperature' //TODO: make this for all gauges, currently only works on grafana
                                },
                                valueLabel: { formatTextValue: value => value + 'ºC' },
                                tickLabels: {
                                    type: 'outer',
                                    defaultTickValueConfig: { formatTextValue: value => value + 'ºC', style: { fontSize: 10 } },
                                    ticks: [
                                        { value: rule.minTemperature, valueConfig: { formatTextValue: value => value + 'ºC' } },
                                        // { value: 22.5 },
                                        // { value: 32 }
                                    ],
                                }
                            }}
                            value={sensor.data?.temperature}
                            minValue={10}
                            maxValue={36}
                        />
                        <Typography sx={{ textAlign: "center" }} variant="body2" color="text.secondary">
                            Temperature
                        </Typography>
                    </Grid>
                    <Grid md={4}>
                        <GaugeComponent
                            type='semicircle'
                            arc={{
                                width: 0.2,
                                padding: 0.005,
                                cornerRadius: 1,
                                // gradient: true,
                                subArcs: [
                                    {
                                        limit: rule.minHumidity,
                                        color: '#EA4228',
                                        showTick: true,
                                        tooltip: {
                                            text: 'Too low humidity!'
                                        },
                                        onClick: () => console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"),
                                        onMouseMove: () => console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB"),
                                        onMouseLeave: () => console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC"),
                                    },
                                    {
                                        limit: rule.minHumidity + 5,
                                        color: '#F5CD19',
                                        showTick: true,
                                        tooltip: {
                                            text: 'Low humidity!'
                                        }
                                    },
                                    {
                                        limit: rule.maxHumidity - 5,
                                        color: '#5BE12C',
                                        showTick: true,
                                        tooltip: {
                                            text: 'OK humidity!'
                                        }
                                    },
                                    {
                                        limit: rule.maxHumidity,
                                        color: '#F5CD19',
                                        showTick: true,
                                        tooltip: {
                                            text: 'High humidity!'
                                        }
                                    },
                                    {
                                        color: '#EA4228',
                                        tooltip: {
                                            text: 'Too high humidity!'
                                        }
                                    }
                                ]
                            }}
                            pointer={{
                                color: '#345243',
                                length: 0.90,
                                width: 20,
                                // elastic: true,
                            }}
                            labels={{
                                descriptionLabel: {
                                    labelText: 'Humidity' //TODO: make this for all gauges, currently only works on grafana
                                },
                                valueLabel: { formatTextValue: value => value + '%' },
                                tickLabels: {
                                    type: 'outer',
                                    defaultTickValueConfig: { formatTextValue: value => value + '%', style: { fontSize: 10 } },
                                }
                            }}
                            value={sensor.data?.humidity}
                            minValue={0}
                            maxValue={100}
                        />
                        <Typography sx={{ textAlign: "center" }} variant="body2" color="text.secondary">
                            Humidity
                        </Typography>
                    </Grid>

                    <Grid md={4}>
                        <Box sx={{ position: 'relative' }}>
                            {!nobreak?.batteryCharge &&
                                <Alert
                                    sx={{
                                        fontSize: "12px",
                                        textAlign: "center",
                                        position: "absolute",
                                        zIndex: "10",
                                        width: "100%",
                                        opacity: 0.9,
                                        display: "inline-block",
                                        left: "50%",
                                        top: "20px",
                                        transform: "translateX(-50%)",
                                    }}
                                    startDecorator={
                                        <Warning />
                                    }
                                    color="danger"
                                >
                                    <Typography>
                                        UPS data not available, check logs for more information. <br />
                                        The temperature/humidity sensors data will still be used to apply rules.
                                    </Typography>
                                </Alert>
}
                                <Box sx={{
                                    filter: nobreak?.batteryCharge >= 0 ? "none" : "blur(3.1px)",
                                }}>
                                    <GaugeComponent
                                        type='semicircle'
                                        arc={{
                                            width: 0.2,
                                            padding: 0.005,
                                            cornerRadius: 1,
                                            subArcs: [
                                                {
                                                    limit: 50,
                                                    color: '#EA4228',
                                                    showTick: true,
                                                    tooltip: {
                                                        text: 'Too low charge!'
                                                    },
                                                    onClick: () => console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"),
                                                    onMouseMove: () => console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB"),
                                                    onMouseLeave: () => console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC"),
                                                },
                                                {
                                                    color: '#F5CD19',
                                                    showTick: true,
                                                    tooltip: {
                                                        text: 'Low charge!'
                                                    }
                                                },
                                                {
                                                    color: '#5BE12C',
                                                    showTick: true,
                                                    tooltip: {
                                                        text: 'OK charge!'
                                                    }
                                                }
                                            ]
                                        }}
                                        pointer={{
                                            color: '#345243',
                                            length: 0.80,
                                            width: 15,
                                        }}
                                        labels={{
                                            descriptionLabel: {
                                                labelText: 'Temperature'
                                            },
                                            valueLabel: { formatTextValue: value => value + '%' },
                                            tickLabels: {
                                                ticks: [
                                                    { value: rule.chargeToShutdown, valueConfig: { formatTextValue: value => value + '% Shutdown' } },
                                                    { value: rule.chargeToWol, valueConfig: { formatTextValue: value => value + '% WoL' } },
                                                ],
                                                type: 'outer',
                                                defaultTickValueConfig: { formatTextValue: value => value + '%', style: { fontSize: 10 } },
                                            },
                                        }}
                                        value={sensor.charge}
                                        minValue={0}
                                        maxValue={100}
                                    />
                                    <Typography sx={{ textAlign: "center" }} variant="body2" color="text.secondary">
                                        Charge
                                    </Typography>
                                </Box>
                        </Box>
                    </Grid>
                </Grid>
            }
        </>
    );
}
export default RulesDashboard;