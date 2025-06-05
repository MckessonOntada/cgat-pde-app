import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useTranslate } from '@src/translations/useTranslation';
import CommonUtils from '@src/util/CommonUtils';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { serializeParams } from '@src/util/ApiUtils';
import useAlert from '@src/hooks/useAlert';
import ServiceUtil from '@src/api/commonService/ServiceUtil';

// Create the context
export const ManageMaterialContext = createContext();

const RECORDS_PER_PAGE = 8;
const THERAPIES_PER_SEARCH = 20;

const INITIAL_FILTER_STATE = {
  searchQuery: ''
};

const INITIAL_SORT_STATE = {
  sortBy: '',
  sortOrder: ''
};

const INITIAL_PAGINATION_STATE = {
  totalElements: 0,
  pageSize: RECORDS_PER_PAGE,
  totalPages: 0,
  pageNumber: 1
};

export const useManageMaterial = () => {
  const context = useContext(ManageMaterialContext);
  if (!context) {
    throw new Error('useManageMaterial must be used within a ManageMaterialContext.');
  }
  return context;
};

// Create the provider component
export const ManageMaterialProvider = ({ children }) => {
  const { t } = useTranslate();
  const [actualData, setActualData] = useState([]);
  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_STATE);
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT_STATE);
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [previousFilterConfig, setPreviousFilterConfig] = useState(INITIAL_FILTER_STATE);

  const [selectedMaterials, setSelectedMaterials] = useState([]);

  const { showAlert } = useAlert();
  const alertContainerId = 'summary-alert-container';

  const getApiUrl = (searchText) => {
    const params = {
      pageNo: paginationConfig.pageNumber - 1,
      pageSize: paginationConfig.pageSize,
      ...(sortConfig?.sortBy && { sortBy: sortConfig.sortBy }),
      ...(sortConfig?.sortOrder && { sortOrder: sortConfig.sortOrder }),
      query: filterConfig.searchQuery || ''
    };
    return `${ApiRoutes.GET_ALL_MATERIALS()}?${serializeParams(params)}`;
  };

  const { isFetching, isError, refetch, data } = useQuery(
    ['getMaterials', filterConfig],
    async () => {
      const res = await HttpResourceService.callRest(`${getApiUrl()}`, httpVerb.GET, {});

      if (!res.data || !res.data.content) {
        showAlert({ description: t('manageMaterial.data.fetch.error'), type: 'error', anchorEl: alertContainerId });
        return;
      }

      res.data.content = ServiceUtil.transformTherapies(res.data.content);

      const { content: data, totalElements, totalPages } = res.data;
      setPaginationConfig((prevConfig) => ({
        ...prevConfig,
        ...(totalElements && { totalElements }),
        ...(totalPages && { totalPages })
      }));
      return data;
    },
    {
      onError: (error) => {
        error && showAlert({ description: t('manageMaterial.data.fetch.error'), type: 'error', anchorEl: alertContainerId });
      }
    }
  );

  const setPageNumber = (pageNumber) => {
    setPaginationConfig((prevConfig) => ({
      ...prevConfig,
      pageNumber
    }));
  };

  const applySort = (newSortConfig) => {
    setSortConfig(newSortConfig);
    setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
  };

  useEffect(() => {
    refetch();
  }, [paginationConfig.pageNumber, filterConfig, sortConfig]);

  const applyFilters = (filters) => {
    setPaginationConfig((prev) => ({ ...prev, pageNumber: INITIAL_PAGINATION_STATE.pageNumber }));
    setFilterConfig((prevFilters) => ({
      ...prevFilters,
      ...filters
    }));
  };

  const clearFilters = () => {
    setPaginationConfig((prev) => ({ ...prev, pageNumber: INITIAL_PAGINATION_STATE.pageNumber }));
    setFilterConfig(INITIAL_FILTER_STATE);
  };

  return (
    <ManageMaterialContext.Provider
      value={{
        data: data || [],
        actualData,
        paginationConfig,
        sortConfig,
        filterConfig,
        refetch,
        isFetching,
        isError,
        setPageNumber,
        applySort,
        applyFilters,
        clearFilters,
        selectedMaterials,
        setSelectedMaterials
      }}>
      {children}
    </ManageMaterialContext.Provider>
  );
};
