import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import CommonUtils from '@src/util/CommonUtils';

const RecipientListContext = createContext();

export const useRecipientList = () => {
  const context = useContext(RecipientListContext);
  if (!context) {
    throw new Error('useRecipientList must be used within a RecipientListProvider.');
  }
  return context;
};

const RECORDS_PER_PAGE = 8;

const INITIAL_PAGINATION_STATE = {
  pageNumber: 1,
  pageSize: RECORDS_PER_PAGE
};

const INITIAL_SORT_STATE = {
  sortBy: '',
  sortOrder: ''
};

export const RecipientListProvider = ({ recipients = [], children }) => {
  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_STATE);
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT_STATE);

  const enrichedData = useMemo(() => recipients.map((recipient) => ({ ...recipient, fullName: CommonUtils.getFullName(recipient) })), [recipients]);

  const sortedData = useMemo(() => {
    if (!sortConfig.sortBy) return enrichedData;
    return [...enrichedData].sort((a, b) => {
      const valA = a[sortConfig.sortBy];
      const valB = b[sortConfig.sortBy];
      if (sortConfig.sortBy === 'fullName') {
        return sortConfig.sortOrder === 'asc' ? String(valA || '').localeCompare(String(valB || '')) : String(valB || '').localeCompare(String(valA || ''));
      }
      if (sortConfig.sortBy === 'lastUpdatedDate') {
        if (!valA && !valB) return 0;
        if (sortConfig.sortOrder === 'asc') {
          if (!valA) return 1;
          if (!valB) return -1;
          return dayjs(valA) - dayjs(valB);
        }
        if (!valA) return -1;
        if (!valB) return 1;
        return dayjs(valB) - dayjs(valA);
      }
      return 0;
    });
  }, [enrichedData, sortConfig]);

  const totalElements = sortedData.length;
  const totalPages = Math.ceil(totalElements / RECORDS_PER_PAGE);

  const pagedData = useMemo(() => {
    const start = (paginationConfig.pageNumber - 1) * RECORDS_PER_PAGE;
    return sortedData.slice(start, start + RECORDS_PER_PAGE);
  }, [sortedData, paginationConfig.pageNumber]);

  useEffect(() => {
    setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
  }, [recipients]);

  const handleSort = (selectedColumn, sortDirection) => {
    if (selectedColumn.id) {
      setSortConfig({ sortBy: selectedColumn.id, sortOrder: sortDirection });
      setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
    }
  };

  const handleChangePage = (e, newPage) => {
    setPaginationConfig((prev) => ({ ...prev, pageNumber: newPage }));
  };

  const contextValue = {
    pagedData,
    paginationConfig,
    totalElements,
    totalPages,
    handleSort,
    handleChangePage
  };

  return <RecipientListContext.Provider value={contextValue}>{children}</RecipientListContext.Provider>;
};
