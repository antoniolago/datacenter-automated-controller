import React, { createContext, useEffect, useState, useContext } from 'react';
import { RuleCard } from "@/components/RuleCard";
import { RuleForm } from "@/pages/Forms/Rule";
import { useParams } from 'react-router-dom';
import { NobreakService } from '@/core/services/nobreak';
import { RuleService } from '@/core/services/rules';
import { IRule } from '@/core/types/rule';
import { FormHelperText, MenuItem, TextField } from '@mui/material';
import { Grid } from '@mui/joy';

export const RuleInput = (props: any) => {
    const { id } = useParams();
    const { data: nobreak } = NobreakService.useGetNobreakById(id);
    const { data: rules } = RuleService.useGetRules();
    const [selectedRule, setSelectedRule] = useState<IRule>();
    const watchForm = props.form.watch("ruleId");
    const getCurrentRule = () => {
        if (watchForm == "inherit") {
            return nobreak?.rule;
        } else {
            return getRuleById();
        }
    }

    const getRuleById = () => rules?.filter((rule: any) => rule.id == watchForm)[0];


    useEffect(() => {
        setSelectedRule(getCurrentRule()!);
    }, [watchForm, rules]);

    return (
        rules &&
        <>
            {/* <h5 className="bold mb-2">Rule <span className="red">*</span> */}
            {/* </h5> */}
            <Grid container spacing={1}>
                <Grid md={10}>
                    <TextField
                        // {...props.register("ruleId")}
                        id="ruleId"
                        select
                        fullWidth
                        value={watchForm}
                        inputProps={props.form.register('ruleId')}
                        variant="outlined"
                        label="Rule"
                        defaultValue=""
                    >
                        {/* <MenuItem key="select" value="" disabled>
                            Select a rule
                        </MenuItem> */}
                        {props.source != "nobreakForm" &&
                            <MenuItem key="inherit" value="inherit">
                                Inherit from nobreak
                            </MenuItem>
                        }
                        {rules?.map((rule: any) => (
                            <MenuItem key={rule.id} value={rule.id} id={rule.id}>
                                {rule.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <FormHelperText error={true}>{props.errors?.rules?.message}</FormHelperText>
                </Grid>
                <Grid md={2} sx={{ display: 'flex' }}>
                    <RuleForm add/>
                </Grid>
            </Grid>
            <br />
            <RuleCard rule={selectedRule} />
        </>
    )
};