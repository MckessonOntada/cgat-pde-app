import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { serializeParams } from '@src/util/ApiUtils';
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
  const [pageConfig, _setPageConfig] = useState(initialPageConfig);
  const [dataState, setDataState] = useState([]);
  const { therapyId, selectedAccount } = accountDetails;
  const userId = AuthUtils.getUserId();

  const prepareDataForTable = (_data) => {
    const tableData = [];

    _data.forEach((d) => {
      const shippingAddress = [d.houseNumber, d.street, d.street2, d.street3, d.district, d.city, d.state, d.country, d.zipCode].join(', ');
      const shippingAccountNumber = d.accountNumber;
      const shippingAccountName = d.accountName;

      tableData.push({ shippingAccountName, shippingAccountNumber, shippingAddress });
    });

    setDataState(tableData);
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
    data = [],
    refetch: refreshData
  } = useQuery({
    queryKey: ['Shipping', requestParams, selectedAccount?.accountNumber],
    queryFn: async () => {
      const url = `${ApiRoutes.ORDER(userId)}/therapies/${therapyId}/soldtoaccount/${
        selectedAccount?.accountNumber
      }/shiptoaccounts?${serializeParams(requestParams)}`;
      const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
      if (res.data) {
        const { content: data, totalElements, totalPages, size, pageable } = res.data;

        _setPageConfig((prevConfig) => ({
          totalElements,
          totalPages,
          pageSize: size,
          currentPage: pageable.pageNumber
        }));

        prepareDataForTable(data);
      }

      return [];
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

  const setPageConfig = (state) => {
    _setPageConfig({ ...state });
  };

  const setPageSize = (size) => {
    _setPageConfig((prevState) => ({ ...prevState, pageSize: size }));
  };

  const setCurrentPage = (page) => {
    _setPageConfig((prevState) => ({ ...prevState, currentPage: page }));
  };

  const setShippingAddressData = (data) => {
    setDataState((prevState) => [...data]);
  };

  return (
    <ShippingAddressContext.Provider
      value={{
        isLoading,
        isError,
        data,
        refreshData,
        filterState,
        pageConfig,
        dataState,
        applyFilters,
        clearFilters,
        setPageConfig,
        setPageSize,
        setCurrentPage,
        setShippingAddressData
      }}>
      {children}
    </ShippingAddressContext.Provider>
  );
};
