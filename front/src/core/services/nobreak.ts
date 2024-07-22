import { apiRoutes } from './routes';
import { QueryCache, QueryClient, UseMutationOptions, UseQueryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import AlertaReconectando from '@/components/AlertaReconectando';
import { useEffect } from 'react';
import { useApi } from './api';
import { INobreak } from '@/core/types/nobreak';
import { AxiosResponse } from 'axios';

export const useGetNobreaks = () => {
  const { api } = useApi();
  var queryOptions: UseQueryOptions<AxiosResponse<INobreak[]>, Error, AxiosResponse<INobreak[]>, any> = {
    queryKey: ["nobreaks"],
    queryFn: () => api.get(apiRoutes.getNobreaks),
    retry: false,
    staleTime: Infinity,
    enabled: true
  };
  const context = useQuery(queryOptions)
  useEffect(() => {
    if (context.failureReason) {
      toast.custom(AlertaReconectando);
    }
  }, [context.failureCount])
  return { ...context, data: context?.data?.data };
};
const useMutateDeleteNobreak = (id: string) => {
  const { api } = useApi();
  const queryClient = useQueryClient();
  var queryOptions: UseMutationOptions<any> = {
    mutationKey: ["del-nobreak-"+id],
    mutationFn: () => api.delete(apiRoutes.deleteNobreak + "/" + id).then((res: any) => {
      queryClient.invalidateQueries({ queryKey: ['nobreaks'] });
      toast.success("Nobreak deleted.");
      return res.data.data;
    }),
    retry: false,
  };
  const context = useMutation<any>(queryOptions);
  useEffect(() => {
    if (context.failureReason) {
      toast.custom(AlertaReconectando);
    }
  }, [context.failureCount])
  return { ...context, data: context?.data?.data };
}

export const useGetNobreakById = (nobreakId: any) => {
  const { api } = useApi();
  const queryClient = useQueryClient();
  var queryOptions: UseQueryOptions<AxiosResponse<INobreak>, Error, AxiosResponse<INobreak>, any> = {
    queryKey: ["nobreak-" + nobreakId],
    queryFn: () => api.get(`${apiRoutes.getNobreakById}/${nobreakId}`),
    retry: true,
    // staleTime: 2000,
    refetchInterval: 10000, //10s
    enabled: true,
    placeholderData: () => {
      // Use the smaller/preview version of the blogPost from the 'blogPosts'
      // query as the placeholder data for this blogPost query
      return queryClient.getQueryData(['nobreak-'+nobreakId])
    }
  };
  const context = useQuery(queryOptions)
  // useEffect(() => {
  //   if (context.failureReason) {
  //     toast.custom(AlertaReconectando);
  //   }
  // }, [context.failureCount])
  return { ...context, data: context?.data?.data };
};
export const useGetUpsdOutput = () => {
  const { api } = useApi();
  var queryOptions: UseQueryOptions<AxiosResponse<any[]>, Error, AxiosResponse<any[]>, any> = {
    queryKey: ["upsd-output"],
    queryFn: () => api.get(`/nobreaks/upsd-output`),
      // .then((res: any) => {
      //   return res.data.data.map((row: any) => row[1].data)
      // }),
    retry: false,
    staleTime: Infinity,
    enabled: true
  };
  const context = useQuery(queryOptions)
  return { ...context, data: context?.data?.data };
};
export const useGetUpsdrvctlOutput = (id: string) => {
  const { api } = useApi();
  var queryOptions: UseQueryOptions<AxiosResponse<string[]>, Error, AxiosResponse<string[]>, any> = {
    queryKey: ["upsdrvctl-output"],
    queryFn: () => api.get(`/nobreak/${id}/upsdrvctl-output`)
      // .then((res: any) => {
      //   return res.data.data.map((row: any) => row[1].data)
      // })
      ,
    retry: false,
    staleTime: Infinity,
    enabled: true
  };
  const context = useQuery(queryOptions)
  return { ...context, data: context?.data?.data };
};


export const NobreakService = {
  useGetNobreakById,
  useGetNobreaks,
  useGetUpsdOutput,
  useGetUpsdrvctlOutput,
  useMutateDeleteNobreak
}