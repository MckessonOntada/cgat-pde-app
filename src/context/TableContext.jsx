import React, { createContext, useContext, useEffect, useState } from 'react';

const TableContext = createContext();

export class TableContextError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TableContextError';
  }
}

export const useTable = () => {
  const context = useContext(TableContext);

  if (!context) {
    throw new TableContextError('useTable must be used within a TableProvider.');
  }

  return context;
};

export const useColumns = () => {
  const context = useContext(TableContext);

  if (!context) {
    throw new TableContextError('useColumns must be used within a TableProvider.');
  }

  const { columns } = context;

  return columns;
};

export const useSelection = () => {
  const context = useContext(TableContext);

  if (!context) {
    throw new TableContextError('useSelection must be used within a TableProvider.');
  }

  const { selectedRows, setSelection, selectedRowObjects, setSelectedRowObjects, toggleRowSelection, selectAll, deselectAll } = context;

  return {
    selectedRows,
    selectedRowObjects,
    toggleRowSelection,
    setSelection,
    setSelectedRowObjects,
    selectAll,
    deselectAll
  };
};

export const useSort = () => {
  const context = useContext(TableContext);

  if (!context) {
    throw new TableContextError('useSort must be used within a TableProvider.');
  }

  const { sort, applySort } = context;

  return { sort, applySort };
};

export const useFilters = () => {
  const context = useContext(TableContext);

  if (!context) {
    throw new TableContextError('useFilters must be used within a TableProvider.');
  }

  const { filters, applyFilters, clearFilters } = context;

  return { filters, applyFilters, clearFilters };
};
export const usePagination = () => {
  const context = useContext(TableContext);

  if (!context) {
    throw new TableContextError('usePagination must be used within a TableProvider.');
  }

  const { pagination, changePage } = context;

  return { pagination, changePage };
};

const INITIAL_PAGINATION_STATE = {
  totalElements: 0,
  pageSize: 8,
  totalPages: 0,
  pageNo: 1
};

const INITIAL_SORT_STATE = {
  sortBy: null,
  sortOrder: 'asc'
};

export const TableProvider = ({ fetchFn, defaultFilters, defaultSort, columns, allowedSort = [], children }) => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState(defaultFilters || { query: '' });
  const [isFilterApplied, setIsFilterApplied] = React.useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectedRowObjects, setSelectedRowObjects] = useState(new Set());
  const [pagination, setPagination] = useState(INITIAL_PAGINATION_STATE);

  const [sort, setSort] = React.useState(() => {
    return {
      ...INITIAL_SORT_STATE,
      ...defaultSort
    };
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const requestParams = React.useMemo(() => {
    const filterParams = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (key === 'searchQuery') {
          filterParams['query'] = value?.toLowerCase();
          return;
        }
        filterParams[key] = value;
      }
    });

    const otherParams = {
      pageNo: pagination.pageNo - 1,
      pageSize: pagination.pageSize,
      sortBy: allowedSort.includes(sort.sortBy) ? sort.sortBy : allowedSort[0] || '',
      sortOrder: sort.sortOrder || 'desc'
    };

    return {
      ...filterParams,
      ...otherParams
    };
  }, [filters, pagination.pageNo, sort]);

  const fetchData = () => {
    if (!fetchFn) return;

    try {
      const dataFetchPromise = new Promise(async (resolve, reject) => {
        setLoading(true);
        try {
          const response = await fetchFn(requestParams);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });

      dataFetchPromise
        .then((result) => {
          setLoading(false);
          setData(result.content);
          const { totalElements, totalPages } = result;
          setPagination({
            ...pagination,
            totalElements,
            totalPages
          });
        })
        .catch((error) => {
          setLoading(false);
          setError(error);
          //setError
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, pagination.pageNo, sort]);

  const toggleRowSelection = (id) => {
    setSelectedRows((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return newSelection;
    });
    setSelectedRowObjects((prev) => {
      const newSet = new Set(prev);
      const exists = [...newSet].some((r) => r.id === id);
      if (exists) {
        [...newSet].forEach((r) => {
          if (r.id === id) newSet.delete(r);
        });
      } else {
        newSet.add(row);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    setSelectedRows(new Set(data.map((row) => row.id)));
    setSelectedRowObjects(new Set(data));
  };

  const setSelection = (val = []) => {
    setSelectedRows(new Set(val.map((row) => row.id)));
    setSelectedRowObjects(new Set(val));
  };

  const deselectAll = () => {
    setSelectedRows(new Set());
    setSelectedRowObjects(new Set());
  };

  const applyFilters = (filters) => {
    if (typeof filters === 'object' && Object.values(filters).some((filter) => Boolean(filter))) {
      setIsFilterApplied(true);
    }
    setPagination((prev) => ({ ...prev, pageNo: 1 }));
    setFilters({ ...defaultFilters, ...filters });
  };

  const applySort = (sortBy, sortDirection) => {
    let newSortOrder;

    if (sortBy !== sort.sortBy) {
      newSortOrder = sortDirection;
    } else {
      newSortOrder = sort.sortOrder === 'asc' ? 'desc' : 'asc';
    }

    setSort({
      sortBy,
      sortOrder: newSortOrder
    });
  };

  const clearFilters = () => {
    setFilters(defaultFilters || { query: '' });
    setIsFilterApplied(false);
  };

  const changePage = (pageNo) => {
    setPagination((prevState) => ({
      ...prevState,
      pageNo
    }));
  };

  const context = {
    data,
    loading,
    error,
    filters,
    isFilterApplied,
    pagination,
    columns,
    sort,
    selectedRows,
    selectedRowObjects,
    setSelection,
    setPagination,
    toggleRowSelection,
    selectAll,
    deselectAll,
    applySort,
    applyFilters,
    clearFilters,
    changePage,
    refreshTable: fetchData,
    requestParams
  };

  return <TableContext.Provider value={context}>{children}</TableContext.Provider>;
};
