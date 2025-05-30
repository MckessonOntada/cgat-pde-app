import React, { useEffect, useMemo, useState } from 'react';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { useQuery } from 'react-query';
import AuthUtils from '@src/util/AuthUtils';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import { getFullName } from '@src/util/CommonUtils';
let params = {
  status: 'active',
  partnerFunction: 'SOLD_TO'
};

let statusParam = {
  status: 'active'
};

export const useCatalogData = (shouldFetch) => {
  return useQuery(
    ['catalogData'],
    async () => {
      const apiUrl = `${ApiRoutes.USERS()}/current/therapies`;
      const res = await HttpResourceService.callRest(apiUrl, httpVerb.GET, {});
      return (
        res.data?.content?.map((item) => ({
          label: item.tradeName,
          value: item.tradeName,
          channelType: item.channelType
        })) || []
      );
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: shouldFetch // Only fetch when shouldFetch is true
    }
  );
};

export const useAccountData = (shouldFetch) => {
  const practiceId = AuthUtils.getPracticeId();
  const userId = AuthUtils.getUserId();
  return useQuery(
    ['accountData'],
    async () => {
      const apiUrl = `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${practiceId}/users/${userId}/accounts?${serializeParams(params)}`;
      const res = await HttpResourceService.callRest(apiUrl, httpVerb.GET, {});
      return (
        res.data?.content?.map((item) => ({
          label: item.accountName,
          value: item.accountNumber,
          channelType: item.channelType
        })) || []
      );
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: shouldFetch // Only fetch when shouldFetch is true
    }
  );
};

export const useUserRoleData = (shouldFetch) => {
  return useQuery(
    ['userRoleData'],
    async () => {
      const apiUrl = `${ApiRoutes.GET_ROLES()}?${serializeParams(statusParam)}`;
      const res = await HttpResourceService.callRest(apiUrl, httpVerb.GET, {});
      return (
        res.data?.content?.map((item) => ({
          label: item.name,
          value: item.id
        })) || []
      );
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: shouldFetch // Only fetch when shouldFetch is true
    }
  );
};

let userParams = {
  userType: 'GENERAL',
  status: 'active'
};

export const useUserData = (shouldFetch) => {
  return useQuery(
    ['userData'],
    async () => {
      const apiUrl = `${ApiRoutes.USERS()}?${serializeParams(userParams)}`;
      const res = await HttpResourceService.callRest(apiUrl, httpVerb.GET, {});
      return (
        res.data?.content?.map((item) => ({
          label: getFullName(item.name),
          value: item.id
        })) || []
      );
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: shouldFetch // Only fetch when shouldFetch is true
    }
  );
};
