// UpsdrvctlOutput.tsx

import { useEffect, useState } from 'react';
import { socket } from '@/core/services/socket';
import { NobreakService } from '@/core/services/nobreak';
import { AppSettingsService } from '@/core/services/appsettings';
import { Console } from '@/styles/Shared';

export const UpsdrvctlOutput = (props: any) => {
  const { data: appSettings } = AppSettingsService.useGetAppSettings();
  const { data: initUpsdrvctlOutput } = NobreakService.useGetUpsdrvctlOutput(props.id);
  const [upsdrvctlOutput, setUpsdrvctlOutput] = useState<any[]>([]);

  useEffect(() => {
    if (initUpsdrvctlOutput !== undefined) {
      setUpsdrvctlOutput(initUpsdrvctlOutput.reverse());
    }
  }, [initUpsdrvctlOutput]);

  useEffect(() => {
    if (!appSettings || !props?.id) return;

    const eventKey = appSettings.SOCKET_IO_UPSDRVCTL_EVENT?.replace("{0}", props?.id);
    const handleData = (data: any) => {
      setUpsdrvctlOutput((prev) => [...prev, data.reverse()]);
    };

    const handleConnect = () => {
      console.log("Connected to server");
    };

    const handleDisconnect = () => {
      console.log("Disconnected from server, attempting to reconnect...");
      setTimeout(() => {
        socket.connect();
      }, 5000);
    };

    socket.on(eventKey, handleData);
    // socket.on('connect', handleConnect);
    // socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off(eventKey, handleData);
      // socket.off('connect', handleConnect);
      // socket.off('disconnect', handleDisconnect);
    };
  }, [appSettings, props.id]);

  return (
    <Console elevation={3}>
      {upsdrvctlOutput?.map((row: any, index: number) => (
        <div key={index}>{row[1]?.data || row}</div>
      ))}
    </Console>
  );
};
