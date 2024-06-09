
import { createContext, useEffect, useState } from 'react';
import { useApi } from '@/core/services/api';
import { Modal } from "@/components/Modal";
import Button from '@mui/material/Button';
import { RuleCard } from "@/components/RuleCard";
import { RuleForm } from '@/pages/Forms/Rule';

export const AppContext = createContext(undefined);

export const Rules = (props: any) => {
    const [showForm, setShowForm] = useState(false);
    const [rules, setRules] = useState([]);
    const { api } = useApi();

    return (
        <Modal
            show={props.show}
            setShow={props.setShow}
            title="Rules"
            text="Manage your parameters rules"
            titleActions={
                <RuleForm show={showForm} setShow={setShowForm} add />
            }
            actions={
                <Button onClick={() => props.setShow(false)}>Close</Button>
            }
            size="lg"
        >
            {rules?.map((rule, index) => (
                <RuleCard rule={rule} key={index} />
            ))}
        </Modal>
    )
};