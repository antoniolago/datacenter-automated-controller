import { ContainerLoading } from './styles';
import CircularProgress from '@mui/material/CircularProgress'
import { Box } from '@mui/joy';

const Loading = (props: any) => {
	return (
		//@ts-ignore
		<Box style={{ textAlign: '-webkit-center' }} {...props}>
			<ContainerLoading>
				<CircularProgress size={props.size} />
				{/* <AnimacaoLottie speed={1.5} size={props.size} json={loading} /> */}
			</ContainerLoading>
		</Box>
	);
}

export default Loading;
