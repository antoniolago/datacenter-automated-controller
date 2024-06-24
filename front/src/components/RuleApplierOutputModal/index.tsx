import React, { useEffect, useState } from 'react';
import { Modal, Button, ModalClose, ModalDialog } from '@mui/joy';
import { io, Socket } from 'socket.io-client';
import { Console } from '@/styles/Shared';
import { AppSettingsService } from '@/core/services/appsettings';
import { RuleApplierService } from '@/core/services/rule-applier';
import { socket } from '@/core/services/socket';

const RuleApplierOutputModal: React.FC = () => {
    const [open, setOpen] = useState(false);
    const { data: appSettings } = AppSettingsService.useGetAppSettings();
    const [ruleApplierOutput, setRuleApplierOutput] = useState<any[]>([]);
    const { data: initUpsdOutput } = RuleApplierService.useGetRuleApplierOutput();
    useEffect(() => {
      if (initUpsdOutput)
        setRuleApplierOutput(initUpsdOutput);
    }, [initUpsdOutput]);
    useEffect(() => {
      //Get data in real time
      socket.on(
        appSettings?.SOCKET_IO_RULE_APPLIER_EVENT!,
        (data: any) => setRuleApplierOutput((prevUpsdOutput: any[]) => [...prevUpsdOutput, ...data])
      );
      return () => {
        socket.off(appSettings?.SOCKET_IO_RULE_APPLIER_EVENT);
      };
    }, []);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button onClick={handleOpen}>RuleApplier output</Button>
            <Modal open={open} onClose={handleClose}>
                <ModalDialog>
                    <ModalClose />
                    <div>
                        <h2>SocketIO Output</h2>
                        {/* <pre>{output}</pre> */}

                        <Console elevation={3}>
                            {ruleApplierOutput?.map((row: any) => {
                                return (
                                    <>
                                        {row[1]?.data || row}
                                    </>
                                )
                            })}
                        </Console>
                    </div>
                </ModalDialog>
            </Modal>
        </div>
    );
};

export default RuleApplierOutputModal;