import OrderService from '@src/api/commonService/OrderService';
import AuthUtils from '@src/util/AuthUtils';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { useQuery } from 'react-query';

const initialFilterState = {
  searchQuery: '',
  accNum: [],
  accName: []
};

const initialPageConfig = {
  total: 0,
  pageSize: 10,
  pages: 0,
  currentPage: 1
};

const ShippingAddressContext = createContext();

export const useShippingAddress = () => {
  return useContext(ShippingAddressContext);
};

export const ShippingAddressProvider = ({ children, accountDetails }) => {
  const [filterState, setFilterState] = useState(initialFilterState);
  const [pageConfig, setPageConfig] = useState(initialPageConfig);
  const [dataState, setDataState] = useState([]);
  const { therapyId, selectedAccount } = accountDetails;

  const prepareDataForTable = (_data) => {
    const tableData = [];

    _data.forEach((d) => {
      const shippingAddress = [d.houseNumber, d.street, d.street2, d.street3, d.district, d.city, d.state, d.country, d.zipCode].join(', ');
      const shippingAccountNumber = d.accountNumber;
      const shippingAccountName = d.accountName;

      tableData.push({ shippingAccountName, shippingAccountNumber, shippingAddress });
    });

    return tableData;
  };

  const requestParams = useMemo(
    () => ({
      pageNumber: pageConfig.currentPage - 1,
      pageSize: pageConfig.pageSize,
      ...(filterState?.searchQuery && { query: filterState.searchQuery }),
      ...(filterState?.accNum && filterState?.accNum.length > 0 && { accNum: [...filterState.accNum] }),
      ...(filterState?.accName && filterState?.accName.length > 0 && { accName: [...filterState.accName] }) //,
    }),
    [filterState, pageConfig.currentPage]
  );

  const {
    isLoading,
    isError,
    refetch: refreshData
  } = useQuery({
    queryKey: ['Shipping', requestParams, selectedAccount?.accountNumber],
    queryFn: async () => OrderService.getShippingAddressForTherapyByAccountId(therapyId, selectedAccount?.accountNumber, requestParams),
    onSuccess: (result) => {
      if (result.content) {
        const { content: data, totalElements, totalPages, size, pageable } = result;

        setPageConfig(() => ({
          totalElements,
          totalPages,
          pageSize: size,
          currentPage: pageable.pageNumber
        }));

        const formattedData = prepareDataForTable(data);
        setDataState(formattedData);
      }
    },
    enabled: !!selectedAccount?.accountNumber,
    refetchOnWindowFocus: false
  });

  const applyFilters = (filters) => {
    setFilterState((prevFilters) => ({ ...prevFilters, ...filters }));
  };

  const clearFilters = () => {
    setFilterState({ ...initialFilterState });
  };

  const setPageNumber = (pageIndex) => {
    setPageConfig((prevConfig) => ({
      ...prevConfig,
      currentPage: pageIndex
    }));
  };

  const setShippingAddressData = (data) => {
    setDataState((prevState) => [...data]);
  };

  return (
    <ShippingAddressContext.Provider
      value={{
        isLoading,
        isError,
        refreshData,
        filterState,
        pageConfig,
        dataState,
        applyFilters,
        clearFilters,
        setPageNumber,
        setShippingAddressData
      }}>
      {children}
    </ShippingAddressContext.Provider>
  );
};
