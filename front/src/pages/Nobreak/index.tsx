import { useState } from 'react';
import { useParams } from "react-router";
import { PageTitle } from '@/components/PageTitle';
import Paper from '@mui/material/Paper';
import BatteryGauge from 'react-battery-gauge'
import { UpsdrvctlOutput } from '@/components/UpsdrvctlOutput';
import { Machines } from '@/pages/Nobreak/Machines';
import { AppSettingsService } from '@/core/services/appsettings';
import { NobreakService } from '@/core/services/nobreak';
import { Box, Button, Grid, Modal, ModalClose, ModalDialog, Typography } from '@mui/joy';
import GaugeComponent from '@/components/GaugeComponent';
import { NobreakForm } from '../Forms/Nobreak';
import DeleteNobreakModal from '@/components/DeleteNobreakModal';

export const NobreakPage = () => {
	const { id } = useParams();
	const [openConsole, setOpenConsole] = useState(false);
	const { data: nobreak } = NobreakService.useGetNobreakById(id);
	const { data: appSettings } = AppSettingsService.useGetAppSettings();
	var obj = <UpsdrvctlOutput id={id} />
	document.title = `${appSettings?.APP_NAME} - Nobreak`;
	return (
		<>
			<Modal open={openConsole} onClose={() => setOpenConsole(false)}>
				<ModalDialog>
					<ModalClose />
					<Typography>Upsdrvctl Output</Typography>
					{obj}
				</ModalDialog>
			</Modal>
			<Box sx={{ display: 'flex' }}>
				<PageTitle title={`Nobreak - ${nobreak?.name}`} />

				<NobreakForm nobreak={nobreak} edit />
				<DeleteNobreakModal nobreak={nobreak} />
				<Button
					sx={{ marginLeft: 'auto', width: '150px', height: '60px' }}
					variant={"outlined"}
					onClick={() => setOpenConsole(true)}>
					Upsdrvctl Output
				</Button>
			</Box>
			<Grid container spacing={2}>
				<Grid md={4}>
					<Paper 
						className="p-4" 
						sx={{
							textAlign: 'center', 
							height: '100%', 
							alignContent: 'center'
						}}
						>
						{/* <h2>
							Battery Charge
						</h2> */}
						<BatteryGauge
							orientation="horizontal"
							value={nobreak?.batteryCharge ?? 0}
							animated
							customization={{
								batteryBody: {
									cornerRadius: 2,
									strokeColor: '#333',
									strokeWidth: 2
								},
								batteryMeter: {
									fill: 'green',
									lowBatteryValue: 15,
									lowBatteryFill: 'red',
									outerGap: 1,
									noOfCells: 1, // more than 1, will create cell battery
									interCellsGap: 0.8
								},
								batteryCap: {
									capToBodyRatio: 0.3,
									cornerRadius: 1,
									strokeColor: '#333',
									strokeWidth: 2
								},
								readingText: {
									lightContrastColor: '#111',
									darkContrastColor: 'black',
									lowBatteryColor: 'red',
									fontFamily: 'Helvetica',
									fontSize: 14,
									showPercentage: true
								},
								chargingFlash: {
									scale: undefined,
									fill: 'orange',
									animated: true,
									animationDuration: 0
								},
							}}
						/>
					</Paper>
				</Grid>
				<Grid md={8}>
					<Paper
						// className="p-4" 
						sx={{ height: '100%' }}
					>
						<Grid container>
							<Grid md={3}>
								<GaugeComponent
									value={nobreak?.inputVoltage ?? 0}
									minValue={0}
									maxValue={3000}
									arc={
										{
											subArcs:
												[
													{ color: 'green', limit: 300, showTick: true },
													{ color: 'yellow', limit: 2600, showTick: true },
													{ color: 'red', limit: 2700, showTick: true }
												]
										}
									}
									labels={{
										tickLabels: {
											defaultTickValueConfig: {
												formatTextValue(value) {
													return `${value}V`;
												},
											}
										},
										valueLabel: {
											formatTextValue(value) {
												return `${value}V`;
											}
										},
										descriptionLabel: {
											labelText: 'Input Voltage'
										}
									}}
								/>
							</Grid>
							<Grid md={3}>
								<GaugeComponent
									value={nobreak?.outputVoltage ?? 0}
									minValue={0}
									maxValue={3000}
									arc={
										{
											subArcs:
												[
													{ color: 'green', limit: 300, showTick: true },
													{ color: 'yellow', limit: 2600, showTick: true },
													{ color: 'red', limit: 2700, showTick: true }
												]
										}
									}
									labels={{
										tickLabels: {
											defaultTickValueConfig: {
												formatTextValue(value) {
													return `${value}V`;
												},
											}
										},
										valueLabel: {
											formatTextValue(value) {
												return `${value}V`;
											}
										},
										descriptionLabel: {
											labelText: 'Output Voltage'
										}
									}}
								/>
							</Grid>
							<Grid md={3}>
								{/* <Typography>Input Voltage</Typography> */}
								<GaugeComponent
									value={nobreak?.load ?? 0}
									minValue={0}
									maxValue={100}
									arc={
										{
											subArcs:
												[
													{ color: 'red', limit: 15, showTick: true },
													{ color: 'yellow', limit: 70, showTick: true },
													{ color: 'green', showTick: true },
												]
										}
									}
									labels={{
										descriptionLabel: {
											labelText: 'Load'
										}
									}}
								/>
							</Grid>
							{/* <Grid md={4}>
								<GaugeComponent
									value={270}
									type="radial"
									arc={
										{subArcs: 
											[
												{color: 'green', limit: 30},
												{color: 'yellow', limit: 70},
												{color: 'red', limit: 250, showTick: true},
												{color: 'red', limit: 270}
											]
									}
									}	
									labels={{
										tickLabels: {
											defaultTickValueConfig: {
												formatTextValue(value) {
													return `${value}V`;
												},
											}
										},
										valueLabel: {
											formatTextValue(value) {
												return `${value}V`;
											}
										}
									}}
									minValue={0}
									maxValue={300}
								/>
							</Grid>
							<Grid md={4}>
								<GaugeComponent
									value={270}
									type="semicircle"
									arc={
										{subArcs: 
											[
												{color: 'green', limit: 30},
												{color: 'yellow', limit: 70},
												{color: 'red', limit: 270}
											]
									}
									}	
									labels={{
										tickLabels: {
											defaultTickValueConfig: {
												formatTextValue(value) {
													return `${value}V`;
												},
											}
										},
										valueLabel: {
											formatTextValue(value) {
												return `${value}V`;
											}
										}
									}}
									minValue={0}
									maxValue={300}
								/>
							</Grid> */}
						</Grid>
					</Paper>
				</Grid>
				{/* <Grid md={4}>
					<Paper className="p-4" sx={{height: '100%'}}>
						<h2>Temperature</h2>
					</Paper>
				</Grid> */}
			</Grid><br />
			<Grid container spacing={2}>
				<Grid md={12}>
					<Machines />
				</Grid>
			</Grid>
		</>
	);
}

export default NobreakPage;
