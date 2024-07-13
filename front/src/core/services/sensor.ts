import { apiRoutes } from './routes';
import { QueryCache, UseQueryOptions, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import AlertaReconectando from '@/components/AlertaReconectando';
import { useEffect } from 'react';
import { useApi } from './api';
import { AxiosResponse } from 'axios';
import { ISensor, ISensorData } from '../types/sensor';

// export const useGetSensors = () => {
//   const { api } = useApi();
//   var queryOptions: UseQueryOptions<AxiosResponse<ISensor>[], Error, AxiosResponse<ISensor>[], any> = {
//     queryKey: ["sensors"],
//     queryFn: () => api.get(apiRoutes.getSensors),
//     retry: false,
//     staleTime: Infinity,
//     enabled: true
//   };
//   const context = useQuery(queryOptions)
//   useEffect(() => {
//     if(context.failureReason){
//       toast.custom(AlertaReconectando);
//     }
//   }, [context.failureCount])
//   return { ...context, data: context?.data?.data };
// };
// export const useGetSensorById = (sensor: any) => {
//   const { api } = useApi();
//   var queryOptions: UseQueryOptions<AxiosResponse<ISensor>, Error, AxiosResponse<ISensor>, any> = {
//     queryKey: ["sensor-" + sensor.id],
//     queryFn: () => api.get(apiRoutes.getSensorById),
//     retry: false,
//     staleTime: Infinity,
//     enabled: true
//   };
//   const context = useQuery(queryOptions)
//   useEffect(() => {
//     if(context.failureReason){
//       toast.custom(AlertaReconectando);
//     }
//   }, [context.failureCount])
//   return { ...context, data: context?.data?.data };
// };
const useGetData = () => {
  const { api } = useApi();
  var queryOptions: UseQueryOptions<AxiosResponse<any>, Error, AxiosResponse<any>, any> = {
    queryKey: ["sensor-data"],
    queryFn: () => api.get(apiRoutes.getSensorData+"/1"),
    retry: false,
    staleTime: Infinity,
    enabled: true
  };
  const context = useQuery(queryOptions)
  return { ...context, data: context?.data?.data?.data };
}
export const SensorService = {
  useGetData,
}