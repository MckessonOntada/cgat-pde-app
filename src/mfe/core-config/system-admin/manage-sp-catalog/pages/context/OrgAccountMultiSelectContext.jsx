import SPCatalogService from '@src/api/commonService/SPCatalogService';
import { CHANNEL_TYPE } from '@src/mfe/order-management/pages/create/form-segments/Constants';
import CommonUtils from '@src/util/CommonUtils';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

const orgAccountsMultiSelectionContext = createContext();

export const useOrgAccountsMultiSelectionContext = () => {
  const context = useContext(orgAccountsMultiSelectionContext);
  if (!context) {
    throw new Error('UseCatalogContext should be used with in catalog provider');
  }
  return context;
};

const ACCOUNTS_PER_SEARCH = 20;

export const OrgAccountMultiSelectionProvider = ({ children, enableOrg = true, enableAcct = true, isLinkCatalog = false }) => {
  const dispatch = useDispatch();
  const [searchOrgText, setSearchOrgText] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [searchAccountText, setSearchAccountText] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [options, setOptions] = useState([]);
  const [accountOptions, setAccountOptions] = useState();
  const [checkedAccounts, setCheckedAccounts] = useState([]);
  const [checkedOrganizations, setCheckedOrganizations] = useState([]);
  const [totalOrgs, setTotalOrgs] = useState();
  const [totalAccs, setTotalAccs] = useState();
  const [prevParam, setPrevParam] = useState([]);

  // Organization List configuration
  const orgPayload = {
    pageNo: 0,
    pageSize: ACCOUNTS_PER_SEARCH,
    status: 'active',
    query: searchOrgText
  };
  const { data: organizationOptions, refetch: refetchOrgs } = useQuery({
    queryKey: [searchOrgText],
    queryFn: async () => {
      const response = await SPCatalogService.getOrganizations(orgPayload);
      if (response && response.content) {
        setTotalOrgs(response.totalElements);
        let data = response.content.map((item, index) => ({
          index: index + 1,
          label: item.name,
          value: item.id,
          isChecked: checkedOrganizations.length > 0 && checkedOrganizations.find((ele) => ele.value == item.id) ? true : false
        }));
        const mergedData = [...data, ...checkedOrganizations.filter((checkedOrg) => !data.some((newOrg) => newOrg.value === checkedOrg.value))];
        setOptions(mergedData);
        return mergedData;
      }
      setOptions([]);
      return [];
    },
    refetchOnWindowFocus: false,
    enabled: !!enableOrg
  });

  const debounceOrgSearch = useCallback(() => {
    let timeoutId;
    return (text) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setSearchOrgText(text), 500);
    };
  }, []);
  const searchOrgList = debounceOrgSearch();

  const practiceIds = useMemo(() => {
    return selectedOrganization ? selectedOrganization.map((item) => item.value) : [];
  }, [selectedOrganization]);

  const payload = useMemo(
    () => ({
      pageNo: 0,
      pageSize: ACCOUNTS_PER_SEARCH,
      query: searchAccountText,
      status: 'active',
      partnerFunction: 'SOLD_TO',
      allAccounts: isLinkCatalog ? false : practiceIds.length === 0,
      practiceIdList: practiceIds,
      channelType: CHANNEL_TYPE.SPECIALTY_PHARMA
    }),
    [searchAccountText, practiceIds]
  );

  const isCheck = !CommonUtils.deepEqual(payload, prevParam);
  const { data: accountsList, refetch: refetchAccounts } = useQuery({
    queryKey: ['accountsList', payload],
    queryFn: async () => {
      if (isCheck) {
        const response = await SPCatalogService.getAccountList(payload);
        setPrevParam(payload);
        if (response) {
          const { content, totalElements } = response;
          setTotalAccs(totalElements);
          let _opt =
            content.map((item, index) => ({
              ...item,
              label: item.accountName,
              value: item.accountNumber,
              isChecked: checkedAccounts.length > 0 && checkedAccounts.find((ele) => ele.accountNumber == item.accountNumber) ? true : false
            })) || [];

          const mergedAcc = [..._opt, ...checkedAccounts.filter((acc) => !_opt.some((newacc) => newacc.value === acc.value))];

          setAccountOptions(_opt);
          setSelectedAccount(_opt);
          return content || [];
        }
      }
      return [];
    },
    refetchOnWindowFocus: false,
    enabled:
      !!enableAcct &&
      (!isLinkCatalog || (Array.isArray(selectedOrganization) && selectedOrganization.length > 0 && selectedOrganization.some((org) => !!org.value)))
  });
  const debounceAccountsSearch = useCallback(() => {
    let timeoutId;
    return (text) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setSearchAccountText(text), 500);
    };
  }, []);
  const searchAccountList = debounceAccountsSearch();

  useEffect(() => {
    if (practiceIds.length > 0) {
      setSelectedAccount([]);
      setCheckedAccounts([]);
      refetchAccounts();
    }
  }, [practiceIds]);

  // Organization, Account values
  const contextValue = {
    organizationOptions: organizationOptions || [],
    searchOrgList,
    selectedOrganization,
    setSelectedOrganization,
    accountsList: accountsList || [],
    searchAccountList,
    selectedAccount,
    setSelectedAccount,
    options,
    setOptions,
    accountOptions,
    setAccountOptions,
    checkedAccounts,
    setCheckedAccounts,
    refetchAccounts,
    refetchOrgs,
    checkedOrganizations,
    setCheckedOrganizations,
    totalOrgs,
    totalAccs
  };
  return <orgAccountsMultiSelectionContext.Provider value={contextValue}>{children}</orgAccountsMultiSelectionContext.Provider>;
};
