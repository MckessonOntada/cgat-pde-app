import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RadioGroup, Tooltip } from '@mckesson/mcp-component-library';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { ReactComponent as ArrowAngleRight } from '@src/assets/svg/arrow-right.svg';
import CommonUtils from '@src/util/CommonUtils';

export const createColumns = ({ t, trade = {}, onChange, readOnly, isRowExpanded, onExpandToggle }) => [
  {
    id: 'expandOrSelect',
    selector: () => null,
    width: '40px',
    sortable: false,
    showInMobileHeader: true,
    isSelectable: true,
    cell: (row) => {
      if (row.isExpandable && row.isParent) {
        const expanded = isRowExpanded?.(row);
        return (
          <div
            className="expand-icon-wrapper"
            style={{ cursor: 'pointer' }}
            onClick={() => onExpandToggle?.(row.tradeName)}
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
            id={`radio-button-order-therapy-${row.id}`}
            items={[
              {
                isDisabled: readOnly || false,
                label: ' ',
                value: row.id
              }
            ]}
            onChangeValue={() => {
              onChange(row);
            }}
            radioBtnWidth="auto"
            value={row.tradeName === trade.tradeName && trade.ndc === row.ndc ? row.id : ''}
          />
        </div>
      );
    }
  },
  {
    id: 'therapyDescription',
    name: t('labels.therapy'),
    selector: () => {},
    minWidth: '200px',
    sortable: true,
    sortKey: 'trade_name',
    showInMobileHeader: true,
    showColumnNameInHeader: true,
    cell: (row) => {
      const { tradeName, cellValue, channelType, id, isParent } = row;
      const location = useLocation();
      const locationState = location?.state ?? {};
      const searchParams = new URLSearchParams({
        trade: tradeName,
        channelType
      });
      if (!isParent) {
        const therapyParam = id ? id : tradeName;
        searchParams.set('therapy', therapyParam);
      }
      return (
        <Link className="MCP-table-link" aria-label={t('labels.therapyDescription')} to={`?${searchParams.toString()}`} state={{ ...locationState }}>
          <EclipsesTextcss str={cellValue} />
        </Link>
      );
    }
  },
  {
    id: 'genericName',
    name: t('labels.genericName'),
    selector: () => {},
    sortable: false,
    minWidth: '200px',
    cell: ({ isExpandable, genericName }) => {
      let toolTip = '',
        cellValue = '';
      if (isExpandable) {
        toolTip = genericName.join(', ');
        cellValue = CommonUtils.getListOverflowingDisplayLabel(genericName, 2);
      } else {
        toolTip = genericName;
        cellValue = genericName;
      }
      return cellValue ? (
        <span aria-label={t('labels.genericName')}>
          <Tooltip body={toolTip}>{cellValue?.toUpperCase()}</Tooltip>
        </span>
      ) : (
        '-'
      );
    }
  },

  {
    id: 'manufacturer',
    name: t('labels.manufacturer'),
    selector: () => {},
    width: '180px',
    sortable: false,
    cell: (row) => {
      const { isExpandable, manufacturer, manufacturerName } = row;
      let toolTip = '',
        cellValue = '';
      if (isExpandable) {
        toolTip = manufacturer.join(', ');
        cellValue = manufacturer[0] || '';
      } else {
        toolTip = manufacturerName;
        cellValue = manufacturerName;
      }
      return cellValue ? (
        <span aria-label={t('table.columns.captions.manufacturer')}>
          <Tooltip body={toolTip}>{cellValue}</Tooltip>
        </span>
      ) : (
        '-'
      );
    }
  },
  {
    id: 'formulation',
    name: t('labels.productForm'),
    selector: () => {},
    width: '140px',
    sortable: false,
    cell: (row) => {
      return row.productForm ? (
        <span aria-label={t('table.columns.captions.formulation')}>
          <Tooltip body={row.productForm}>{row.productForm}</Tooltip>
        </span>
      ) : (
        '-'
      );
    }
  },
  {
    id: 'dosage',
    name: t('labels.dosage'),
    selector: () => {},
    width: '100px',
    sortable: false,
    cell: (row) => {
      const hasValue = row.strength || row.dosage;

      return hasValue ? (
        <span aria-label={t('table.columns.captions.dosage')}>
          <Tooltip body={row.strength}>{`${row.strength || ''} ${row.dosage || ''}`.trim()}</Tooltip>
        </span>
      ) : (
        '-'
      );
    }
  },
  {
    id: 'ndc',
    name: t('labels.ndc'),
    selector: () => {},
    minWidth: '120px',
    sortable: false,
    showInMobileHeader: true,
    showColumnNameInHeader: true,
    cardHeader: true,
    cell: ({ isExpandable, ndc }) => {
      let toolTip = '',
        cellValue = '';
      if (isExpandable) {
        toolTip = ndc.join(', ');
        cellValue = t('labels.multiple');
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
  }
];
