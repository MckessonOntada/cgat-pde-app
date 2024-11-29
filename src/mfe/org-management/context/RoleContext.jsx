import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import HttpResourceService, { httpVerb } from "../../../api/HttpResourceService";
import ApiRoutes from "../../../api/ApiRoutes";
import { serializeParams } from "@src/util/ApiUtils";


function formatDate(dateStr, format = 'MM/DD/YYYY') {
  if (!dateStr) {
    throw new Error("No date value");
  }

  const parts = dateStr.split('/');

  if (parts.length !== 3) {
    throw new Error("Not a valid date string");
  }

  let [part1, part2, part3] = parts.map(Number);

  let month, day, year;

  if (part1 > 12) {
    day = part1;
    month = part2;
    year = part3;
  } else if (part2 > 12) {
    day = part2;
    month = part1;
    year = part3;
  } else {
    month = part1;
    day = part2;
    year = part3;
  }

  const date = new Date(year, month - 1, day);

  if (isNaN(date.getTime())) {
    throw new Error("Not a valid date string");
  }

  const pad = (value) => String(value).padStart(2, '0');

  const formattedDay = pad(date.getDate());
  const formattedMonth = pad(date.getMonth() + 1);
  const formattedYear = date.getFullYear();

  if (format.toUpperCase() === 'MM/DD/YYYY') {
    return `${formattedMonth}/${formattedDay}/${formattedYear}`;
  } else if (format.toUpperCase() === 'DD/MM/YYYY') {
    return `${formattedDay}/${formattedMonth}/${formattedYear}`;
  } else {
    throw new Error("Unsupported format");
  }
}

const RoleContext = createContext();

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider.");
  }
  return context;
};

const INITIAL_FILTER_STATE = {
  searchQuery: "",
  dateRange: [],
};

const INITIAL_SORT_STATE = {
  sortBy: null,
  sortOrder: null,
}

const INITIAL_PAGINATION_CONFIG = {
  totalElements: 0,
  pageSize: 8,
  totalPages: 0,
  pageNumber: 1,
};

export const RoleProvider = ({ children }) => {
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_CONFIG);
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT_STATE)
  const requestParams = useMemo(() => {
    const params = {
      pageNo: paginationConfig.pageNumber - 1,
      pageSize: paginationConfig.pageSize,
      sortBy: sortConfig.sortBy || "name",
      sortOrder: sortConfig.sortOrder || "asc",
    };

    if (filterConfig.searchQuery) params.query = filterConfig.searchQuery;
    if (filterConfig.dateRange?.[0]) params.startDate = formatDate(filterConfig.dateRange[0], 'dd/mm/yyyy');
    if (filterConfig.dateRange?.[1]) params.endDate = formatDate(filterConfig.dateRange[1], 'dd/mm/yyyy');
    return params;
  }, [filterConfig, paginationConfig.pageNumber, sortConfig]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["roles", requestParams],
    queryFn: async () => {
      const response = await HttpResourceService.callRest(
        `${ApiRoutes.GET_ROLES()}?${serializeParams(requestParams)}`,
        httpVerb.GET,
        {}
      );
      if (response.data) {
        const { content: data, totalElements, totalPages } = response.data;

        setPaginationConfig((prevConfig) => ({
          ...prevConfig,
          totalElements,
          totalPages,
        }));

        return data;
      }
      return [];
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetch();
  }, [filterConfig, paginationConfig.pageNumber, sortConfig]);

  const applySort = (sortConfig) => setSortConfig({ ...sortConfig })

  const applyFilters = (filters) => {
    setPageNumber(1);
    setFilterConfig(prevFilters => ({
      ...prevFilters,
      ...filters
    }));
  }

  const clearFilters = () => setFilterConfig(INITIAL_FILTER_STATE);

  const setPageNumber = (pageNumber) => {
    setPaginationConfig((prevConfig) => ({
      ...prevConfig,
      pageNumber,
    }));
  };


  const contextValue = {
    data: data || [],
    isLoading,
    isError,
    filterConfig,
    paginationConfig,
    setFilterConfig,
    clearFilters,
    applyFilters,
    applySort,
    setPageNumber,
  };

  return (
    <RoleContext.Provider value={contextValue}>
      {children}
    </RoleContext.Provider>
  );
};
