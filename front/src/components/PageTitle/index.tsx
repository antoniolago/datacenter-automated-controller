import React from 'react';
import IconButton from '@mui/material/IconButton';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';

export const PageTitle = (props: any) => {
    const navigate = useNavigate();
    const BackButton = styled(IconButton)`
        padding-top: 2px;
        color: brown;
    `;
    return (
        <h1 className="mb-3">
            {props.backTo != false &&
                <BackButton aria-label="back" onClick={() => navigate(props.backTo || "/")}>
                    <ArrowBackIos />
                </BackButton>
            }
            <span>{props.title}</span>
            {props.action}
        </h1>
    );
}