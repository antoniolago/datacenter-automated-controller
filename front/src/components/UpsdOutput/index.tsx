import React, { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { Console } from '@/styles/Shared';
import { socket } from '@/core/services/socket';
import { AppSettingsService } from '@/core/services/appsettings';
import { Modal, ModalClose, ModalDialog, Typography } from '@mui/joy';
import { useApi } from '@/core/services/api';
import { NobreakService } from '@/core/services/nobreak';

export const UpsdOutput = (props: any) => {
  const [showModal, setShowModal] = useState(false);
  const { data: appSettings } = AppSettingsService.useGetAppSettings();
  const [upsdOutput, setUpsdOutput] = useState<any[]>([]);
  const { data: initUpsdOutput } = NobreakService.useGetUpsdOutput();
  useEffect(() => {
    if (initUpsdOutput)
      setUpsdOutput(initUpsdOutput.reverse());
  }, [initUpsdOutput]);
  useEffect(() => {
    //Get data in real time
    socket.on(
      appSettings?.SOCKET_IO_UPSD_EVENT!,
      (data: any) => setUpsdOutput((prevUpsdOutput: any[]) => [...prevUpsdOutput, ...data.reverse()])
    );
    return () => {
      socket.off(appSettings?.SOCKET_IO_UPSD_EVENT);
    };
  }, []);
  return (
    // <Modal
    //   open={showModal}
    //   onClose={() => setShowModal(false)}
    // // aria-labelledby="change-professor-modal-title"
    // // aria-describedby="change-professor-modal-description"
    // >
    //   <ModalDialog size="md">
    <div>
      {/* //       <ModalClose /> */}
      {/* <Typography
            style={{ fontSize: "17px", textAlign: "center", marginRight: '40px' }}
          >
            This is the output of the UPSD process UPSD console output
          </Typography> */}
      <br />
      <Console elevation={3}>
        {upsdOutput?.map((row: any) => {
          return (
            <>
              {row[1]?.data || row}
            </>
          )
        })}
      </Console>
    </div>
    //   </ModalDialog>
    // </Modal>
  );
}