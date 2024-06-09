import styled from 'styled-components';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';

export const StyledTemperatureSlider = styled(Slider)`
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

export const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
          viewBox="0 0 491.173 491.173" xml:space="preserve">
     <path fill="${encodeURIComponent('#D5D6DB')}" d="M296.975,275.165V56.156C296.975,25.142,271.834,0,240.82,0h-0.001
         c-31.013,0-56.156,25.142-56.156,56.156v219.009c-35.281,19.717-59.149,57.413-59.149,100.703
         c0,63.681,51.624,115.305,115.305,115.305c63.683,0,115.307-51.624,115.307-115.305
         C356.126,332.578,332.257,294.882,296.975,275.165z"/>
     <path fill="${encodeURIComponent('#EBF0F3')}" d="M240.82,482.841c-58.985,0-106.974-47.988-106.974-106.974c0-38.711,21.03-74.512,54.882-93.431
         l4.266-2.386V56.156c0-26.373,21.453-47.826,47.826-47.826s47.826,21.453,47.826,47.826V280.05l4.266,2.386
         c33.852,18.919,54.882,54.72,54.882,93.431C347.793,434.853,299.805,482.841,240.82,482.841z"/>
     <path fill="${encodeURIComponent('#E1E6E9')}" d="M252.926,56.153c0-6.671-5.433-12.104-12.105-12.104c-6.672,0-12.105,5.434-12.105,12.104v112.749
         h24.21V56.153z"/>
     <path fill="${encodeURIComponent('#E56353')}" d="M275.452,313.601l-6.875-3.851c-9.667-5.415-15.651-15.63-15.651-26.713V168.902h-24.21v114.141
         c0,11.078-5.985,21.292-15.648,26.707l-6.913,3.876c-29.308,16.364-44.19,51.695-32.696,85.601
         c8.466,24.973,30.928,43.473,57.034,47.163c43.858,6.196,81.579-27.84,81.579-70.522
         C312.072,350.08,298.058,326.228,275.452,313.601z"/>
     <g>
         <rect x="317.167" y="53.12" fill="${encodeURIComponent('#3A556A')}" width="30.628" height="8.929"/>
         <rect x="317.167" y="72.418" fill="${encodeURIComponent('#3A556A')}" width="48.492" height="8.929"/>
         <rect x="317.167" y="91.72" fill="${encodeURIComponent('#3A556A')}" width="30.628" height="8.929"/>
         <rect x="317.167" y="111.017" fill="${encodeURIComponent('#3A556A')}" width="30.628" height="8.929"/>
         <rect x="317.167" y="130.32" fill="${encodeURIComponent('#3A556A')}" width="48.492" height="8.929"/>
         <rect x="317.167" y="149.637" fill="${encodeURIComponent('#3A556A')}" width="30.628" height="8.929"/>
         <rect x="317.167" y="168.94" fill="${encodeURIComponent('#3A556A')}" width="30.628" height="8.929"/>
         <rect x="317.167" y="188.217" fill="${encodeURIComponent('#3A556A')}" width="48.492" height="8.929"/>
         <rect x="317.167" y="207.519" fill="${encodeURIComponent('#3A556A')}" width="30.628" height="8.929"/>
         <rect x="317.167" y="226.796" fill="${encodeURIComponent('#3A556A')}" width="30.628" height="8.929"/>
         <rect x="317.167" y="246.098" fill="${encodeURIComponent('#3A556A')}" width="48.492" height="8.929"/>
     </g>
     </svg>')`,
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette?.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: theme.palette?.mode === 'dark' ? '#003892' : '#001e3c',
        width: 32,
        height: 32,
        '&:before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                '#fff',
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette?.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2,
    },
}));