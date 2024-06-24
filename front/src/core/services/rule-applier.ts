import { apiRoutes } from './routes';
import { QueryCache, UseQueryOptions, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import AlertaReconectando from '@/components/AlertaReconectando';
import { useEffect } from 'react';
import { useApi } from './api';
import { AxiosResponse } from 'axios';

export const useGetRuleApplierOutput = () => {
  const { api } = useApi();
  var queryOptions: UseQueryOptions<AxiosResponse<any[]>, Error, AxiosResponse<any[]>, any> = {
    queryKey: ["rule-applier-output"],
    queryFn: () => api.get(apiRoutes.getRuleApplierOutput),
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

export const RuleApplierService = {
  useGetRuleApplierOutput
}