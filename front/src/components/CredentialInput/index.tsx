import { useEffect, useState } from 'react';
import { TextField, FormHelperText, MenuItem } from "@mui/material";
import { CredentialCard } from "@/components/CredentialCard";
import { CredentialForm } from "@/pages/Forms/Credential";
import { Grid } from '@mui/joy';
import { CredentialsService } from '@/core/services/credentials';
import { useParams } from 'react-router-dom';
import { NobreakService } from '@/core/services/nobreak';

export const CredentialInput = (props: any) => {
    const { id } = useParams();
    const { data: nobreak } = NobreakService.useGetNobreakById(id);
    const {data: credentials, isFetching} = CredentialsService.useGetCredentials();
    const [selectedCredential, setSelectedCredential] = useState({} as any);
    const watchForm = props.form.watch("credentialId");
    const getCurrentCredential = () => {
        // if (watchForm == "inherit") {
        //     return nobreak?.credential;
        // } else {
            return getCredentialById();
        // }
    }

    const getCredentialById = () => credentials?.filter((credential) => credential.id == watchForm)[0];

    useEffect(() => {
        setSelectedCredential(getCurrentCredential()!);
    }, [watchForm, credentials]);
    return (
        credentials &&
        <>
            <Grid container spacing={1}>
                <Grid md={10}>
                    <TextField
                        id="credentialIdComponent"
                        inputProps={props.form.register('credentialId')}
                        select
                        fullWidth
                        value={watchForm}
                        variant="outlined"
                        label="Select or create a credential"
                        defaultValue=""
                    // helperText="Please select your currency"
                    >
                        {/* {props.source != "nobreakForm" &&
                            <MenuItem key="inherit" value="inherit">
                                Inherit from nobreak
                            </MenuItem>
                        } */}
                        {credentials?.map((credential) => (
                            <MenuItem key={credential.id} value={credential.id} selected={credential.id == selectedCredential?.id}>
                                {credential.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <FormHelperText error={true}>{props.form.errors?.mac?.message}</FormHelperText>
                </Grid>
                <Grid md={2} sx={{display: 'flex'}}>
                    <CredentialForm add fetchCredentials={props.form.fetchCredentials} />
                </Grid>
            </Grid>
            {watchForm != '' &&
                <>
                    <br />
                    <CredentialCard credential={selectedCredential} />
                </>
            }
        </>
    )
};