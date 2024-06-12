import React, { createContext, useEffect, useState, useContext } from 'react';
import { RuleCard } from "@/components/RuleCard";
import { RuleForm } from "@/pages/Forms/Rule";
import { useParams } from 'react-router-dom';
import { NobreakService } from '@/core/services/nobreak';
import { RuleService } from '@/core/services/rules';
import { IRule } from '@/core/types/rule';
import { FormHelperText, MenuItem, TextField } from '@mui/material';
import { Grid } from '@mui/joy';
import { MachineService } from '@/core/services/machines';

export const OperationalSystemInput = (props: any) => {
    const { id } = useParams();
    const { data: operationalSystems } = MachineService.useGetOperationalSystems();
    const [selectedRule, setSelectedRule] = useState<IRule>();
    const watchForm = props.form.watch("operationalSystemId");

    const getRuleById = () => operationalSystems?.filter((rule: any) => rule.id == watchForm)[0];

    return (
        operationalSystems &&
        <>
            <Grid container spacing={1}>
                <Grid md={12}>
                    <TextField
                        // {...props.register("ruleId")}
                        id="operationalSystemId"
                        select
                        fullWidth
                        value={watchForm}
                        inputProps={props.form.register('operationalSystemId')}
                        variant="outlined"
                        label="Operational System"
                        defaultValue=""
                    >
                        {operationalSystems?.map((operationalSystem: any) => (
                            <MenuItem key={operationalSystem.id} value={operationalSystem.id} id={operationalSystem.id}>
                                {operationalSystem.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <FormHelperText error={true}>{props.errors?.operationalSystemId?.message}</FormHelperText>
                </Grid>
                {/* <Grid md={2} sx={{ display: 'flex' }}>
                    <RuleForm add/>
                </Grid> */}
            </Grid>
            <br />
            <RuleCard rule={selectedRule} />
        </>
    )
};