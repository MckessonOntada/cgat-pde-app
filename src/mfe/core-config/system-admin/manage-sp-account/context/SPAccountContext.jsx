import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useOrgAccountSelectionContext } from '@src/mfe/core-config/system-admin/manage-questionnaire/components/orgAccountSelection/context/OrgAccountSelectionContext';
import AccountService from '@src/api/commonService/AccountService';
import { ChannelType } from '../util';
import AuthUtils from '@src/util/AuthUtils';
import { useLocation } from 'react-router-dom';

const RECORDS_PER_PAGE = 8;

const SPAccountContext = createContext();

export const useSPAccountContext = () => {
  const context = useContext(SPAccountContext);
  if (!context) {
    throw new Error('UseSPAccount must be used within a SPAccountProvider.');
  }
  return context;
};

const INITIAL_PAGINATION_STATE = {
  totalElements: 0,
  pageSize: RECORDS_PER_PAGE,
  totalPages: 0,
  pageNumber: 1
};

const INITIAL_FILTER_STATE = {
  searchQuery: ''
};

const INITIAL_SORT_STATE = {
  sortBy: 'sap_partner',
  sortOrder: 'desc'
};

const INITIAL_SORT_STATE_SP_MATERIAL = {
  sortBy: 'accountNumber',
  sortOrder: 'desc'
};

export const SPAccountProvider = ({ children, isLinkedAccounts = false, isSpMaterial = false }) => {
  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_STATE);
  const { selectedOrganization } = useOrgAccountSelectionContext();
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [sortConfig, setSortConfig] = useState(!isSpMaterial ? INITIAL_SORT_STATE : INITIAL_SORT_STATE_SP_MATERIAL);
  const practiceId = AuthUtils.getPracticeId();

  const organizationId = selectedOrganization?.id || practiceId;

  const location = useLocation();
  const spMaterialId = location.state?.sapID?.materialNumber;
  const salesOrg = location.state?.sapID?.salesOrg;

  useEffect(() => {
    clearFilters();
    setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
  }, [organizationId]);

  const setPageNumber = (pageNumber) => {
    setPaginationConfig((prevConfig) => ({
      ...prevConfig,
      pageNumber
    }));
  };

  const applyFilters = (filters) => {
    setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
    setFilterConfig((prevFilters) => ({
      ...prevFilters,
      ...filters
    }));
  };

  const clearFilters = () => {
    setFilterConfig(INITIAL_FILTER_STATE);
  };

  const requestParams = useMemo(() => {
    const baseParams = {
      pageNo: paginationConfig.pageNumber - 1,
      pageSize: paginationConfig.pageSize,
      sortBy: sortConfig.sortBy,
      sortOrder: sortConfig.sortOrder,
      allAccounts: selectedOrganization?.value === 'all' ? true : false,
      ...(filterConfig?.searchQuery && { query: filterConfig.searchQuery }),
      ...(!isSpMaterial && { practiceId: organizationId }),
      ...(!isSpMaterial && { partnerFunction: 'SOLD_TO' }),
      ...(!isSpMaterial && { channelType: !practiceId ? ChannelType.SPECIALITY_PHARMA : 'ALL' }),
      ...(isLinkedAccounts && filterConfig?.distributionChannel ? { channelType: filterConfig.distributionChannel } : {}),
      ...(isLinkedAccounts && filterConfig?.salesOrg ? { salesOrg: filterConfig.salesOrg } : {}),
      ...(isSpMaterial && { salesOrgs: salesOrg })
    };

    return baseParams;
  }, [filterConfig, paginationConfig.pageNumber, sortConfig, organizationId]);

  const {
    isLoading: isLoading,
    isError: isError,
    data: SPAccountList,
    refetch: refetchSPAccountList
  } = useQuery({
    queryKey: ['SPAccounts', selectedOrganization?.id, requestParams, organizationId, isSpMaterial, spMaterialId],
    queryFn: async () => {
      let result;

      if (!isSpMaterial) {
        if (!organizationId && selectedOrganization.value !== 'all') return [];
        result = await AccountService.getAccountList(requestParams, organizationId || 0);
      } else {
        result = await AccountService.getAssociatedMaterialSPAccountList(requestParams, spMaterialId);
      }
      const { content: data, totalElements, totalPages } = result;
      setPaginationConfig((prevConfig) => ({
        ...prevConfig,
        totalElements,
        totalPages
      }));
      return data;
    },
    refetchOnWindowFocus: false,
    enabled: Boolean(organizationId || selectedOrganization?.value === 'all')
  });

  useEffect(() => {
    refetchSPAccountList();
  }, [paginationConfig.pageNumber, sortConfig, filterConfig]);

  const applySort = (sortConfig) => setSortConfig({ ...sortConfig });

  const contextValue = {
    paginationConfig,
    SPAccountList: SPAccountList || [],
    setPageNumber,
    clearFilters,
    applyFilters,
    isLoading,
    isError,
    filterConfig,
    refetchSPAccountList,
    applySort,
    organizationId
  };
  return <SPAccountContext.Provider value={contextValue}>{children}</SPAccountContext.Provider>;
};
