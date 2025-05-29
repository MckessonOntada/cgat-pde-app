import React, { createContext, useContext, useState } from 'react';
import { useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { getEntityTypeFlags, MasterEntityType } from '../util';
import { serializeParams } from '@src/util/ApiUtils';
import { useOrgAccountSelectionContext } from '@src/mfe/core-config/system-admin/manage-questionnaire/components/orgAccountSelection/context/OrgAccountSelectionContext';
import CommonUtils from '@src/util/CommonUtils';
const INITIAL_FILTER_STATE = {
  searchQuery: '',
  status: []
};

const INITIAL_PAGINATION_STATE = {
  totalElements: 0,
  pageSize: 8,
  totalPages: 0,
  pageNumber: 1
};

const INITIAL_SORT_STATE = {
  sortBy: null,
  sortOrder: null
};

const ManagerQuestionnaireContext = createContext();

export const useManagerQuestionnaire = () => {
  return useContext(ManagerQuestionnaireContext);
};

export const ManageQuestionnaireProvider = ({ children }) => {
  const { selectedOrganization, selectedAccount, setSelectedOrganization, setSelectedAccount } = useOrgAccountSelectionContext();
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_STATE);
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT_STATE);
  const [entityType, setEntityType] = useState(null);
  let _accNumber;
  if (selectedAccount && selectedAccount.length > 0) {
    _accNumber = selectedAccount
      ?.map((i) => {
        if (i.isChecked) {
          return i.accountNumber;
        }
      })
      .filter((ele) => !!ele);
  }

  const requestParams = React.useMemo(() => {
    const baseParams = {
      pageNo: paginationConfig.pageNumber - 1,
      pageSize: paginationConfig.pageSize,
      ...(filterConfig?.searchQuery && { query: filterConfig.searchQuery }),
      ...(sortConfig?.sortBy && { sortBy: sortConfig.sortBy }),
      ...(sortConfig?.sortOrder && { sortOrder: sortConfig.sortOrder })
    };

    switch (entityType) {
      case MasterEntityType.Material:
        return {
          ...baseParams,
          ignoreCrosswalkedSP: true
        };
      case MasterEntityType.Catalog:
        return {
          ...baseParams,
          accountNumbers: _accNumber,
          channelType: 'ALL'
        };
      case MasterEntityType.Account:
        return {
          ...baseParams,
          practiceId: selectedOrganization?.id,
          channelType: 'ALL',
          partnerFunction: 'SOLD_TO'
        };
      default:
        return baseParams;
    }
  }, [entityType, filterConfig, paginationConfig.pageNumber, sortConfig, _accNumber, selectedOrganization?.id]);

  const {
    isLoading: isLoadingMaterial,
    isError: isErrorMaterial,
    data: MaterialData,
    refetch: refetchMaterialData
  } = useQuery({
    queryKey: ['Material', entityType, requestParams],
    queryFn: async () => {
      const url = `${ApiRoutes.THERAPIES()}?${serializeParams(requestParams)}`;
      const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
      if (!res.data) {
        return [];
      }

      if (res.data?.content) {
        res.data.content = res.data.content.map((i) => {
          let record = {};
          if (i.therapies && i.therapies.length <= 1) {
            record.isExpandable = false;
            const { therapies, ...rest } = i;
            record = {
              ...record,
              ...rest,
              ...i.therapies[0]
            };
          } else {
            record.isExpandable = true;
            record.channelType = i.channelType;
            record.tradeName = i.tradeName;
            record.therapies = i.therapies.map((t) => ({ ...t, isExpandable: false }));
          }
          return record;
        });

        console.log(res.data.content);
      }

      const { content: data, totalElements, totalPages } = res.data;

      setPaginationConfig((prevConfig) => ({
        ...prevConfig,
        ...(totalElements && { totalElements }),
        ...(totalPages && { totalPages })
      }));
      return data;
    },
    refetchOnWindowFocus: false,
    enabled: !!entityType && entityType === MasterEntityType.Material
  });

  const {
    isLoading: isLoadingCatalog,
    isError: isErrorCatalog,
    data: CatalogData,
    refetch: refetchCatalogData
  } = useQuery({
    queryKey: ['Catalog', entityType, selectedAccount?.id, , requestParams],
    queryFn: async () => {
      const url = `${ApiRoutes.CATALOGS()}?${serializeParams(requestParams)}`; //TODO
      const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
      if (!res.data) {
        return [];
      }
      const { content: data, totalElements, totalPages } = res.data;
      setPaginationConfig((prevConfig) => ({
        ...prevConfig,
        ...(totalElements && { totalElements }),
        ...(totalPages && { totalPages })
      }));
      return data;
    },
    refetchOnWindowFocus: false,
    enabled: !!selectedAccount && entityType === MasterEntityType.Catalog
  });

  const {
    isLoading: isLoadingAccounts,
    isError: isErrorAccounts,
    data: AccountsData,
    refetch: refetchAccountsData
  } = useQuery({
    queryKey: ['Accounts', entityType, selectedOrganization?.id, requestParams],
    queryFn: async () => {
      if (selectedOrganization?.id) {
        const url = `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${selectedOrganization?.id}/accounts?${serializeParams(requestParams)}`; // TODo
        const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
        if (!res.data) {
          return [];
        }
        const { content: data, totalElements, totalPages } = res.data;
        setPaginationConfig((prevConfig) => ({
          ...prevConfig,
          ...(totalElements && { totalElements }),
          ...(totalPages && { totalPages })
        }));
        return data;
      }
      return [];
    },
    refetchOnWindowFocus: false,
    enabled: !!selectedOrganization && entityType === MasterEntityType.Account
  });

  console.log();
  React.useEffect(() => {
    getRefetch(entityType);
  }, [filterConfig, paginationConfig.pageNumber, sortConfig, entityType]);

  const getRefetch = (entityType) => {
    const { isMaterial, isCatalog, isAccount } = getEntityTypeFlags(entityType);
    if (isAccount) {
      refetchAccountsData();
    } else if (isMaterial) {
      refetchMaterialData();
    } else if (isCatalog) {
      refetchCatalogData();
    }
  };

  const applySort = (sortConfig) => setSortConfig({ ...sortConfig });

  const applyFilters = (filters) => {
    setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
    setFilterConfig({ ...filters });
  };

  const clearFilters = () => {
    setFilterConfig({ ...INITIAL_FILTER_STATE });
  };

  const setCurrentPage = (pageNumber) => {
    setPaginationConfig((prevState) => ({
      ...prevState,
      pageNumber: pageNumber
    }));
  };

  const setEntity = (entity) => {
    setEntityType(entity);
    setSelectedOrganization(null);
    setSelectedAccount(null);
  };

  return (
    <ManagerQuestionnaireContext.Provider
      value={{
        filterConfig,
        paginationConfig,
        applyFilters,
        clearFilters,
        setCurrentPage,
        applySort,
        MaterialData,
        CatalogData,
        AccountsData,
        getRefetch,
        setEntity,
        entityType,
        setEntityType,
        isLoading: isLoadingAccounts,
        isError: isErrorAccounts
      }}>
      {children}
    </ManagerQuestionnaireContext.Provider>
  );
};
