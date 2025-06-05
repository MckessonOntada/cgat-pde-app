import React from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { getAddress, MasterEntityType } from '../util';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { useManagerQuestionnaire } from '../context/ManageQuestionnaireContext';
import { renderTableCheckBox } from '@src/components/dataTableComponent/assets/constants/CustomTableConstants';
import { ReactComponent as ArrowAngleRight } from '@src/assets/svg/arrow-right.svg';
import { useTranslate } from '@src/translations/useTranslation';
import { Tooltip } from '@mckesson/mcp-component-library';
import { CHANNEL_TYPE } from '@src/mfe/order-management/pages/create/form-segments/Constants';
import CommonUtils from '@src/util/CommonUtils';

export const getColumnsByEntityType = ({
  entityType,
  entityData,
  selectedRows,
  setSelectedRows,
  setOpenDetails,
  setSelectedDetails,
  isRowExpanded,
  onExpandToggle
}) => {
  const { paginationConfig } = useManagerQuestionnaire();
  const { t } = useTranslate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams(location.search);
  switch (entityType) {
    case MasterEntityType.Material:
      return [
        {
          id: 'checkbox',
          name: renderTableCheckBox(
            { id: 'ALL_ITEMS_' + paginationConfig.pageNumber },
            CommonUtils.flattenTherapies(entityData),
            'materialNumber',
            {
              ...paginationConfig,
              totalElements: entityData.reduce((acc, item) => acc + (item.therapies ? item.therapies.length : 1), 0)
            },
            selectedRows,
            setSelectedRows
          ),
          sortable: false,
          cell: (row, index) => {
            if (row.isExpandable && row.therapies.length > 1) {
              const expanded = isRowExpanded?.(row);
              return (
                <div className="expand-icon-wrapper" onClick={() => onExpandToggle?.(row)} aria-label={expanded ? 'Collapse row' : 'Expand row'}>
                  <div className={`row-expansion-icon ${expanded ? 'open' : null}`}>
                    <ArrowAngleRight />
                  </div>
                </div>
              );
            }
            return renderTableCheckBox(
              row,
              CommonUtils.flattenTherapies(entityData),
              'materialNumber',
              {
                ...paginationConfig,
                totalElements: entityData.reduce((acc, item) => acc + (item.therapies ? item.therapies.length : 1), 0)
              },
              selectedRows,
              setSelectedRows
            );
          },
          selector: (row) => row.MRN,
          width: '50px'
        },
        {
          id: 'therapy',
          name: t('labels.therapy'),
          selector: () => {},
          maxWidth: '220px',
          sortable: true,
          sortKey: 'trade_name',
          cell: (row) => {
            const { tradeName, cellValue, channelType } = row;
            return (
              <span
                className="MCP-table-link"
                aria-label={t('table.columns.captions.accountNumber')}
                onClick={() => {
                  searchParams.set('trade', tradeName);
                  searchParams.set('channelType', channelType);
                  setSearchParams(searchParams);
                }}>
                <EclipsesTextcss str={cellValue} maxWidth={220} />
              </span>
            );
          }
        },
        {
          id: 'genericName',
          name: t('labels.genericName'),
          selector: (row) => row.genericName || '',
          maxWidth: '200px',
          cell: (row) => (
            <span aria-label={t('labels.genericName')}>
              <EclipsesTextcss str={row.genericName} maxWidth={200} />
            </span>
          )
        },
        {
          id: 'ndc',
          name: t('labels.ndc'),
          selector: (row) => row.ndc || '',
          sortable: false,
          minWidth: '240px',
          cell: ({ isExpandable, ndc }) => {
            let toolTip = '',
              cellValue = '';
            if (isExpandable) {
              toolTip = ndc.join(', ');
              cellValue = CommonUtils.getListOverflowingDisplayLabel(ndc, 2);
            } else {
              toolTip = ndc;
              cellValue = ndc;
            }
            return (
              <span aria-label={t('table.columns.captions.nationalDrugCode')}>
                <Tooltip body={toolTip}>{cellValue}</Tooltip>
              </span>
            );
          }
        },
        {
          id: 'manufacturer',
          name: t('labels.manufacturer'),
          selector: (row) => row.manufacturerName || '',
          sortable: false,
          maxWidth: '200px',
          cell: (row) => (
            <span aria-label={t('label.manufacturerName')}>
              <EclipsesTextcss str={row.manufacturerName} maxWidth={180} />
            </span>
          )
        },
        {
          id: 'formulation',
          name: t('labels.formulation'),
          selector: (row) => row.formulation || '',
          maxWidth: '200px',
          sortable: false,
          cell: (rows) => (
            <span aria-label={t('labels.formulation')}>
              <EclipsesTextcss str={rows.formulation} maxWidth={180} />
            </span>
          )
        },
        {
          id: 'dosage',
          name: t('table.columns.captions.dosage'),
          selector: (row) => row.dosage || '',
          maxWidth: '120px',
          sortable: false,
          cell: (props) => (
            <span aria-label={t('table.columns.captions.dosage')}>
              <EclipsesTextcss str={props.dosage} maxWidth={100} />
            </span>
          )
        }
      ];
    case MasterEntityType.Account:
      return [
        {
          id: 'checkbox',
          name:
            entityData?.length > 0
              ? renderTableCheckBox({ id: 'ALL_ITEMS_' + paginationConfig.pageNumber }, entityData, 'id', paginationConfig, selectedRows, setSelectedRows)
              : null,
          sortable: false,
          cell: (row, index) => renderTableCheckBox(row, entityData, 'id', paginationConfig, selectedRows, setSelectedRows),
          selector: (row) => row.MRN,
          width: '50px'
        },
        {
          id: 'accountNumber',
          name: t('table.columns.captions.accountNumber'),
          selector: (row) => row.accountNumber || '',
          maxWidth: '350px',
          cell: (props) => (
            <Link
              className="MCP-table-link"
              aria-label={t('table.columns.captions.accountNumber')}
              onClick={(e) => {
                e.preventDefault();
                setOpenDetails(true);
                setSelectedDetails(props);
              }}>
              <EclipsesTextcss str={props.accountNumber} maxWidth={240} />
            </Link>
          )
        },
        {
          id: 'accountName',
          name: t('table.columns.captions.accountName'),
          selector: (row) => row.accountName || '',
          maxWidth: '250px',
          cell: (props) => (
            <span aria-label={t('table.columns.captions.accountName')}>
              <EclipsesTextcss str={props.accountName} maxWidth={220} />
            </span>
          )
        },
        {
          id: 'address',
          name: t('table.columns.captions.address'),
          selector: (row) => row.accountNumber || '',
          maxWidth: '290px',
          cell: (props) => (
            <span aria-label={t('table.columns.captions.address')}>
              <EclipsesTextcss str={getAddress(props.address)} maxWidth={180} />
            </span>
          )
        },
        {
          id: 'salesOrg',
          name: t('labels.salesOrg'),
          selector: (row) => row.salesOrg || '',
          maxWidth: '250px',
          sortable: false,
          cell: (props) => (
            <span aria-label={t('labels.salesOrg')}>
              <EclipsesTextcss str={props.salesOrg} maxWidth={220} />
            </span>
          )
        },
        {
          id: 'distributionChannel',
          name: t('labels.distributionChannel'),
          selector: (row) => row.distributionChannel || '',
          maxWidth: '200px',
          sortable: false,
          cell: (props) => (
            <span aria-label={t('labels.distributionChannel')}>
              <EclipsesTextcss str={props.distributionChannel} maxWidth={180} />
            </span>
          )
        }
      ];
    case MasterEntityType.Catalog:
      return [
        {
          id: 'checkbox',
          name:
            entityData?.length > 0
              ? renderTableCheckBox({ id: 'ALL_ITEMS_' + paginationConfig.pageNumber }, entityData, 'id', paginationConfig, selectedRows, setSelectedRows)
              : null,
          sortable: false,
          cell: (row, index) => renderTableCheckBox(row, entityData, 'id', paginationConfig, selectedRows, setSelectedRows),
          selector: (row) => row.MRN,
          width: '50px'
        },
        {
          id: 'sapMaterial',
          name: t('labels.SapmaterialID'),
          selector: (row) => row.sapMaterial || '',
          maxWidth: '350px',
          cell: (props) => (
            <Link
              className="MCP-table-link"
              aria-label={t('labels.SapmaterialID')}
              onClick={(e) => {
                e.preventDefault();
                setOpenDetails(true);
                setSelectedDetails(props);
              }}>
              <EclipsesTextcss str={props.sapMaterial} maxWidth={240} />
            </Link>
          )
        },
        {
          id: 'materialDescription',
          name: t('labels.therapy.materialDescription'),
          selector: (row) => row.materialDescriptionInLanguageEn || '',
          maxWidth: '250px',
          minWidth: '180px',
          cell: (props) => (
            <span aria-label={t('labels.therapy.materialDescription')}>
              <EclipsesTextcss str={props.materialDescriptionInLanguageEn} maxWidth={170} />
            </span>
          )
        },
        {
          id: 'ndc',
          name: t('labels.therapy.ndc'),
          selector: (row) => row.ndc || '',
          maxWidth: '290px',
          cell: (props) => (
            <span aria-label={t('labels.therapy.ndc')}>
              <EclipsesTextcss str={props.ndc} maxWidth={180} />
            </span>
          )
        },
        {
          id: 'distChannel',
          name: t('labels.distChannel'),
          selector: (row) => row.distChannel || '',
          maxWidth: '290px',
          cell: (props) => (
            <span aria-label={t('labels.distChannel')}>
              <EclipsesTextcss str={props.distChannel} maxWidth={180} />
            </span>
          )
        },
        {
          id: 'variant',
          name: t('labels.variant'),
          selector: (row) => row.variant || '',
          maxWidth: '150px',
          sortable: false,
          cell: (props) => (
            <span aria-label={t('labels.variant')}>
              <EclipsesTextcss str={props.variant} maxWidth={130} />
            </span>
          )
        },
        {
          id: 'soldToCustomer',
          name: t('labels.soldTo'),
          selector: (row) => row.soldToCustomer || '',
          maxWidth: '150px',
          sortable: false,
          cell: (props) => (
            <span aria-label={t('labels.soldTo')}>
              <EclipsesTextcss str={props.soldToCustomer} maxWidth={130} />
            </span>
          )
        },
        {
          id: 'shipToCustomer',
          name: t('labels.shipTo'),
          selector: (row) => row.shipToCustomer || '',
          maxWidth: '150px',
          sortable: false,
          cell: (props) => (
            <span aria-label={t('labels.shipTo')}>
              <EclipsesTextcss str={props.shipToCustomer} maxWidth={130} />
            </span>
          )
        }
      ];
    default:
      return [];
  }
};
