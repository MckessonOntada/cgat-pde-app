import ApiRoutes from '@src/api/ApiRoutes';
import CommonDataService from '@src/api/commonService/CommonDataService';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { serializeParams } from '@src/util/ApiUtils';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';

const orgAccountsSelectionContext = createContext();

export const useOrgAccountSelectionContext = () => {
  const context = useContext(orgAccountsSelectionContext);
  if (!context) {
    throw new Error('UseCatalogContext should be used with in catalog provider');
  }
  return context;
};

const ACCOUNTS_PER_SEARCH = 20;

export const OrgAccountSelectionProvider = ({ children, enableOrg = true, enableAcct = true, defaultFirstOrgSelected = false, enableConfigure = false }) => {
  const dispatch = useDispatch();
  const [searchOrgText, setSearchOrgText] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [searchAccountText, setSearchAccountText] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [options, setOptions] = useState([]);
  const [accountOptions, setAccountOptions] = useState();
  const [checkedAccounts, setCheckedAccounts] = useState([]);
  const [totalOrgs, setTotalOrgs] = useState();
  const [totalAccs, setTotalAccs] = useState();

  // Organization List configuration
  const orgParams = () => {
    return {
      pageNo: 0,
      pageSize: ACCOUNTS_PER_SEARCH,
      query: searchOrgText,
      status: 'active'
    };
  };
  const { data: organizationOptions, refetch: refetchOrgList } = useQuery({
    queryKey: [searchOrgText],
    queryFn: async () => {
      const response = await HttpResourceService.callRest(
        `${ApiRoutes.PUBLIC_ORGANIZATIONS}?${serializeParams(orgParams())}`, // Use practice id from organization
        httpVerb.GET,
        {}
      );
      if (response) {
        const { content, totalElements, totalPages } = response.data;
        setTotalOrgs(totalElements);
        if (content.length > 0) {
          let data = content.map((item, index) => ({
            index: index + 1,
            label: item.name,
            value: item.id
          }));
          if (defaultFirstOrgSelected && !selectedOrganization) {
            setSelectedOrganization(content[0]);
          }
          if (selectedOrganization) {
            let findOrg = data.find((item) => item.value == selectedOrganization.id);
            !findOrg &&
              data.unshift({
                index: 0,
                label: selectedOrganization.name,
                value: selectedOrganization.id
              });
          }

          setOptions(data);
        }
        return content;
      }
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
  // Accounts List config
  const accountParams = () => {
    return {
      pageNo: 0,
      pageSize: ACCOUNTS_PER_SEARCH,
      practiceId: selectedOrganization.id,
      partnerFunction: 'SOLD_TO',
      status: 'active',
      query: searchAccountText,
      ...(enableConfigure ? { channelType: 'ALL' } : {})
    };
  };
  const { data: accountsList, refetch: refetchAccounts } = useQuery({
    queryKey: [searchAccountText, selectedOrganization],
    queryFn: async () => {
      const response = await HttpResourceService.callRest(
        `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${selectedOrganization.id}/accounts?${serializeParams(accountParams())}`,
        httpVerb.GET,
        {}
      );
      if (response) {
        const { content, totalElements, totalPages } = response.data;
        setTotalAccs(totalElements);
        let _opt =
          content.map((item, index) => ({
            ...item,
            label: item.accountName,
            value: item.accountNumber,
            isChecked: false
          })) || [];
        setAccountOptions(_opt);
        setSelectedAccount(_opt);
        return content || [];
      }
      return [];
    },
    refetchOnWindowFocus: false,
    enabled: !!selectedOrganization && !!enableAcct
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
    setSelectedAccount(null);
  }, [selectedOrganization]);

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
    totalOrgs,
    totalAccs
  };
  return <orgAccountsSelectionContext.Provider value={contextValue}>{children}</orgAccountsSelectionContext.Provider>;
};
