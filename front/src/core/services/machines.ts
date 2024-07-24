import { apiRoutes } from './routes';
import { QueryCache, UseMutationOptions, UseQueryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import AlertaReconectando from '@/components/AlertaReconectando';
import { useEffect } from 'react';
import { useApi } from './api';
import { IMachine } from '@/core/types/machine';
import { AxiosResponse } from 'axios';

export const useGetMachines = () => {
  const { api } = useApi();
  var queryOptions: UseQueryOptions<AxiosResponse<IMachine[]>, Error, AxiosResponse<IMachine[]>, any> = {
    queryKey: ["machines"],
    queryFn: () => api.get(apiRoutes.getMachines),
    retry: false,
    staleTime: 2000,
    enabled: true
  };
  const context = useQuery(queryOptions)
  useEffect(() => {
    if(context.failureReason){
      toast.custom(AlertaReconectando);
    }
  }, [context.failureCount])
  return { ...context, data: context?.data?.data };
};
export const useGetNobreakMachines = (idNobreak: string) => {
  const { api } = useApi();
  var queryOptions: UseQueryOptions<AxiosResponse<IMachine[]>, Error, AxiosResponse<IMachine[]>, any> = {
    queryKey: ["machines-"+idNobreak],
    queryFn: () => api.get(apiRoutes.getMachines+"/"+idNobreak), //TODO: change this to getMachinesByNobreakId
    retry: false,
    staleTime: 2000,
    enabled: true
  };
  const context = useQuery(queryOptions)
  return { ...context, data: context?.data?.data };
};
export const useGetMachineById = (machine: any) => {
  const { api } = useApi();
  var queryOptions: UseQueryOptions<AxiosResponse<IMachine>, Error, AxiosResponse<IMachine>, any> = {
    queryKey: ["machine-" + machine.id],
    queryFn: () => api.get(apiRoutes.getMachineById),
    retry: false,
    staleTime: Infinity,
    enabled: true
  };
  const context = useQuery(queryOptions)
  useEffect(() => {
    if(context.failureReason){
      toast.custom(AlertaReconectando);
    }
  }, [context.failureCount])
  return { ...context, data: context?.data?.data };
};

const usePostWolMachine = (id: string) => {
  const { api } = useApi();
  const queryClient = useQueryClient();
  var queryOptions: UseMutationOptions<any> = {
    mutationKey: ["wol-"+id],
    mutationFn: () => api.post(apiRoutes.postWolMachine, { id })
      .then((res: any) => {
      // queryClient.invalidateQueries({ queryKey: ['nobreaks'] });
      toast.success("Magic packet sent.");
      })
      .catch((error: any) => {
        toast.error(error.response.data.error);
      }),
    retry: false,
  };
  const context = useMutation<any>(queryOptions);
  return { ...context, data: context?.data?.data };
}
const usePostShutdownMachine = (id: string) => {
  const { api } = useApi();
  const queryClient = useQueryClient();
  var queryOptions: UseMutationOptions<any> = {
    mutationKey: ["shutdown-"+id],
    mutationFn: () => api.post(apiRoutes.postShutdownMachine, { id }).then((res: any) => {
      // queryClient.invalidateQueries({ queryKey: ['nobreaks'] });
      toast.success("Machine ordered to shutdown.");
    })
    .catch((error: any) => {
      console.log(error)
      toast.error(error.response.data.error.error);
    }),
    retry: false,
  };
  const context = useMutation<any>(queryOptions);
  return { ...context, data: context?.data?.data };
}
const useGetOperationalSystems = () => {
  const { api } = useApi();
  var queryOptions: UseQueryOptions<AxiosResponse<any>, Error, AxiosResponse<any>, any> = {
    queryKey: ["operational-systems"],
    queryFn: () => api.get(apiRoutes.getOperationalSystems),
    retry: false,
    staleTime: Infinity,
    enabled: true
  };
  const context = useQuery(queryOptions)
  return { ...context, data: context?.data?.data };
};
export const MachineService = {
  useGetMachines,
  useGetMachineById,
  usePostWolMachine,
  usePostShutdownMachine,
  useGetOperationalSystems
}