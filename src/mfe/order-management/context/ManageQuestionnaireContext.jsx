import React, { createContext, useContext, useState } from 'react';
import { useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { getEntityTypeFlags, MasterEntityType } from '../questionnaire/util';
import { serializeParams } from '@src/util/ApiUtils';
import {
  OrgAccountSelectionProvider,
  useOrgAccountSelectionContext
} from '../components/orgAccountSelection/context/OrgAccountSelectionContext';
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

const INITIAL_DATA_STATE = [];

const ManagerQuestionnaireContext = createContext();

export const useManagerQuestionnaire = () => {
  return useContext(ManagerQuestionnaireContext);
};

export const ManageQuestionnaireProvider = ({ children }) => {
  const { selectedOrganization, selectedAccount } = useOrgAccountSelectionContext(); 
  const [filterConfig, setFilterConfig] = React.useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = React.useState(INITIAL_PAGINATION_STATE);
  const [sortConfig, setSortConfig] = React.useState(INITIAL_SORT_STATE);
  const [entityType, setEntityType] = React.useState(null); 
  const [MaterialData, setMaterialData] = React.useState([]);
  const [CatalogData, setCatalogData] = React.useState([]);
  const [AccountsData, setAccountsData] = React.useState([]);

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
          ...baseParams
        };
      case MasterEntityType.Catalog:
        return {
          ...baseParams,
          accountNumbers: selectedAccount?.accountNumber
        };
      case MasterEntityType.Account:
        return {
          ...baseParams,
          practiceId: selectedOrganization?.id,
          partnerFunction: 'SOLD_TO', 
        };
      default:
        return baseParams;
    }
  }, [entityType, filterConfig, paginationConfig.pageNumber, sortConfig,selectedAccount?.accountNumber,selectedOrganization?.id]);

  const {
    isLoading: isLoadingMaterial,
    isError: isErrorMaterial,    
    refetch: refetchMaterialData
  } = useQuery({
    queryKey: ['Material', entityType],
    queryFn: async () => {
      const url = `${ApiRoutes.THERAPIES()}?${serializeParams(requestParams)}`;
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
      setMaterialData(data);
      return data;
    },
    refetchOnWindowFocus: false,
    enabled: !!entityType && entityType === MasterEntityType.Material
  });

  const {
    isLoading: isLoadingCatalog,
    isError: isErrorCatalog,     
    refetch: refetchCatalogData
  } = useQuery({
    queryKey: ['Catalog', entityType],
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
      
      setCatalogData(data);
      return data;
    },
    refetchOnWindowFocus: false,
    enabled: !!selectedAccount && entityType === MasterEntityType.Catalog
  });

  const {
    isLoading: isLoadingAccounts,
    isError: isErrorAccounts, 
    refetch: refetchAccountsData
  } = useQuery({
    queryKey: ['Accounts', entityType],
    queryFn: async () => {
      const url =  `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${selectedOrganization.id}/accounts??${serializeParams(requestParams)}`; 
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
      setAccountsData(data);
      return data;
    },
    refetchOnWindowFocus: false,
    enabled: !!selectedOrganization && entityType === MasterEntityType.Account
  });

  React.useEffect(() => {
    getRefetch();
  }, [filterConfig, paginationConfig.pageNumber, sortConfig, entityType]);

  const getRefetch = (entityType) => {
    const { isMaterial, isCatalog, isAccount } = getEntityTypeFlags(entityType);

    if (isAccount) return refetchAccountsData;
    if (isMaterial) return refetchMaterialData;
    if (isCatalog) return refetchCatalogData;

    return [];
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
    setPaginationConfig((prevState) => ({ ...prevState, pageNumber: pageNumber }));
  };

  const setEntity = (entity) => {
    setEntityType(entity);
    if (entity === MasterEntityType.Material) {
      setMaterialData([]);  
    } else if (entity === MasterEntityType.Catalog) {
      setCatalogData([]); 
    } else if (entity === MasterEntityType.Account) {
      setAccountsData([]) 
    }
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
