import { apiRoutes } from './routes';
import { QueryCache, UseQueryOptions, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import AlertaReconectando from '@/components/AlertaReconectando';
import { useEffect } from 'react';
import { useApi } from './api';
import { ICredential } from '@/core/types/credential';
import { AxiosResponse } from 'axios';

export const useGetCredentials = () => {
  const { api } = useApi();
  var queryOptions: UseQueryOptions<AxiosResponse<ICredential[]>, Error, AxiosResponse<ICredential[]>, any> = {
    queryKey: ["credentials"],
    queryFn: () => api.get(apiRoutes.getCredentials),
    retry: false,
    staleTime: Infinity,
    enabled: true
  };
  const context = useQuery(queryOptions)
  return { ...context, data: context?.data?.data };
};
export const useGetCredentialById = (id: string) => {
  const { api } = useApi();
  var queryOptions: UseQueryOptions<AxiosResponse<ICredential>, Error, AxiosResponse<ICredential>, any> = {
    queryKey: ["credential-" + id],
    queryFn: () => api.get(apiRoutes.getCredentialById),
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

export const CredentialsService = {
  useGetCredentialById,
  useGetCredentials
}