import React, { useContext, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { NobreakCard } from '@/components/NobreakCard';
import { PageTitle } from '@/components/PageTitle';
import { AppSettingsService } from '@/core/services/appsettings';
import { INobreak } from '@/core/types/nobreak';
import { NobreakForm } from '../Forms/Nobreak';
import { NobreakService } from '@/core/services/nobreak';
import { UpsdOutput } from '@/components/UpsdOutput';
export const Home = () => {
	const { data: nobreaks } = NobreakService.useGetNobreaks();
	const { data: appSettings } = AppSettingsService.useGetAppSettings();
	document.title = `${appSettings?.APP_NAME} - Home`;
	return (
		<>
			<PageTitle
				title={`Nobreak list`}
				backTo={false}
				action={<NobreakForm add />} />
			<Grid container spacing={{ xs: 2, md: 3 }}>
				{nobreaks != undefined &&
					nobreaks?.map((nobreak: INobreak) => (
						<Grid item md={4} key={nobreak.id}>
							<NobreakCard nobreak={nobreak} />
						</Grid>
					))
				}
			</Grid>
			{/* <UpsdOutput /> */}
		</>
	);
}

export default Home;
