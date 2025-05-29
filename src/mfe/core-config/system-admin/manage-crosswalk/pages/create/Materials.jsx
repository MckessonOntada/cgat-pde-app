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
  let data = null;
  if (_data) {
    data = _data.map((i) => {
      let record = {};
      if (i.therapies && i.therapies.length <= 1) {
        record.isExpandable = false;
        const { therapies, ...rest } = i;
        record = {
          ...record,
          ...rest,
          ...i.therapies[0]
        };
      } else {
        record.isExpandable = true;
        record.channelType = i.channelType;
        record.tradeName = i.tradeName;
        record.therapies = i.therapies.map((t) => ({ ...t, isExpandable: false }));
      }
      return record;
    });

    console.log(res.data.content);
  }

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
        sortable: true,
        sortKey: 'ndc',
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
      <div className={`${style['grid-item']} scrollable-table-wrapper`}>
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
