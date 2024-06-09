import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
	Outlet,
} from 'react-router-dom';
import {
	experimental_extendTheme as materialExtendTheme,
	Experimental_CssVarsProvider as MaterialCssVarsProvider,
	THEME_ID as MATERIAL_THEME_ID,
} from '@mui/material/styles';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import { ptBR } from '@mui/x-data-grid';
import { Toaster } from 'sonner';
import { useApi } from '@/core/services/api';
import { Tema } from '@/contexts/Tema';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import NobreakPage from '@/pages/Nobreak';

const materialTheme = materialExtendTheme({}, ptBR);
function App() {
	const { isLogado } = useApi();
	function RequireAuth({ children }: any) {
		return isLogado() ?
			<Layout>
				{children}
			</Layout>
			:
			<Navigate to="/login" />;
	}

	return (
		<MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }} defaultMode="system">
			<JoyCssVarsProvider defaultMode="system">
				<Router>
					<Tema>
						<Routes>
							<Route
								element={<Layout><Outlet /></Layout>}
							>
								<Route element={<Home />} path="/" />
								<Route element={<NobreakPage />} path="/nobreak/:id" />
							</Route>
						</Routes>
						{/* <GlobalStyles /> */}
					</Tema >
				</Router>

				<Toaster position="top-center" richColors closeButton />
			</JoyCssVarsProvider>
		</MaterialCssVarsProvider>
	);
}

// var Route = ({component: Component, ...rest }: any) => {
// 	if (!isAuthenticated) return <Redirect to="/login" />;

// 	return (
// 		<Route
// 			{...rest}
// 			render={(props) =>
// 				isAuthenticated ? (
// 					<Component {...props} />
// 				) : (
// 					<Redirect
// 						to={{
// 							pathname: '/',
// 							state: { from: props.location },
// 						}}
// 					/>
// 				)
// 			}
// 		/>
// 	);
// };

export default App;