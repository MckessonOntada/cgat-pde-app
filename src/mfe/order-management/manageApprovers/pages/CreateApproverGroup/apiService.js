import React, { useEffect, useMemo, useState } from 'react';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { useQuery } from 'react-query';
import AuthUtils from '@src/util/AuthUtils';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
let params = {
  status: 'active',
  partnerFunction: 'SOLD_TO'
};

let roleParam = {
  status: 'active'
};
const practiceId = AuthUtils.getPracticeId();
const userId = AuthUtils.getUserId();

export const useCatalogData = () => {
  return useQuery(
    ['catalogData'],
    async () => {
      const apiUrl = `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${practiceId}/accounts?${serializeParams(params)}`;
      const res = await HttpResourceService.callRest(apiUrl, httpVerb.GET, {});
      return (
        res.data?.content?.map((item) => ({
          label: item.accountName,
          value: item.id
        })) || []
      );
    },
    {
      enabled: !!practiceId,
      refetchOnWindowFocus: false,
      keepPreviousData: true
    }
  );
};

export const useAccountData = () => {
  return useQuery(
    ['accountData'],
    async () => {
      const apiUrl = `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${practiceId}/accounts?${serializeParams(params)}`;
      const res = await HttpResourceService.callRest(apiUrl, httpVerb.GET, {});
      return (
        res.data?.content?.map((item) => ({
          label: item.accountName,
          value: item.id
        })) || []
      );
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true
    }
  );
};

export const useUserRoleData = () => {
  return useQuery(
    ['userRoleData'],
    async () => {
      const apiUrl = `${ApiRoutes.GET_ROLES()}?${serializeParams(roleParam)}`;
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
      keepPreviousData: true
    }
  );
};

let userParams = {
  userType: 'GENERAL',
  status: 'active'
};

export const useUserData = () => {
  return useQuery(
    ['userData'],
    async () => {
      const apiUrl = `${ApiRoutes.USERS()}?${serializeParams(userParams)}`;
      const res = await HttpResourceService.callRest(apiUrl, httpVerb.GET, {});
      return (
        res.data?.content?.map((item) => ({
          label: `${item.name.lastName}, ${item.name.firstName} ${item.name.middleName || ''}`.trim(),
          value: item.id
        })) || []
      );
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true
    }
  );
};
