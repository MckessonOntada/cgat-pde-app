import OrderService from '@src/api/commonService/OrderService';
import AuthUtils from '@src/util/AuthUtils';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useQuery } from 'react-query';

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
      const address = [
        d.houseNumber,
        d.street,
        d.street2,
        d.street3,
        d.district,
        d.city,
        d.state,
        d.country,
        d.zipCode
      ]
        .filter(Boolean)
        .join(', ');
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
      ...(filterState?.accNum &&
        filterState?.accNum.length > 0 && { accNum: [...filterState.accNum] }),
      ...(filterState?.accName &&
        filterState?.accName.length > 0 && {
          accName: [...filterState.accName]
        }),
      ...(selectedAccount?.channelType && {
        channelType: selectedAccount?.channelType
      })
    }),
    [filterState, pageConfig.currentPage, selectedAccount]
  );

  const {
    isFetching,
    isError,
    error,
    refetch: refreshData
  } = useQuery({
    queryKey: [
      'Shipping',
      requestParams,
      selectedAccount?.accountNumber,
      therapyId
    ],
    queryFn: async () =>
      OrderService.getShippingAddressForTherapyByAccountId(
        therapyId,
        selectedAccount?.accountNumber,
        requestParams
      ),
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

  useEffect(() => {
    if (selectedAccount?.accountNumber) refreshData();
  }, [filterState, pageConfig.pageNumber]);

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
        setShippingAddressData
      }}>
      {children}
    </ShippingAddressContext.Provider>
  );
};
