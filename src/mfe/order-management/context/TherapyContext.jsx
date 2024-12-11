import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import AuthUtils from '@src/util/AuthUtils';

const TherapyContext = createContext();

const initialFilterState = {
  searchQuery: '',
  salesOrg: [],
  customerInd: [] //Todo
};

const initialPageConfig = {
  total: 0,
  pageSize: 8,
  pages: 0,
  pageNumber: 1
};

const initialDataState = [];

export const useTherapy = () => {
  const context = useContext(TherapyContext);
  if (!context) {
    throw new Error('useTherapy must be used within a Therapy Provider.');
  }
  return context;
};

export const TherapyProvider = ({ children }) => {
  const [filterState, setFilterState] = useState(initialFilterState);
  const [pageConfig, _setPageConfig] = useState(initialPageConfig);
  const [dataState, setDataState] = useState(initialDataState);
  const userId = AuthUtils.getUserId();
  const updateFilterState = useCallback((field, value) => {
    setFilterState((prevState) => ({
      ...prevState,
      [field]: value
    }));
  }, []);

  const requestParams = useMemo(
    () => ({
      pageNo: pageConfig.pageNumber - 1,
      pageSize: pageConfig.pageSize,
      ...(filterState?.searchQuery && { query: filterState.searchQuery }),
      ...(filterState?.salesOrg && { salesOrg: [filterState.salesOrg] }) //,
      // ...(filterState?.customerInd && { customerInd: [filterState.customerInd] })
    }),
    [filterState, pageConfig.pageNumber]
  );

  const { isLoading, isError, data, refetch } = useQuery({
    queryKey: ['Therapy', requestParams],
    queryFn: async () => {
      const url = `${ApiRoutes.THERAPY(userId)}?${serializeParams(requestParams)}`;
      const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
      if (res.data) {
        const { content: data, total, pages } = res.data;
        _setPageConfig((prevConfig) => ({
          ...prevConfig,
          ...(total && { total }),
          ...(pages && { pages })
        }));

        return data;
      }
      return [];
    },
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    refetch();
  }, [filterState, pageConfig.pageNumber]);

  const applyFilters = (filters) => {
    _setPageConfig((prev) => ({ ...prev, pageNumber: 1 }));
    setFilterState({ ...filters });
  };

  const setPageNumber = (pageNumber) => {
    _setPageConfig((prevConfig) => ({
      ...prevConfig,
      pageNumber
    }));
  };

  const clearFilters = () => {
    setFilterState(initialFilterState);
  };

  const setPageConfig = (state) => {
    _setPageConfig({ ...state });
  };

  const ctxValue = useMemo(
    () => ({
      data: data || [],
      isLoading,
      isError,
      filterState,
      setFilterState,
      pageConfig,
      applyFilters,
      clearFilters,
      setPageConfig,
      refreshData: refetch
    }),
    [updateFilterState, clearFilters, isLoading, isError, data, refetch]
  );
  return <TherapyContext.Provider value={ctxValue}>{children}</TherapyContext.Provider>;
};
