import React, { createContext, useContext, useEffect, useState } from 'react';
import { manageMaterialData } from '../pages/system-configuration/manageMaterial/assets/__mock__/manageMaterialData';
import { useQuery, useMutation } from 'react-query';
import useSnackbar from '@src/hooks/useSnackbar';
import { useTranslate } from '@src/translations/useTranslation';
import CommonUtils from '@src/util/CommonUtils';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { serializeParams } from '@src/util/ApiUtils';

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
  const [data, setData] = useState([]);
  const [unSlicedData, setUnSlicedData] = useState([]);
  const [actualData, setActualData] = useState([]);

  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_STATE);
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT_STATE);
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [previousFilterConfig, setPreviousFilterConfig] = useState(INITIAL_FILTER_STATE);

  const [selectedMaterials, setSelectedMaterials] = useState([]);

  const { showSnackbar } = useSnackbar();

  const getApiUrl = (searchText) => {
    const params = {
      pageNo: paginationConfig.pageNumber - 1,
      pageSize: '',
      query: filterConfig.searchQuery || ''
    };
    return `${ApiRoutes.GET_ALL_MATERIALS()}?${serializeParams(params)}`;
  };

  const { isFetching, isError, refetch } = useQuery(
    ['getMaterials', filterConfig],
    async () => {
      const res = await HttpResourceService.callRest(`${getApiUrl()}`, httpVerb.GET, {});

      if (!res.data || !res.data.content) {
        showSnackbar({ description: t('manageMaterial.data.fetch.error'), type: 'error' });
        return;
      }

      const startIndex = (paginationConfig.pageNumber - 1) * paginationConfig.pageSize;
      const endIndex = startIndex + paginationConfig.pageSize;

      setData(res.data.content.slice(startIndex, endIndex));
      setUnSlicedData(res.data.content);
      setActualData(res.data.content);

      setPaginationConfig((state) => ({
        ...state,
        totalPages: Math.ceil(res.data.content.length / paginationConfig.pageSize),
        totalElements: res.data.content.length
      }));
    },
    {
      onError: (error) => {
        error && showSnackbar({ description: t('manageMaterial.data.fetch.error'), type: 'error' });
      }
    }
  );

  const [configureSuccess, setConfigureSuccess] = useState(false);

  const { mutate: configureMaterials } = useMutation(
    async (configValues) => {
      return await HttpResourceService.callRest(
        ApiRoutes.CONFIGURE_MATERIALS(),
        httpVerb.POST,
        configValues
      );
    },
    {
      onSuccess: () => {
        setConfigureSuccess(true);
        showSnackbar({ description: t('manageMaterial.drawer.controls.apply.success'), type: 'success' });
        refetch();
      },
      onError: (error) => {
        setConfigureSuccess(false);
        showSnackbar({ description: t('manageMaterial.drawer.controls.apply.error'), type: 'error' });
      }
    }
  );

  const setPageNumber = (pageNumber) => {
    setPaginationConfig((prevConfig) => ({
      ...prevConfig,
      pageNumber
    }));
  };

  const sortData = (newSortConfig) => {
    let _data = [...[], ...unSlicedData];

    let _modifiedData = _data.sort((a, b) => {
      const valA = a[newSortConfig.sortBy];
      const valB = b[newSortConfig.sortBy];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return newSortConfig.sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else if (typeof valA === 'number' && typeof valB === 'number') {
        return newSortConfig.sortOrder === 'asc' ? valA - valB : valB - valA;
      } else {
        return 0;
      }
    });
    const startIndex = (paginationConfig.pageNumber - 1) * paginationConfig.pageSize;
    const endIndex = startIndex + paginationConfig.pageSize;

    setData(_modifiedData.slice(startIndex, endIndex));
  };

  const applySort = (newSortConfig) => {
    setSortConfig(newSortConfig);
    setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
    if (paginationConfig.pageNumber === 1) {
      sortData(newSortConfig);
    }
  };

  const filterData = async (filters) => {
    let _data = [...[], ...actualData];
    let _modifiedData = _data.filter((item) => {
      const matchesSearchQuery = filters?.searchQuery
        ? item.materialNumber?.toString().toLowerCase().includes(filters.searchQuery.toLowerCase())
        : true;

      return matchesSearchQuery;
    });

    const startIndex = (paginationConfig.pageNumber - 1) * paginationConfig.pageSize;
    const endIndex = startIndex + paginationConfig.pageSize;
    // Updating the page count and total records
    setPaginationConfig((state) => ({
      ...state,
      totalPages: Math.ceil(_modifiedData.length / paginationConfig.pageSize),
      totalElements: _modifiedData.length
    }));
    setData(_modifiedData.slice(startIndex, endIndex));
    setUnSlicedData(_modifiedData);
  };

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

  const applyConfiguration = (configValues) => {
    configureMaterials(configValues);
  };

  useEffect(() => {
    if (CommonUtils.isNonEmptyArray(data) && CommonUtils.isNonEmptyArray(unSlicedData)) {
      filterData(filterConfig);
      if (JSON.stringify(sortConfig) !== JSON.stringify(INITIAL_SORT_STATE)) {
        sortData(sortConfig);
      }
    }
  }, [filterConfig, paginationConfig.pageNumber, sortConfig]);

  return (
    <ManageMaterialContext.Provider
      value={{
        data,
        actualData,
        paginationConfig,
        sortConfig,
        filterConfig,
        isFetching,
        isError,
        setPageNumber,
        applySort,
        applyFilters,
        clearFilters,
        selectedMaterials,
        setSelectedMaterials,
        applyConfiguration,
        configureSuccess
      }}>
      {children}
    </ManageMaterialContext.Provider>
  );
};
