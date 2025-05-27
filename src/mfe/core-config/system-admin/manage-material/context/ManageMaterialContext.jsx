import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import useSnackbar from '@src/hooks/useSnackbar';
import { useTranslate } from '@src/translations/useTranslation';
import CommonUtils from '@src/util/CommonUtils';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { serializeParams } from '@src/util/ApiUtils';

// Create the context
export const ManageMaterialContext = createContext();

const RECORDS_PER_PAGE = 8;
const THERAPIES_PER_SEARCH = 20;

const INITIAL_FILTER_STATE = {
  searchQuery: ''
};

const INITIAL_SORT_STATE = {
  sortBy: '',
  sortOrder: ''
};

const INITIAL_PAGINATION_STATE = {
  totalElements: 0,
  pageSize: RECORDS_PER_PAGE,
  totalPages: 0,
  pageNumber: 1
};

export const useManageMaterial = () => {
  const context = useContext(ManageMaterialContext);
  if (!context) {
    throw new Error('useManageMaterial must be used within a ManageMaterialContext.');
  }
  return context;
};

// Create the provider component
export const ManageMaterialProvider = ({ children }) => {
  const { t } = useTranslate();
  const [actualData, setActualData] = useState([]);
  const [paginationConfig, setPaginationConfig] = useState(INITIAL_PAGINATION_STATE);
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT_STATE);
  const [filterConfig, setFilterConfig] = useState(INITIAL_FILTER_STATE);
  const [previousFilterConfig, setPreviousFilterConfig] = useState(INITIAL_FILTER_STATE);

  const [selectedMaterials, setSelectedMaterials] = useState([]);

  const { showSnackbar } = useSnackbar();

  const getApiUrl = (searchText) => {
    const params = {
      pageNo: paginationConfig.pageNumber - 1,
      pageSize: paginationConfig.pageSize,
      query: filterConfig.searchQuery || ''
    };
    return `${ApiRoutes.GET_ALL_MATERIALS()}?${serializeParams(params)}`;
  };

  const { isFetching, isError, refetch, data } = useQuery(
    ['getMaterials', filterConfig],
    async () => {
      const res = await HttpResourceService.callRest(`${getApiUrl()}`, httpVerb.GET, {});

      if (!res.data || !res.data.content) {
        showSnackbar({ description: t('manageMaterial.data.fetch.error'), type: 'error' });
        return;
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
    {
      onError: (error) => {
        error && showSnackbar({ description: t('manageMaterial.data.fetch.error'), type: 'error' });
      }
    }
  );

  const setPageNumber = (pageNumber) => {
    setPaginationConfig((prevConfig) => ({
      ...prevConfig,
      pageNumber
    }));
  };

  const applySort = (newSortConfig) => {
    setSortConfig(newSortConfig);
    setPaginationConfig((prev) => ({ ...prev, pageNumber: 1 }));
  };

  useEffect(() => {
    refetch();
  }, [paginationConfig.pageNumber, filterConfig, sortConfig]);

  const applyFilters = (filters) => {
    setPaginationConfig((prev) => ({ ...prev, pageNumber: INITIAL_PAGINATION_STATE.pageNumber }));
    setFilterConfig((prevFilters) => ({
      ...prevFilters,
      ...filters
    }));
  };

  const clearFilters = () => {
    setPaginationConfig((prev) => ({ ...prev, pageNumber: INITIAL_PAGINATION_STATE.pageNumber }));
    setFilterConfig(INITIAL_FILTER_STATE);
  };

  return (
    <ManageMaterialContext.Provider
      value={{
        data: data || [],
        actualData,
        paginationConfig,
        sortConfig,
        filterConfig,
        refetch,
        isFetching,
        isError,
        setPageNumber,
        applySort,
        applyFilters,
        clearFilters,
        selectedMaterials,
        setSelectedMaterials
      }}>
      {children}
    </ManageMaterialContext.Provider>
  );
};
