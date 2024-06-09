import { apiRoutes } from './routes';
import { QueryCache, UseQueryOptions, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import AlertaReconectando from '@/components/AlertaReconectando';
import { useEffect } from 'react';
import { useApi } from './api';
import { IRule } from '../types/rule';
import { AxiosResponse } from 'axios';

export const useGetRules = () => {
  const { api } = useApi();
  var queryOptions: UseQueryOptions<any, Error, any, any> = {
    queryKey: ["rules"],
    queryFn: () => api.get(apiRoutes.getRules),
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
export const useGetRuleById = (id: any) => {
  const { api } = useApi();
  var queryOptions: UseQueryOptions<any, Error, any, any> = {
    queryKey: ["rule-" + id],
    queryFn: () => api.get(apiRoutes.getRuleById+"/"+id),
    retry: false,
    staleTime: Infinity,
    enabled: false
  };
  const context = useQuery(queryOptions)
  useEffect(() => {
    if(context.failureReason){
      toast.custom(AlertaReconectando);
    }
  }, [context.failureCount])
  console.log(context.data)
  return { ...context, data: context?.data?.data?.data };
};

export const RuleService = {
  useGetRuleById,
  useGetRules
}