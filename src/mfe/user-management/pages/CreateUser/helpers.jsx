import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, CheckboxGroup, Tooltip } from '@mckesson/mcp-component-library';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { ReactComponent as ArrowAngleRight } from '@src/assets/svg/arrow-right.svg';
import CommonUtils from '@src/util/CommonUtils';
import { renderTableCheckBox } from '@src/components/dataTableComponent/assets/constants/CustomTableConstants';
import { ReactComponent as LinkIcon } from '@src/assets/svg/link.svg';

export const createColumns = ({
  t,
  columnActions = {},
  omitColumns = [],
  selectedRecords = [],
  setSelectedRecords,
  pagination = {},
  data,
  isRowExpanded,
  onExpandToggle
}) => {
  const isAllChecked = () => {
    const ids = selectedRecords.map((record) => record.id);
    const flatData = data.flatMap((item) => {
      if (item.isExpandable) {
        return item.therapies;
      } else {
        return [item];
      }
    });
    return flatData.every((item) => {
      const result = ids.includes(item.id);
      return result;
    });
  };
  const handleOnChangeAll = (event) => {
    const { checked } = event.target;

    const flatData = data.flatMap((item) => {
      if (item.isExpandable) {
        return item.therapies;
      } else {
        return [item];
      }
    });
    if (checked) {
      setSelectedRecords((prevState) => [...prevState, ...flatData]);
    } else {
      const ids = flatData.map((record) => record.id);

      const filteredData = selectedRecords.filter((item) => !ids.includes(item.id));
      setSelectedRecords(filteredData);
    }
  };
  return [
    {
      id: 'expandOrSelect',
      selector: () => null,
      width: '50px',
      sortable: false,
      showInMobileHeader: true,
      isSelectable: true,
      name:
        data?.length > 0 ? (
          <CheckboxGroup
            id={'default'}
            name="order-agreement"
            items={[
              {
                label: '',
                isChecked: isAllChecked(),
                onChange: handleOnChangeAll
              }
            ]}
            size="md"
          />
        ) : null,
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
            {renderTableCheckBox(row, data, 'id', { ...pagination, pageNumber: pagination.pageNo }, selectedRecords, setSelectedRecords, true, true)}
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
      id: 'ndc',
      name: t('labels.ndc'),
      selector: () => {},
      minWidth: '120px',
      sortable: false,
      showInMobileHeader: true,
      showColumnNameInHeader: true,
      cardHeader: true,
      omit: omitColumns.includes('ndc'),
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
    },
    {
      id: 'manufacturer',
      name: t('labels.manufacturer'),
      selector: () => {},
      width: '180px',
      sortable: false,
      omit: omitColumns.includes('manufacturer'),
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
      name: t('table.columns.caption.formulation'),
      selector: () => {},
      width: '140px',
      sortable: false,
      omit: omitColumns.includes('formulation'),
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
      omit: omitColumns.includes('dosage'),
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
      id: 'action',
      center: true,
      name: t('account.action'),
      omit: omitColumns.includes('action'),
      cell: (row) => {
        let materialIds = [];
        if (row.isExpandable) {
          materialIds = row.therapies.map((therapy) => therapy.id);
        } else {
          materialIds = [row.id];
        }

        return (
          <Button Icon={LinkIcon} variant="tertiary" size="sm" onClick={() => columnActions.onUnlink(materialIds)}>
            {t('account.btn.unlink')}
          </Button>
        );
      },
      width: '120px',
      omit: omitColumns.includes('action'),
      isAction: true
    }
  ];
};
