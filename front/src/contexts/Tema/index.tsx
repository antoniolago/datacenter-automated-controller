import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
// import StarrySky from '@/components/StarrySky';
import { bgBG as coreBgBG } from '@mui/material/locale';
import { bgBG, ptBR } from '@mui/x-data-grid';
import {
	experimental_extendTheme as materialExtendTheme,
	Experimental_CssVarsProvider as MaterialCssVarsProvider,
	THEME_ID as MATERIAL_THEME_ID,
} from '@mui/material/styles';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import { useColorScheme as useJoyColorScheme } from '@mui/joy/styles';
import { useColorScheme as useMaterialColorScheme } from '@mui/material/styles';
export const TemaContext = createContext<any>({} as any);

const materialTheme = materialExtendTheme();
export const darkTheme = createTheme({
	components: {
		MuiOutlinedInput: {
			styleOverrides: {
				input: {
					'&:-webkit-autofill': {
						WebkitTextFillColor: 'black'
					}
				},
			},
		},
		MuiInputLabel: {
			styleOverrides: {
				root: {
					fontWeight: 'bold',
					marginBottom: "3px"
				}
			}
		}
	},
	palette: {
		background: {
			default: '#11141e',//'#0e2b42',
			paper: 'rgb(45 42 42)'
		},
		mode: 'dark',
		primary: {
			light: '#757ce8',
			main: '#5575c0',//1642a7',
			dark: '#1b1849',
			contrastText: '#fafafa',
		},
		secondary: {
			light: '#fff',
			main: '#fafafa',
			dark: '#707070',
			contrastText: '#000',
		},

	},
	// typography: {
	// 	fontFamily: 'Poppins',
	// },
},
	ptBR);
export const lightTheme = createTheme({
	components: {
		MuiInputLabel: {
			styleOverrides: {
				root: {
					fontWeight: 'bold',
					marginBottom: "3px"
				}
			}
		}
	},
	palette: {
		background: {
			default: '#fafafa',
			paper: '#fafafa'
		},
		secondary: {
			light: '#fff',
			main: '#5575c0',
			dark: '#707070',
			contrastText: '#fafafa',
		},
		mode: 'light'
	}
},
	ptBR);
export const Tema = (props: any) => {
	const [isDarkTheme, setIsDarkTheme] = useState<boolean>(localStorage.getItem('tema') == 'dark');
	const { mode, setMode: setMaterialMode } = useMaterialColorScheme();
	const { setMode: setJoyMode } = useJoyColorScheme();
	// const trocaLogo = (temaSelecionado: string) => {
	// document.querySelectorAll('.logoEspaco').forEach((logo: any) => {
	// 	if(temaSelecionado == 'tema-escuro'){
	// 		logo.src = LogoEspacoEscuro
	// 	}else{
	// 		logo.src = LogoEspaco
	// 	}
	// })
	// }

	// const trocaLogo = (isDarkThemeLogo: boolean) => {
	// 	document.querySelectorAll('.logoEspaco').forEach((logo: any) => {
	// 		logo.src = isDarkThemeLogo ? LogoEspacoEscuro : LogoEspaco;
	// 	})
	// }
	useEffect(() => {
		localStorage.setItem('tema', isDarkTheme ? 'dark' : 'light');

		setMaterialMode(isDarkTheme ? 'dark' : 'light');
		setJoyMode(isDarkTheme ? 'dark' : 'light');
	}, [isDarkTheme]);

	return (
		<ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
			<TemaContext.Provider value={{ isDarkTheme, setIsDarkTheme }}>
				{/* @ts-ignore */}
				{props.children}
				<CssBaseline />
				{/* <StarrySky /> */}
			</TemaContext.Provider >
		</ThemeProvider>

	);
};