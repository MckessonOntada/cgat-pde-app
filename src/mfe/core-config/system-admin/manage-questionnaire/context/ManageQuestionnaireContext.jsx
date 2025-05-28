import React, { createContext, useContext, useState } from 'react';
import { useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { getEntityTypeFlags, MasterEntityType } from '../util';
import { serializeParams } from '@src/util/ApiUtils';
import { useOrgAccountSelectionContext } from '@src/mfe/core-config/system-admin/manage-questionnaire/components/orgAccountSelection/context/OrgAccountSelectionContext';
import CommonUtils from '@src/util/CommonUtils';
const INITIAL_FILTER_STATE = {
  searchQuery: '',
  status: []
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

const ManagerQuestionnaireContext = createContext();

export const useManagerQuestionnaire = () => {
  return useContext(ManagerQuestionnaireContext);
};

export const ManageQuestionnaireProvider = ({ children }) => {
  const { selectedOrganization, selectedAccount, setSelectedOrganization, setSelectedAccount } = useOrgAccountSelectionContext();
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_STATE);
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT_STATE);
  const [entityType, setEntityType] = useState(null);
  let _accNumber;
  if (selectedAccount && selectedAccount.length > 0) {
    _accNumber = selectedAccount
      ?.map((i) => {
        if (i.isChecked) {
          return i.accountNumber;
        }
      })
      .filter((ele) => !!ele);
  }

  const requestParams = React.useMemo(() => {
    const baseParams = {
      pageNo: paginationConfig.pageNumber - 1,
      pageSize: paginationConfig.pageSize,
      ...(filterConfig?.searchQuery && { query: filterConfig.searchQuery }),
      ...(sortConfig?.sortBy && { sortBy: sortConfig.sortBy }),
      ...(sortConfig?.sortOrder && { sortOrder: sortConfig.sortOrder })
    };

    switch (entityType) {
      case MasterEntityType.Material:
        return {
          ...baseParams,
          ignoreCrosswalkedSP: true
        };
      case MasterEntityType.Catalog:
        return {
          ...baseParams,
          accountNumbers: _accNumber,
          channelType: 'ALL'
        };
      case MasterEntityType.Account:
        return {
          ...baseParams,
          practiceId: selectedOrganization?.id,
          channelType: 'ALL',
          partnerFunction: 'SOLD_TO'
        };
      default:
        return baseParams;
    }
  }, [entityType, filterConfig, paginationConfig.pageNumber, sortConfig, _accNumber, selectedOrganization?.id]);

  const {
    isLoading: isLoadingMaterial,
    isError: isErrorMaterial,
    data: MaterialData,
    refetch: refetchMaterialData
  } = useQuery({
    queryKey: ['Material', entityType, requestParams],
    queryFn: async () => {
      const url = `${ApiRoutes.THERAPIES()}?${serializeParams(requestParams)}`;
      const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
      if (!res.data) {
        return [];
      }

      res.data = {
        content: [
          {
            tradeName: 'OCTAGAM',
            materials: [
              {
                id: 1,
                tenantId: null,
                materialNumber: '000000000002888816',
                siteName: null,
                channelType: 'BUY_AND_BILL',
                ndcNumber: '00069633902',
                strength: '10%',
                dosage: 'VIAL',
                materialDescription: 'MPB OCTAGAM 10% 30GM/300ML',
                ndcItemDescription: 'immun globG(IgG)/malt/IgA ov50',
                sellingUnitCode: 'EA',
                vendorName: 'PFIZER INC MPB',
                upcCode: '30069633902',
                rxdaCode: 'R',
                dropshipIndicator: 'I',
                itemStatus: 'A',
                baseUnitOfMeasure: 'EA',
                therCatgy: '800400',
                minOrdrQuantity: '1',
                drugForm: '2',
                additionalDescriptor: 'SUV, P/F, OUTER',
                color: 'CLEAR',
                flavor: '',
                routeDescription: '',
                matlPackSizeMultiplier: '10000 191',
                shape: '0',
                orangeBookCode: 'ZB',
                synonym: 'MP6339-02',
                manufacturerNumber: '8914',
                vendorTelephone: '5(87) 96-7',
                deaCode: '7',
                genericCodeNumberSequence: '6546',
                therapeuticClass: '78004000',
                transportationGroup: 'NZ02',
                dscsaEnabled: '5',
                orderingUomGtin: '0030069633902',
                genericName: null,
                productForm: null,
                fdbPkgSize: null,
                fdbCasePack: null,
                fdbUom: null,
                manufacturerName: null,
                hcpc1: null,
                billingUnit1: null,
                materialGroup1: 'IA',
                loadingGroup: 'LTN3',
                materialGroup: 'R',
                extMaterialGroup: null,
                netWeight: null,
                serializationType: '0',
                dchainSpecStatus: null,
                deliveringPlant: null,
                itemCategoryGroup: 'NORM',
                excludeWebstore: 'N',
                dispOnlyWebstore: null,
                addlInfoWebstore: 'N',
                batchManagement: 'X',
                hazMaterialNumber: null,
                minRemainingShelfLife: null,
                periodIndicatorForShelfLife: null,
                totalShelfLife: null,
                purchasingGroup: 'PB2',
                manufacturerPartNumber: null,
                cgatIdentifier: null,
                salesOrg: '8545',
                productLevelPricing: 'Y',
                isCrosswalked: true,
                xdistributionChannelStatus: null
              },
              {
                id: 2,
                tenantId: 234,
                materialNumber: '000000000002976249',
                siteName: null,
                channelType: 'BUY_AND_BILL',
                ndcNumber: '80777011096',
                strength: '50 MCG/0.5',
                dosage: 'SYRINGE',
                materialDescription: 'MPB SPIKEVAX 50MCG PFS 10',
                ndcItemDescription: 'COVID vac 24-25 (12up)(Mod)/PF',
                sellingUnitCode: 'EA',
                vendorName: 'MODERNA US INC MPB',
                upcCode: '38077711096',
                rxdaCode: 'R',
                dropshipIndicator: null,
                itemStatus: 'A',
                baseUnitOfMeasure: 'CT',
                therCatgy: '801200',
                minOrdrQuantity: '3',
                drugForm: '2',
                additionalDescriptor: 'OUTER, SUV, P/F',
                color: 'WHITE',
                flavor: '',
                routeDescription: '',
                matlPackSizeMultiplier: '00000 171',
                shape: '0',
                orangeBookCode: 'ZB',
                synonym: 'MP0110-96',
                manufacturerNumber: '8938',
                vendorTelephone: '6999999999',
                deaCode: '9',
                genericCodeNumberSequence: '8641',
                therapeuticClass: '18012000',
                transportationGroup: 'NZ02',
                dscsaEnabled: '5',
                orderingUomGtin: '',
                genericName: null,
                productForm: null,
                fdbPkgSize: null,
                fdbCasePack: null,
                fdbUom: null,
                manufacturerName: null,
                hcpc1: null,
                billingUnit1: null,
                materialGroup1: 'IF',
                loadingGroup: 'LTN4',
                materialGroup: 'R',
                extMaterialGroup: null,
                netWeight: null,
                serializationType: '0',
                dchainSpecStatus: null,
                deliveringPlant: null,
                itemCategoryGroup: 'ZORM',
                excludeWebstore: 'N',
                dispOnlyWebstore: null,
                addlInfoWebstore: 'N',
                batchManagement: 'X',
                hazMaterialNumber: null,
                minRemainingShelfLife: null,
                periodIndicatorForShelfLife: null,
                totalShelfLife: null,
                purchasingGroup: 'PB2',
                manufacturerPartNumber: null,
                cgatIdentifier: null,
                salesOrg: '8545',
                productLevelPricing: 'Y',
                isCrosswalked: true,
                xdistributionChannelStatus: null
              },
              {
                id: 3,
                tenantId: null,
                materialNumber: '000000000003742657',
                siteName: null,
                channelType: 'BUY_AND_BILL',
                ndcNumber: '50242092201',
                strength: '105 MG/0.7',
                dosage: 'VIAL',
                materialDescription: 'MPB HEMLIBRA 105MG/0.7ML SDV',
                ndcItemDescription: 'emicizumab-kxwh',
                sellingUnitCode: 'EA',
                vendorName: 'GENENTECH/MCK SP/MPB',
                upcCode: '35024292201',
                rxdaCode: 'R',
                dropshipIndicator: null,
                itemStatus: 'A',
                baseUnitOfMeasure: 'EA',
                therCatgy: '202816',
                minOrdrQuantity: '1',
                drugForm: '2',
                additionalDescriptor: 'SDV, P/F',
                color: 'COLORLESS',
                flavor: '',
                routeDescription: '',
                matlPackSizeMultiplier: '10000 851',
                shape: '0',
                orangeBookCode: 'ZB',
                synonym: 'MP0922-01',
                manufacturerNumber: '8906',
                vendorTelephone: '5888835255',
                deaCode: '5',
                genericCodeNumberSequence: '7793',
                therapeuticClass: '62028160',
                transportationGroup: 'NZ02',
                dscsaEnabled: '5',
                orderingUomGtin: '0035024292201',
                genericName: null,
                productForm: null,
                fdbPkgSize: null,
                fdbCasePack: null,
                fdbUom: null,
                manufacturerName: null,
                hcpc1: null,
                billingUnit1: null,
                materialGroup1: 'IA',
                loadingGroup: 'LTN3',
                materialGroup: 'R',
                extMaterialGroup: null,
                netWeight: null,
                serializationType: '0',
                dchainSpecStatus: null,
                deliveringPlant: null,
                itemCategoryGroup: 'ZANS',
                excludeWebstore: 'N',
                dispOnlyWebstore: null,
                addlInfoWebstore: 'N',
                batchManagement: 'X',
                hazMaterialNumber: null,
                minRemainingShelfLife: null,
                periodIndicatorForShelfLife: null,
                totalShelfLife: null,
                purchasingGroup: 'PB2',
                manufacturerPartNumber: null,
                cgatIdentifier: null,
                salesOrg: '8545',
                productLevelPricing: 'Y',
                isCrosswalked: true,
                xdistributionChannelStatus: null
              }
            ]
          },
          {
            tradeName: 'SPIKEVAX',
            materials: [
              {
                id: 4,
                tenantId: null,
                materialNumber: '000000000005010565',
                siteName: null,
                channelType: 'BUY_AND_BILL',
                ndcNumber: '73153090001',
                strength: '50-110M',
                dosage: 'T-CELL',
                materialDescription: 'BREYANZI 50-110M CAR POS T-CELL CTN US',
                ndcItemDescription: null,
                sellingUnitCode: 'EA',
                vendorName: 'CELGENE CORPORATION',
                upcCode: '73153090001',
                rxdaCode: null,
                dropshipIndicator: null,
                itemStatus: 'A',
                baseUnitOfMeasure: 'EA',
                therCatgy: null,
                minOrdrQuantity: null,
                drugForm: null,
                additionalDescriptor: null,
                color: null,
                flavor: null,
                routeDescription: null,
                matlPackSizeMultiplier: null,
                shape: null,
                orangeBookCode: null,
                synonym: '009-681',
                manufacturerNumber: '902492',
                vendorTelephone: null,
                deaCode: null,
                genericCodeNumberSequence: null,
                therapeuticClass: null,
                transportationGroup: 'Z010',
                dscsaEnabled: null,
                orderingUomGtin: null,
                genericName: null,
                productForm: null,
                fdbPkgSize: null,
                fdbCasePack: null,
                fdbUom: null,
                manufacturerName: 'CELGENE CORPORATION',
                hcpc1: null,
                billingUnit1: null,
                materialGroup1: null,
                loadingGroup: null,
                materialGroup: '18',
                extMaterialGroup: '10076',
                netWeight: 20.0,
                serializationType: null,
                dchainSpecStatus: null,
                deliveringPlant: null,
                itemCategoryGroup: null,
                excludeWebstore: null,
                dispOnlyWebstore: null,
                addlInfoWebstore: null,
                batchManagement: null,
                hazMaterialNumber: null,
                minRemainingShelfLife: null,
                periodIndicatorForShelfLife: null,
                totalShelfLife: null,
                purchasingGroup: null,
                manufacturerPartNumber: null,
                cgatIdentifier: null,
                salesOrg: '1100',
                productLevelPricing: 'N',
                isCrosswalked: false,
                xdistributionChannelStatus: 'ZA'
              },
              {
                id: 5,
                tenantId: null,
                materialNumber: '5',
                siteName: null,
                channelType: 'BUY_AND_BILL',
                ndcNumber: 'C002',
                strength: '40mg',
                dosage: 'mg',
                materialDescription: 'Pantop',
                ndcItemDescription: null,
                sellingUnitCode: '123',
                vendorName: 'RANBAXY',
                upcCode: 'RED',
                rxdaCode: null,
                dropshipIndicator: null,
                itemStatus: 'A',
                baseUnitOfMeasure: 'mg',
                therCatgy: null,
                minOrdrQuantity: null,
                drugForm: null,
                additionalDescriptor: null,
                color: null,
                flavor: null,
                routeDescription: null,
                matlPackSizeMultiplier: null,
                shape: null,
                orangeBookCode: null,
                synonym: null,
                manufacturerNumber: 'H012',
                vendorTelephone: null,
                deaCode: null,
                genericCodeNumberSequence: null,
                therapeuticClass: null,
                transportationGroup: null,
                dscsaEnabled: null,
                orderingUomGtin: null,
                genericName: 'Pantop',
                productForm: null,
                fdbPkgSize: null,
                fdbCasePack: null,
                fdbUom: null,
                manufacturerName: null,
                hcpc1: null,
                billingUnit1: null,
                materialGroup1: null,
                loadingGroup: null,
                materialGroup: null,
                extMaterialGroup: null,
                netWeight: null,
                serializationType: null,
                dchainSpecStatus: null,
                deliveringPlant: null,
                itemCategoryGroup: null,
                excludeWebstore: null,
                dispOnlyWebstore: null,
                addlInfoWebstore: null,
                batchManagement: null,
                hazMaterialNumber: null,
                minRemainingShelfLife: null,
                periodIndicatorForShelfLife: null,
                totalShelfLife: null,
                purchasingGroup: null,
                manufacturerPartNumber: null,
                cgatIdentifier: null,
                salesOrg: 'ORG2',
                productLevelPricing: 'N',
                isCrosswalked: true,
                xdistributionChannelStatus: null
              },
              {
                id: 6,
                tenantId: null,
                materialNumber: '55',
                siteName: null,
                channelType: 'BUY_AND_BILL',
                ndcNumber: '62956947961',
                strength: null,
                dosage: null,
                materialDescription: 'Alpha55',
                ndcItemDescription: null,
                sellingUnitCode: null,
                vendorName: null,
                upcCode: null,
                rxdaCode: null,
                dropshipIndicator: null,
                itemStatus: 'A',
                baseUnitOfMeasure: 'NA',
                therCatgy: null,
                minOrdrQuantity: null,
                drugForm: null,
                additionalDescriptor: null,
                color: null,
                flavor: null,
                routeDescription: null,
                matlPackSizeMultiplier: null,
                shape: null,
                orangeBookCode: null,
                synonym: null,
                manufacturerNumber: 'NA',
                vendorTelephone: null,
                deaCode: null,
                genericCodeNumberSequence: null,
                therapeuticClass: null,
                transportationGroup: null,
                dscsaEnabled: null,
                orderingUomGtin: null,
                genericName: null,
                productForm: null,
                fdbPkgSize: null,
                fdbCasePack: null,
                fdbUom: null,
                manufacturerName: null,
                hcpc1: null,
                billingUnit1: null,
                materialGroup1: null,
                loadingGroup: null,
                materialGroup: null,
                extMaterialGroup: null,
                netWeight: null,
                serializationType: null,
                dchainSpecStatus: null,
                deliveringPlant: null,
                itemCategoryGroup: null,
                excludeWebstore: null,
                dispOnlyWebstore: null,
                addlInfoWebstore: null,
                batchManagement: null,
                hazMaterialNumber: null,
                minRemainingShelfLife: null,
                periodIndicatorForShelfLife: null,
                totalShelfLife: null,
                purchasingGroup: null,
                manufacturerPartNumber: null,
                cgatIdentifier: null,
                salesOrg: 'so16',
                productLevelPricing: null,
                isCrosswalked: true,
                xdistributionChannelStatus: null
              }
            ]
          },
          {
            tradeName: 'ACTEMRA',
            materials: [
              {
                id: 7,
                tenantId: null,
                materialNumber: '56',
                siteName: null,
                channelType: 'BUY_AND_BILL',
                ndcNumber: '62956947955',
                strength: null,
                dosage: null,
                materialDescription: 'Alpha56',
                ndcItemDescription: null,
                sellingUnitCode: null,
                vendorName: null,
                upcCode: null,
                rxdaCode: null,
                dropshipIndicator: null,
                itemStatus: 'A',
                baseUnitOfMeasure: 'NA',
                therCatgy: null,
                minOrdrQuantity: null,
                drugForm: null,
                additionalDescriptor: null,
                color: null,
                flavor: null,
                routeDescription: null,
                matlPackSizeMultiplier: null,
                shape: null,
                orangeBookCode: null,
                synonym: null,
                manufacturerNumber: 'NA',
                vendorTelephone: null,
                deaCode: null,
                genericCodeNumberSequence: null,
                therapeuticClass: null,
                transportationGroup: null,
                dscsaEnabled: null,
                orderingUomGtin: null,
                genericName: null,
                productForm: null,
                fdbPkgSize: null,
                fdbCasePack: null,
                fdbUom: null,
                manufacturerName: null,
                hcpc1: null,
                billingUnit1: null,
                materialGroup1: null,
                loadingGroup: null,
                materialGroup: null,
                extMaterialGroup: null,
                netWeight: null,
                serializationType: null,
                dchainSpecStatus: null,
                deliveringPlant: null,
                itemCategoryGroup: null,
                excludeWebstore: null,
                dispOnlyWebstore: null,
                addlInfoWebstore: null,
                batchManagement: null,
                hazMaterialNumber: null,
                minRemainingShelfLife: null,
                periodIndicatorForShelfLife: null,
                totalShelfLife: null,
                purchasingGroup: null,
                manufacturerPartNumber: null,
                cgatIdentifier: null,
                salesOrg: 'NA',
                productLevelPricing: null,
                isCrosswalked: true,
                xdistributionChannelStatus: null
              },
              {
                id: 8,
                tenantId: null,
                materialNumber: '000000000013742657',
                siteName: null,
                channelType: 'BUY_AND_BILL',
                ndcNumber: '50242092201',
                strength: '105 MG/0.7',
                dosage: 'VIAL',
                materialDescription: 'MPB HEMLIBRA 105MG/0.7ML SDV',
                ndcItemDescription: 'emicizumab-kxwh',
                sellingUnitCode: 'EA',
                vendorName: 'GENENTECH/MCK SP/MPB',
                upcCode: '35024292201',
                rxdaCode: 'R',
                dropshipIndicator: null,
                itemStatus: 'A',
                baseUnitOfMeasure: 'EA',
                therCatgy: '202816',
                minOrdrQuantity: '1',
                drugForm: '2',
                additionalDescriptor: 'SDV, P/F',
                color: 'COLORLESS',
                flavor: '',
                routeDescription: '',
                matlPackSizeMultiplier: '10000 851',
                shape: '0',
                orangeBookCode: 'ZB',
                synonym: 'MP0922-01',
                manufacturerNumber: '8906',
                vendorTelephone: '5888835255',
                deaCode: '5',
                genericCodeNumberSequence: '7793',
                therapeuticClass: '62028160',
                transportationGroup: 'NZ02',
                dscsaEnabled: '5',
                orderingUomGtin: '0035024292201',
                genericName: null,
                productForm: null,
                fdbPkgSize: null,
                fdbCasePack: null,
                fdbUom: null,
                manufacturerName: null,
                hcpc1: null,
                billingUnit1: null,
                materialGroup1: 'IA',
                loadingGroup: 'LTN3',
                materialGroup: 'R',
                extMaterialGroup: null,
                netWeight: null,
                serializationType: '0',
                dchainSpecStatus: null,
                deliveringPlant: null,
                itemCategoryGroup: 'ZANS',
                excludeWebstore: 'N',
                dispOnlyWebstore: null,
                addlInfoWebstore: 'N',
                batchManagement: 'X',
                hazMaterialNumber: null,
                minRemainingShelfLife: null,
                periodIndicatorForShelfLife: null,
                totalShelfLife: null,
                purchasingGroup: 'PB2',
                manufacturerPartNumber: null,
                cgatIdentifier: null,
                salesOrg: '8545',
                productLevelPricing: 'Y',
                isCrosswalked: true,
                xdistributionChannelStatus: null
              }
            ]
          }
        ],
        pageable: {
          pageNumber: 0,
          pageSize: 8,
          sort: {
            empty: false,
            sorted: true,
            unsorted: false
          },
          offset: 0,
          paged: true,
          unpaged: false
        },
        last: false,
        totalPages: 2,
        totalElements: 3,
        sort: {
          empty: false,
          sorted: true,
          unsorted: false
        },
        first: true,
        size: 8,
        number: 0,
        numberOfElements: 3,
        empty: false
      };

      if (res.data?.content) {
        res.data.content.forEach((i) => {
          i.isExpandable = Boolean(CommonUtils.isNonEmptyArray(i.materials));
        });
      }

      const { content: data, totalElements, totalPages } = res.data;

      setPaginationConfig((prevConfig) => ({
        ...prevConfig,
        ...(totalElements && { totalElements }),
        ...(totalPages && { totalPages })
      }));
      return data;
    },
    refetchOnWindowFocus: false,
    enabled: !!entityType && entityType === MasterEntityType.Material
  });

  const {
    isLoading: isLoadingCatalog,
    isError: isErrorCatalog,
    data: CatalogData,
    refetch: refetchCatalogData
  } = useQuery({
    queryKey: ['Catalog', entityType, selectedAccount?.id, , requestParams],
    queryFn: async () => {
      const url = `${ApiRoutes.CATALOGS()}?${serializeParams(requestParams)}`; //TODO
      const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
      if (!res.data) {
        return [];
      }
      const { content: data, totalElements, totalPages } = res.data;
      setPaginationConfig((prevConfig) => ({
        ...prevConfig,
        ...(totalElements && { totalElements }),
        ...(totalPages && { totalPages })
      }));
      return data;
    },
    refetchOnWindowFocus: false,
    enabled: !!selectedAccount && entityType === MasterEntityType.Catalog
  });

  const {
    isLoading: isLoadingAccounts,
    isError: isErrorAccounts,
    data: AccountsData,
    refetch: refetchAccountsData
  } = useQuery({
    queryKey: ['Accounts', entityType, selectedOrganization?.id, requestParams],
    queryFn: async () => {
      if (selectedOrganization?.id) {
        const url = `${ApiRoutes.PUBLIC_ORGANIZATIONS}/${selectedOrganization?.id}/accounts?${serializeParams(requestParams)}`; // TODo
        const res = await HttpResourceService.callRest(url, httpVerb.GET, {});
        if (!res.data) {
          return [];
        }
        const { content: data, totalElements, totalPages } = res.data;
        setPaginationConfig((prevConfig) => ({
          ...prevConfig,
          ...(totalElements && { totalElements }),
          ...(totalPages && { totalPages })
        }));
        return data;
      }
      return [];
    },
    refetchOnWindowFocus: false,
    enabled: !!selectedOrganization && entityType === MasterEntityType.Account
  });

  console.log();
  React.useEffect(() => {
    getRefetch(entityType);
  }, [filterConfig, paginationConfig.pageNumber, sortConfig, entityType]);

  const getRefetch = (entityType) => {
    const { isMaterial, isCatalog, isAccount } = getEntityTypeFlags(entityType);
    if (isAccount) {
      refetchAccountsData();
    } else if (isMaterial) {
      refetchMaterialData();
    } else if (isCatalog) {
      refetchCatalogData();
    }
  };

  const applySort = (sortConfig) => setSortConfig({ ...sortConfig });

  const applyFilters = (filters) => {
    setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
    setFilterConfig({ ...filters });
  };

  const clearFilters = () => {
    setFilterConfig({ ...INITIAL_FILTER_STATE });
  };

  const setCurrentPage = (pageNumber) => {
    setPaginationConfig((prevState) => ({
      ...prevState,
      pageNumber: pageNumber
    }));
  };

  const setEntity = (entity) => {
    setEntityType(entity);
    setSelectedOrganization(null);
    setSelectedAccount(null);
  };

  return (
    <ManagerQuestionnaireContext.Provider
      value={{
        filterConfig,
        paginationConfig,
        applyFilters,
        clearFilters,
        setCurrentPage,
        applySort,
        MaterialData,
        CatalogData,
        AccountsData,
        getRefetch,
        setEntity,
        entityType,
        setEntityType,
        isLoading: isLoadingAccounts,
        isError: isErrorAccounts
      }}>
      {children}
    </ManagerQuestionnaireContext.Provider>
  );
};
