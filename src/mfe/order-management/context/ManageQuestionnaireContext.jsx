import React, { createContext, useContext, useState } from 'react';
import { useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { MasterEntityType } from '../questionnaire/util';
import { serializeParams } from '@src/util/ApiUtils';
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
  const [filterConfig, setFilterConfig] = React.useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = React.useState(INITIAL_PAGINATION_STATE);
  const [sortConfig, setSortConfig] = React.useState(INITIAL_SORT_STATE);
  const [entityType, setEntityType] = React.useState(null);

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
          ...baseParams
          //Add more param
        };
      case MasterEntityType.Account:
        return {
          ...baseParams
          //Add more param
        };
      default:
        return baseParams;
    }
  }, [entityType, filterConfig, paginationConfig.pageNumber, sortConfig]);

  const {
    isLoading: isLoadingMaterial,
    isError: isErrorMaterial,
    data: MaterialData,
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
      return data;
    },
    refetchOnWindowFocus: false,
    enabled: entityType != null && entityType === MasterEntityType.Material
  });

  const {
    isLoading: isLoadingCatalog,
    isError: isErrorCatalog,
    data: CatalogData,
    refetch: refetchCatalogData
  } = useQuery({
    queryKey: ['Catalog', entityType],
    queryFn: async () => {
      const url = `${ApiRoutes.THERAPIES()}?${serializeParams(requestParams)}`;  //TODO
      const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
      if (res.data) {
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
    enabled: entityType != null && entityType === MasterEntityType.Catalog
  });

  const {
    isLoading: isLoadingAccounts,
    isError: isErrorAccounts,
    data: AccountsData,
    refetch: refetchAccountsData
  } = useQuery({
    queryKey: ['Accounts', entityType],
    queryFn: async () => {
      const url = `${ApiRoutes.THERAPIES()}?${serializeParams(requestParams)}`; // TODo
      const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
      if (res.data) {
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
    enabled: entityType != null && entityType === MasterEntityType.Account
  });

  React.useEffect(() => {
    
    if (entityType === MasterEntityType.Account) refetchAccountsData();
    else if (entityType === MasterEntityType.Material) refetchMaterialData();
    else if (entityType === MasterEntityType.Catalog)  
    refetchCatalogData();
  }, [filterConfig, paginationConfig.pageNumber, sortConfig, entityType]);

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

  const setEntity = (entityType) => {
    setEntityType(entityType);
    console.log('entityType',entityType)
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
        refetchMaterialData,
        refetchCatalogData,
        refetchAccountsData,
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
