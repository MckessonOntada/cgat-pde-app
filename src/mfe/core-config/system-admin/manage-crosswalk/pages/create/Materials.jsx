import React from 'react';
import { useFilters, usePagination, useSort, useTable } from '@src/mfe/core-config/admin/manage-providers/context/TableContext';
import { RadioGroup, InputField, Heading } from '@mckesson/mcp-component-library';
import { CustomDataTable } from '@src/components/dataTableComponent';
import { useTranslate } from '@src/translations/useTranslation';
import { Link } from 'react-router-dom';
import style from './style.module.scss';
import { useGenericContext } from '../../config/GenericContext';
import CommonUtils from '@src/util/CommonUtils';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import EmptyDataTable from '@src/components/EmptyTable';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { ReactComponent as ArrowAngleRight } from '@src/assets/svg/arrow-right.svg';

const Materials = () => {
  const { t } = useTranslate();
  const { _data, error, isLoading } = useTable();
  const { pagination, changePage } = usePagination();
  const { applyFilters } = useFilters();
  const { applySort } = useSort();

  const data = [
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
  ];

  if (data) {
    data.forEach((i) => {
      i.isExpandable = Boolean(CommonUtils.isNonEmptyArray(i.materials));
    });
  }

  const [materialQuery, setMaterialQuery] = React.useState(null);
  const debouncedApplyFilter = React.useCallback(
    CommonUtils.debounce((value) => {
      applyFilters({
        query: value
      });
    }, 1000),
    []
  );
  const handleOnChange = (event) => {
    const value = event.target.value;
    if (value !== null || value !== undefined) {
      setMaterialQuery(value);
      debouncedApplyFilter(value);
    }
  };
  const handleOnSort = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey) applySort({ sortBy: selectedColumn.sortKey, sortOrder: sortDirection });
  };
  const [expandedRows, setExpandedRows] = React.useState([]);
  const isRowExpanded = (row) => expandedRows.includes(row.tradeName);
  const onExpandToggle = (row) => {
    setExpandedRows((prev) => (prev.includes(row.tradeName) ? prev.filter((name) => name !== row.tradeName) : [...prev, row.tradeName]));
  };

  const ExpandedComponent = ({ data }) => {
    const expandedData = data.materials || [];
    const expandedColumns = getColumns();

    return (
      <div className="expanded-rows">
        <CustomDataTable
          data={expandedData}
          columns={expandedColumns}
          noTableHead
          noHeader
          pagination={false}
          showHeader={false}
          hideColumnHeader
          type="expanded"
          striped
        />
      </div>
    );
  };

  const getColumns = () => {
    const { state, setValue } = useGenericContext();
    return [
      {
        id: 'id',
        selector: () => {},
        width: '40px',
        sortable: false,
        showInMobileHeader: true,
        isSelectable: true,
        cell: (row) => {
          if (row.isExpandable && row.materials.length > 1) {
            const expanded = isRowExpanded?.(row);
            return (
              <div
                className="expand-icon-wrapper"
                style={{ cursor: 'pointer' }}
                onClick={() => onExpandToggle?.(row)}
                aria-label={expanded ? 'Collapse row' : 'Expand row'}>
                <div className={`row-expansion-icon ${expanded ? 'open' : null}`}>
                  <ArrowAngleRight />
                </div>
              </div>
            );
          }

          return (
            <div className="MCP-table-cell radio-button-wrapper">
              <RadioGroup
                direction="column"
                id={`radio-button-material-${row.id}`}
                items={[
                  {
                    isDisabled: false,
                    label: ' ',
                    value: row.id
                  }
                ]}
                onChangeValue={() => setValue('material', row)}
                onOtherTextChange={() => {}}
                onSubRadioFieldChange={() => {}}
                radioBtnWidth="auto"
                value={state.material?.id == row.id ? row.id : ''}
              />
            </div>
          );
        }
      },
      {
        name: t('labels.therapy'),
        id: 'materialDescription',
        selector: (row) => row.materialDescription,
        wrap: true,
        maxWidth: '180px',
        sortable: true,
        sortKey: 'materialDescription',
        cell: (row) => {
          const label = row.therapies && row.therapies.length === 1 ? row.therapies[0].materialDescription : row.tradeName || row.materialDescription;

          return (
            <Link className="MCP-table-link" aria-label={t('labels.therapyDescription')} to={`?therapy-details=${row.id}`}>
              <EclipsesTextcss str={label} />
            </Link>
          );
        }
      },
      {
        name: t('labels.ndc'),
        id: 'ndcNumber',
        selector: (row) => row.ndcNumber,
        wrap: true,
        sortable: false,
        minWidth: '140px',
        cell: (row) => {
          let displayCaption = '-';
          if (row.isExpandable) {
            displayCaption = row.materials.map((child) => child.ndcNumber).join(', ');
          } else {
            displayCaption = row.ndcNumber;
          }
          return <span aria-label={t('table.columns.captions.nationalDrugCode')}>{displayCaption}</span>;
        }
      }
    ];
  };

  return (
    <React.Fragment>
      <div className={style['grid-item']}>
        <div className={`MCP-module-body ${style['header']}`}>
          <div className="MCP-CardContainer">
            <InputField
              value={materialQuery}
              errors={{}}
              placeholder={'Search by Description, NDC'}
              id="material-search-field"
              name="materialQuery"
              onBlurFn={() => {}}
              onChangeFn={() => {}}
              onInputBlur={() => {}}
              onInputChange={handleOnChange}
              preventCharacters={[]}
              register={() => {}}
              tooltipText="Search Material"
              useRegister={false}
              validationFn={() => {}}
            />
          </div>
          <Heading as="h3">{t('label.materialListing')}</Heading>
        </div>
      </div>
      <div className={style['grid-item']}>
        <CustomDataTable
          id="manage-material-table"
          type="normal"
          columns={getColumns()}
          data={data}
          currentPage={pagination.pageNo}
          totalPageCount={pagination.totalPages}
          pagination={false}
          StepperControls={true}
          totalRocords={pagination.totalElements}
          onSortIconClick={handleOnSort}
          handleChangePage={(_event, pageNumber) => changePage(pageNumber)}
          recordsPerPage={pagination.pageSize}
          paginationTotalRecorsMessage={t('manageMaterial.table.pagination.totalRecords')}
          paginationRecordsPerPageMessage={t('manageMaterial.table.pagination.perPage')}
          responsive={true}
          showCardView={false}
          defaultExpandedCardView={true}
          expandableRows
          expandableRowExpanded={isRowExpanded}
          expandableRowsComponent={ExpandedComponent}
          expandableRowsHideExpander={true}
          noDataComponent={
            <EmptyDataTable
              isLoading={isLoading}
              error={error}
              image={EmptyDataImage}
              heading={t('captions.emptyTableTitle')}
              description={t('captions.emptyTableSubtitle')}
            />
          }
        />
      </div>
    </React.Fragment>
  );
};

export default Materials;
