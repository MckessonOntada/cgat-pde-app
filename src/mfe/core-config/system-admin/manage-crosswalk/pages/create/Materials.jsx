import React from 'react';
import { useFilters, usePagination, useSort, useTable } from '@src/context/TableContext';
import { RadioGroup, InputField, Heading, Tooltip } from '@mckesson/mcp-component-library';
import { CustomDataTable } from '@src/components/dataTableComponent';
import { useTranslate } from '@src/translations/useTranslation';
import { Link } from 'react-router-dom';
import style from './style.module.scss';
import CommonUtils, { checkIsDataFiltered } from '@src/util/CommonUtils';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import EmptyDataTable from '@src/components/EmptyTable';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { ReactComponent as ArrowAngleRight } from '@src/assets/svg/arrow-right.svg';
import ServiceUtil from '@src/api/commonService/ServiceUtil';

const Materials = ({ onSelect, material }) => {
  const { t } = useTranslate();
  const { data, error, isLoading } = useTable();
  const { pagination, changePage } = usePagination();
  const { filters, applyFilters } = useFilters();
  const { applySort } = useSort();
  let beautifiedData = ServiceUtil.transformTherapies(data);

  const [materialQuery, setMaterialQuery] = React.useState(null);
  const debouncedApplyFilter = React.useCallback(
    CommonUtils.debounce((value) => {
      applyFilters({
        query: value
      });
    }, 1000),
    []
  );
  const isDataFiltered = React.useMemo(() => {
    return checkIsDataFiltered(filters);
  }, [filters]);
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
    if (!CommonUtils.isNonEmptyArray(data.therapies)) return null;
    const expandedData = data.therapies || [];
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
    return [
      {
        id: 'id',
        selector: () => {},
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
                onChangeValue={() => onSelect(row)}
                onOtherTextChange={() => {}}
                onSubRadioFieldChange={() => {}}
                radioBtnWidth="auto"
                value={material?.id == row.id ? row.id : ''}
              />
            </div>
          );
        }
      },
      {
        name: t('column.material.crosswalk.Therapy'),
        id: 'materialDescription',
        selector: (row) => row.materialDescription,
        wrap: true,
        maxWidth: '180px',
        sortable: true,
        sortKey: 'trade_name',
        cell: ({ cellValue, tradeName, id, isParent }) => {
          const searchParams = new URLSearchParams({
            trade: tradeName
          });
          if (!isParent) {
            const therapyParam = id ? id : tradeName;
            searchParams.set('therapy', therapyParam);
          }
          return (
            <Link className="MCP-table-link" aria-label={t('labels.therapyDescription')} to={`?${searchParams.toString()}`}>
              <EclipsesTextcss str={cellValue} />
            </Link>
          );
        }
      },
      {
        name: t('column.material.crosswalk.buyBillNDC'),
        id: 'ndcNumber',
        selector: (row) => row.ndcNumber,
        wrap: true,
        sortable: false,
        minWidth: '140px',
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
  };

  return (
    <React.Fragment>
      <div className={style['grid-item']}>
        <div className={`MCP-module-body ${style['header']}`}>
          <div className="MCP-CardContainer">
            <InputField
              value={materialQuery}
              errors={{}}
              placeholder={t('label.crosswalk.material.placeholder')}
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
      <div className={`${style['grid-item']} scrollable-table-wrapper`}>
        <CustomDataTable
          id="manage-material-table"
          type="normal"
          columns={getColumns()}
          data={beautifiedData}
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
          fixedHeaderScrollHeight={'380px'}
          fixedHeader={true}
          expandableRows
          expandableRowExpanded={isRowExpanded}
          expandableRowsComponent={ExpandedComponent}
          expandableRowsHideExpander={true}
          noDataComponent={
            <EmptyDataTable
              isLoading={isLoading}
              error={error}
              image={EmptyDataImage}
              heading={isDataFiltered ? t('errors.messages.noRecordsFound') : t('captions.emptyTableTitle.material-crosswalk')}
              description={!isDataFiltered && t('captions.emptyTableSubtitle.material-crosswalk')}
            />
          }
        />
      </div>
    </React.Fragment>
  );
};

export default Materials;
