import ProviderService from '@src/api/commonService/ProviderService';
import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

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
    throw new TableContextError(
      'useTable must be used within a TableProvider.'
    );
  }

  return context;
};

export const useColumns = () => {
  const context = useContext(TableContext);

  if (!context) {
    throw new TableContextError(
      'useColumns must be used within a TableProvider.'
    );
  }

  const { columns } = context;

  return columns;
};

export const useSelection = () => {
  const context = useContext(TableContext);

  if (!context) {
    throw new TableContextError(
      'useSelection must be used within a TableProvider.'
    );
  }

  const { selectedRows, toggleRowSelection, selectAll, deselectAll } = context;

  return { selectedRows, toggleRowSelection, selectAll, deselectAll };
};

export const useSort = () => {
  const context = useContext(TableContext);

  if (!context) {
    throw new TableContextError('useSort must be used within a TableProvider.');
  }

  const { sort, setSort } = context;

  return { sort, setSort };
};

export const useFilters = () => {
  const context = useContext(TableContext);

  if (!context) {
    throw new TableContextError(
      'useFilters must be used within a TableProvider.'
    );
  }

  const { filters, applyFilters, clearFilters } = context;

  return { filters, applyFilters, clearFilters };
};
export const usePagination = () => {
  const context = useContext(TableContext);

  if (!context) {
    throw new TableContextError(
      'usePagination must be used within a TableProvider.'
    );
  }

  const { pagination, changePage } = context;

  return { pagination, changePage };
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

export const TableProvider = ({
  fetchFn,
  defaultFilters,
  columns,
  children
}) => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState(defaultFilters || { query: '' });
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [pagination, setPagination] = useState(INITIAL_PAGINATION_STATE);
  const [sort, setSort] = React.useState(INITIAL_SORT_STATE);

  const requestParams = React.useMemo(() => {
    const params = {
      pageNo: pagination.pageNumber - 1,
      pageSize: pagination.pageSize,
      sortBy: sort.sortBy || 'createdAt',
      sortOrder: sort.sortOrder || 'desc'
    };

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (key === 'searchQuery') {
          params['query'] = value?.toLowerCase();
          return;
        }
        params[key] = value?.toLowerCase();
      }
    });

    return params;
  }, [filters, pagination.pageNumber, sort]);

  const fetchData = () => {
    if (!fetchFn) return;

    try {
      const dataFetchPromise = new Promise(async (resolve, reject) => {
        const response = await fetchFn(requestParams);
      });

      dataFetchPromise
        .then((result) => {
          setData(result.content);
        })
        .catch((error) => {
          //setError
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, pagination.page, pagination.pageSize]);

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
  };

  const selectAll = () => {
    setSelectedRows(new Set(data.map((row) => row.id)));
  };

  const deselectAll = () => {
    setSelectedRows(new Set());
  };

  const applyFilters = (filters) => {
    setPagination((prev) => ({ ...prev, pageNumber: 1 }));
    setFilters({ ...filters });
  };

  const applySort = (sort) => {
    setSort({
      sortBy: sort.by,
      sortOrder: sort.order
    });
  };

  const clearFilters = () => {
    setFilters(defaultFilters || { query: '' });
  };

  const changePage = (pageNumber) => {
    setPagination((prevState) => ({
      ...prevState,
      pageNumber: pageNumber
    }));
  };

  const context = {
    data,
    filters,
    pagination,
    columns,
    sort,
    selectedRows,
    setPagination,
    toggleRowSelection,
    selectAll,
    deselectAll,
    applySort,
    applyFilters,
    clearFilters,
    changePage
  };

  return (
    <TableContext.Provider value={context}>{children}</TableContext.Provider>
  );
};
