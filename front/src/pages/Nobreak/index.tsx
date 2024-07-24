import { useEffect, useState } from 'react';
import { useParams } from "react-router";
import { PageTitle } from '@/components/PageTitle';
import Paper from '@mui/material/Paper';
import BatteryGauge from 'react-battery-gauge'
import { UpsdrvctlOutput } from '@/components/UpsdrvctlOutput';
import { Machines } from '@/pages/Nobreak/Machines';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { AppSettingsService } from '@/core/services/appsettings';
import { NobreakService } from '@/core/services/nobreak';
import { Alert, Box, Button, CircularProgress, Grid, Modal, ModalClose, ModalDialog, Typography, useTheme } from '@mui/joy';
import GaugeComponent from '@/components/GaugeComponent';
import { NobreakForm } from '../Forms/Nobreak';
import DeleteNobreakModal from '@/components/DeleteNobreakModal';
import { IconButton } from '@mui/material';
import Warning from '@mui/icons-material/Warning';

export const NobreakPage = () => {
	const { id } = useParams();
	const theme = useTheme()
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
					color='primary'
					variant='plain'
					onClick={() => setOpenConsole(true)}>
					<>
						<ReceiptLongIcon /> upsdrvctl logs
					</>
				</Button>
			</Box>
			<hr />
			<Box>
				{!nobreak?.batteryCharge &&
					<Alert
						sx={{
							fontSize: "21px",
							textAlign: "center",
							position: "absolute",
							zIndex: "10",
							opacity: 0.9,
							display: "inline",
							left: "55px",
							right: "0",
							marginLeft: "auto",
							marginRight: "auto",
							width: "80%",
							marginTop: "30px",
						}}
						startDecorator={
							<Warning />
							//   <CircularProgress size="lg" color="danger">
							// 	<Warning />
							//   </CircularProgress>
						}
						color="danger">
						<Typography>UPS data not available, check logs for more information. <br />The temperature/humidity sensors data will still be used to apply rules.</Typography>
					</Alert>
				}
				<Box >
					<Grid container spacing={2}>
						<Grid md={4} sm={12} sx={{
							".MuiPaper-root": { filter: nobreak?.batteryCharge >= 0 ? "none" : "blur(3.1px)" }
						}}>
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
											//@ts-ignore
											fill: theme.palette.success.main,
											lowBatteryValue: 15,
											//@ts-ignore
											lowBatteryFill: theme.palette.error.main,
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
											//@ts-ignore
											lowBatteryColor: theme.palette.error.main,
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
								{/* <Typography sx={{ mt: 2 }}>
									{nobreak?.upsc_output?.["ups.status"]}
								</Typography> */}
							</Paper>
						</Grid>
						<Grid sm={12} md={8} sx={{
							".MuiPaper-root": { filter: nobreak?.batteryCharge >= 0 ? "none" : "blur(3.1px)" }
						}}>
							<Paper
								// className="p-4" 
								sx={{ height: '100%' }}
							>
								<Grid container>
									<Grid sm={12} md={4}>
										<GaugeComponent
											value={nobreak?.inputVoltage}
											minValue={0}
											maxValue={550}
											arc={
												{
													subArcs:
														[
															{
																//@ts-ignore
																color: theme.palette.success.main,
																limit: 220,
																showTick: true
															},
															{
																//@ts-ignore
																color: theme.palette.warning.main,
																limit: 250,
																showTick: true
															},
															{
																//@ts-ignore
																color: theme.palette.error.main,
																showTick: true
															}
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
									<Grid sm={12} md={4}>
										<GaugeComponent
											value={nobreak?.outputVoltage}
											minValue={0}
											maxValue={550}
											arc={
												{
													subArcs:
													[
														{
															//@ts-ignore
															color: theme.palette.success.main,
															limit: 220,
															showTick: true
														},
														{
															//@ts-ignore
															color: theme.palette.warning.main,
															limit: 250,
															showTick: true
														},
														{
															//@ts-ignore
															color: theme.palette.error.main,
															showTick: true
														}
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
									<Grid sm={12} md={4}>
										{/* <Typography>Input Voltage</Typography> */}
										<GaugeComponent
											value={nobreak?.load}
											minValue={0}
											maxValue={100}
											arc={
												{
													subArcs:
														[
															{
																//@ts-ignore
																color: theme.palette.success.main,
																limit: 75, showTick: true
															},
															{
																//@ts-ignore
																color: theme.palette.warning.main,
																limit: 85,
																showTick: true
															},
															{
																//@ts-ignore
																color: theme.palette.error.main,
																showTick: false
															},
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
								</Grid>
							</Paper>
						</Grid>
						<Grid md={12}>
							<Machines />
						</Grid>
					</Grid>
				</Box>
			</Box >
		</>
	);
}

export default NobreakPage;
