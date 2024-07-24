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

export interface GaugeChargeProps {
    rule: IRule;
    ruleForm?: boolean;
}

export const GaugeCharge = (props: GaugeChargeProps) => {
    const { id } = useParams();
    const { data: nobreak } = NobreakService.useGetNobreakById(id);
    const { rule } = props;
    const theme = useTheme()
    return (
        <>
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
            </Box>
            <Box sx={{
                filter: nobreak?.batteryCharge >= 0 ? "none" : "blur(3.1px)", width: "100%"
            }}>
                <GaugeComponent
                    type='semicircle'
                    style={{ width: "100%" }}
                    arc={{
                        width: 0.2,
                        padding: 0.005,
                        cornerRadius: 1,
                        subArcs: [
                            {
                                limit: 50,
                                //@ts-ignore
                                color: theme.palette.error.main,
                                showTick: true,
                                tooltip: {
                                    text: 'Too low charge!'
                                },
                                onClick: () => console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"),
                                onMouseMove: () => console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB"),
                                onMouseLeave: () => console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC"),
                            },
                            {
                                //@ts-ignore
                                color: theme.palette.warning.main,
                                showTick: true,
                                tooltip: {
                                    text: 'Low charge!'
                                }
                            },
                            {
                                //@ts-ignore
                                color: theme.palette.success.main,
                                showTick: true,
                                tooltip: {
                                    text: 'OK charge!'
                                }
                            }
                        ]
                    }}
                    pointer={{
                        //@ts-ignore
                        color: theme.palette.text.main,
                        length: 0.90,
                        width: 25,
                    }}
                    labels={{
                        descriptionLabel: {
                            labelText: 'Charge'
                        },
                        valueLabel: {
                            formatTextValue: value => value + '%',
                            matchColorWithArc: true
                        },
                        tickLabels: {
                            ticks: [
                                { value: rule.chargeToShutdown, valueConfig: { formatTextValue: value => value + '% Shutdown' } },
                                { value: rule.chargeToWol, valueConfig: { formatTextValue: value => value + '% WoL' } },
                            ],
                            type: 'outer',
                            defaultTickValueConfig: { formatTextValue: value => value + '%', style: { fontSize: 10 } },
                        },
                    }}
                    value={nobreak?.batteryCharge}
                    minValue={0}
                    maxValue={100}
                />
            </Box>
        </>
    );
}
export default GaugeCharge;