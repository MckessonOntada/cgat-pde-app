import React, { createContext, useContext, useEffect, useState } from 'react';
import { manageMaterialData } from '../pages/system-configuration/manageMaterial/assets/__mock__/manageMaterialData';
import { useQuery } from 'react-query';
import useSnackbar from '@src/hooks/useSnackbar';
import { useTranslate } from '@src/translations/useTranslation';
import CommonUtils from '@src/util/CommonUtils';

// Create the context
export const ManageMaterialContext = createContext();

const RECORDS_PER_PAGE = 8;

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

  const { isFetching, isError, refetch } = useQuery(
    ['getMaterials'],
    async () => {
      const res = { data: { material: manageMaterialData } };

      if (!res.data || !res.data.material) {
        showSnackbar({ description: t('manageMaterial.data.fetch.error'), type: 'error' });
        return;
      }

      const startIndex = (paginationConfig.pageNumber - 1) * paginationConfig.pageSize;
      const endIndex = startIndex + paginationConfig.pageSize;

      setData(res.data.material.slice(startIndex, endIndex));
      setUnSlicedData(res.data.material);
      setActualData(res.data.material);

      setPaginationConfig((state) => ({
        ...state,
        totalPages: Math.ceil(res.data.material.length / paginationConfig.pageSize),
        totalElements: res.data.material.length
      }));
    },
    {
      onError: (error) => {
        error && showSnackbar({ description: t('manageMaterial.data.fetch.error'), type: 'error' });
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

  const applyFilters = () => {
    // Implement filter logic here
  };

  const clearFilters = () => {
    // Implement clear filter logic here
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
        setSelectedMaterials
      }}>
      {children}
    </ManageMaterialContext.Provider>
  );
};
