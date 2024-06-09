import { useEffect, useState } from 'react';
import { socket } from '@/core/services/socket';
import { NobreakService } from '@/core/services/nobreak';
import { AppSettingsService } from '@/core/services/appsettings';
import { Console } from '@/styles/Shared';

export const UpsdrvctlOutput = (props: any) => {
  const { data: appSettings } = AppSettingsService.useGetAppSettings();
  const { data: initUpsdrvctlOutput } = NobreakService.useGetUpsdrvctlOutput(props.id);
  const [upsdrvctlOutput, setUpsdrvctlOutput] = useState<any>();
  // console.log(upsdrvctlOutput)
  useEffect(() => {
    if (initUpsdrvctlOutput != undefined)
      setUpsdrvctlOutput(initUpsdrvctlOutput);
  }, [initUpsdrvctlOutput]);

  useEffect(() => {
    //Get data in real time
    var a = appSettings?.SOCKET_IO_UPSDRVCTL_EVENT as string;
    if (a == undefined) return;
    socket.on(
      a.replace("{0}", props?.id),
      (data: any) => {
        console.log(data)
        setUpsdrvctlOutput((prevUpsdrvctlOutput: any) =>
          [...prevUpsdrvctlOutput, ...data])
      }
    );
    return () => {
      socket.off(a.replace("{0}", props.id));
    };
  }, [appSettings]);
  return (
    <Console elevation={3}>
      {upsdrvctlOutput?.map((row: any) => {
        return (
          <>
            {row[1]?.data || row}
          </>
        )
      })}
    </Console>
  );
}