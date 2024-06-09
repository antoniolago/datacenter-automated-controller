import { apiRoutes } from './routes';
import { IAppSettings } from '@/core/types/appsettings';
import { QueryCache, UseQueryOptions, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import AlertaReconectando from '@/components/AlertaReconectando';
import { useEffect } from 'react';
import { useApi } from './api';
import { AxiosResponse } from 'axios';

export const useGetAppSettings = () => {
  const { api } = useApi();
  var queryOptions: UseQueryOptions<AxiosResponse<IAppSettings>, Error, AxiosResponse<IAppSettings>, any> = {
    queryKey: ["appsettings"],
    queryFn: () => api.get(apiRoutes.getAppSettings),
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
  return { ...context, data: context.data?.data };
};

export const AppSettingsService = {
  useGetAppSettings
}