import OrderService from '@src/api/commonService/OrderService';
import AuthUtils from '@src/util/AuthUtils';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { CHANNEL_TYPE } from '@src/mfe/order-management/pages/create/form-segments/Constants';

const initialFilterState = {
  searchQuery: '',
  accNum: [],
  accName: []
};

const initialPageConfig = {
  totalElements: 0,
  pageSize: 8,
  totalPages: 0,
  pageNumber: 1
};

const INITIAL_SORT_STATE = {
  sortBy: 'accountNumber',
  sortOrder: 'desc'
};

const ShippingAddressContext = createContext();

export const useShippingAddress = () => {
  return useContext(ShippingAddressContext);
};

export const ShippingAddressProvider = ({ children, accountDetails }) => {
  const [filterState, setFilterState] = useState(initialFilterState);
  const [pageConfig, setPageConfig] = useState(initialPageConfig);
  const [sortConfig, setSortConfig] = React.useState(INITIAL_SORT_STATE);
  const [dataState, setDataState] = useState([]);
  const { trade, selectedAccount, program } = accountDetails;

  const prepareDataForTable = (_data) => {
    const tableData = [];

    _data.forEach((d) => {
      const address = [d.houseNumber, d.street, d.street2, d.street3, d.district, d.city, d.state, d.country, d.zipCode].filter(Boolean).join(', ');
      const accountNumber = d.accountNumber;
      const accountName = d.accountName;
      const id = d.id;

      tableData.push({ id, accountName, accountNumber, address });
    });

    return tableData;
  };

  const requestParams = useMemo(
    () => ({
      pageNo: pageConfig.pageNumber - 1,
      pageSize: pageConfig.pageSize,
      ...(filterState?.searchQuery && { query: filterState.searchQuery }),
      ...(filterState?.accNum && filterState?.accNum.length > 0 && { accNum: [...filterState.accNum] }),
      ...(filterState?.accName &&
        filterState?.accName.length > 0 && {
          accName: [...filterState.accName]
        }),
      ...(sortConfig?.sortBy && { sortBy: sortConfig.sortBy }),
      ...(sortConfig?.sortOrder && { sortOrder: sortConfig.sortOrder }),
      ...(selectedAccount?.channelType && {
        channelType: selectedAccount?.channelType
      }),
      ...(selectedAccount?.channelType === CHANNEL_TYPE.BUY_AND_BILL && program && {
        program
      })
    }),
    [filterState, pageConfig.currentPage, selectedAccount?.channelType, sortConfig, program]
  );

  const {
    isFetching,
    isError,
    error,
    refetch: refreshData
  } = useQuery({
    queryKey: ['Shipping', requestParams, selectedAccount?.accountNumber, trade?.tradeName],
    queryFn: async () => OrderService.getShippingAddressForTherapyByAccountId(trade.ndc, selectedAccount?.accountNumber, requestParams),
    onSuccess: (result) => {
      if (result.content) {
        const { content: data, totalElements, totalPages } = result;

        setPageConfig((prevConfig) => ({
          ...prevConfig,
          ...(totalElements && { totalElements }),
          ...(totalPages && { totalPages })
        }));

        const formattedData = prepareDataForTable(data);
        setDataState(formattedData);
      }
    },

    enabled: !!selectedAccount?.accountNumber,
    refetchOnWindowFocus: false
  });

  const applyFilters = (filters) => {
    setPageConfig((prev) => ({ ...prev, pageNumber: 1 }));
    setFilterState({ ...filters });
  };

  const clearFilters = () => {
    setFilterState({ ...initialFilterState });
  };
  const applySort = (sortConfig) => setSortConfig({ ...sortConfig });

  useEffect(() => {
    if (selectedAccount?.accountNumber) refreshData();
  }, [filterState, pageConfig.pageNumber, sortConfig]);

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
        isFetching,
        isError,
        error,
        refreshData,
        filterState,
        pageConfig,
        dataState,
        selectedAccount,
        applyFilters,
        clearFilters,
        setPageNumber,
        setShippingAddressData,
        applySort
      }}>
      {children}
    </ShippingAddressContext.Provider>
  );
};
