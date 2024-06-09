
import { createContext, useEffect, useState } from 'react';
import { Modal } from "@/components/Modal";
import Button from '@mui/material/Button';
import { CredentialCard } from "@/components/CredentialCard";
import { CredentialForm } from '@/pages/Forms/Credential';
import { useApi } from "@/core/services/api";
export const AppContext = createContext(undefined);

export const Credentials = (props: any) => {
    const [showForm, setShowForm] = useState(false);
    const [credentials, setCredentials] = useState([]);
    const { api } = useApi();

    useEffect(() => {
        fetchCredentials();
    }, []);
    const fetchCredentials = () => {
        api.get("/credentials")
            .then((res) => setCredentials(res.data.data))
            .catch((error) => { })
    }

    return (
        <Modal
            show={props.show}
            setShow={props.setShow}
            title="Credentials"
            text="Manage your credentials"
            titleActions={
                <CredentialForm fetchCredentials={fetchCredentials} show={showForm} setShow={setShowForm} add />
            }
            actions={
                <Button onClick={() => props.setShow(false)}>Close</Button>
            }
            size="lg"
        >
            {credentials?.map((credential, index) => (
                <CredentialCard fetchCredentials={fetchCredentials} credential={credential} key={index} />
            ))}
        </Modal>
    )
};