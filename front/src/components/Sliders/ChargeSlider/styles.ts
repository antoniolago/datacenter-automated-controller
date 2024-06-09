import styled from 'styled-components';
import Slider from '@mui/material/Slider';

export const StyledChargeSlider = styled(Slider)`
    .MuiSlider-rail{
        background: linear-gradient(to left,red,red 20%,yellow 31%, green 50%,green, blue 86%);
    }
    .MuiSlider-track{
        border: 1px solid #565685a8;
        background-color: #ffffff00;
    }
    .MuiSlider-thumb{
        width: 15px;
        height: 15px;
        background-color: #ffffff;
    }
`;
