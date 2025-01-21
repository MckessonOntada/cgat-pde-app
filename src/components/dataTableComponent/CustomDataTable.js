import React from 'react';
import PropTypes from 'prop-types';
import DataTable from 'react-data-table-component';
import styles from './assets/CustomDataTable.module.scss';
import { Divider } from '@mckesson/mcp-component-library';
import './assets/DataTableCssOverride.scss';
import { customStylesNormal, customStylesCompact } from './assets/DataTableCutomStyle.js';
import { Paginate } from '@mckesson/mcp-component-library';
import { Loader } from '@mckesson/mcp-component-library';
import { CUSTOM_TABLE_TYPE } from './assets/constants/CustomTableConstants';
import DataTableEmptyView from './assets/DataTableEmptyView';
import CommonUtils from '@src/util/CommonUtils';
import CustomCard from './CustomCards';

export const CustomDataTable = (props) => {
  const {
    id,
    type,
    columns,
    data,
    onSortIconClick,
    currentPage,
    totalPageCount,
    handleChangePage,
    totalRocords,
    noDataComponent,
    fixedHeaderScrollHeight,
    defaultSortColumn,
    paginationTotalRecorsMessage,
    paginationRecordsPerPageMessage,
    stickyHeader,
    selectableRows,
    handleRowSelected,
    recordsPerPage,
    sortIcon,
    pagination,
    progressPending,
    progressComponent,
    handleRowClicked,
    defaultSortAsc,
    responsive,
    isAdmin,
    isStickyPagination,
    selectedRowId,
    rowSelectCritera,
    selectedRowIds,
    showCardView
  } = props;

  const pageChangeEvent = (e, newPage) => {
    if (!showCardView) document.querySelector(`#data-table-${id} > *:first-child`).scrollTop = 0;
    handleChangePage(e, newPage);
  };

  const getTypeClasses = () => {
    let classes;
    switch (type) {
      case CUSTOM_TABLE_TYPE.NORMAL:
        classes = styles.typeNormal;
        break;
      case CUSTOM_TABLE_TYPE.COMPACT:
        classes = styles.typeCompact;
        break;
      default:
        break;
    }
    return classes;
  };

  const renderPagination = () => {
    if (CommonUtils.isNonEmptyArray(data) && totalRocords > recordsPerPage) {
      return (
        <div
          data-testid={'table-pagination-' + id}
          className={isStickyPagination ? styles.paginationWrapperSticky : styles.paginationWrapper}>
          <div className={styles.d_flex}>
            <div className={styles.totalRecords}>
              {totalRocords} {paginationTotalRecorsMessage}
            </div>
            <Divider className={styles.verticalLine} orientation="vertical" role="presentation" />
            <div className={styles.pagination}>
              <Paginate
                currentPage={currentPage}
                totalCount={totalPageCount}
                onPageChange={(e, newPage) => pageChangeEvent(e, newPage)}
                pageSize={recordsPerPage}
              />
            </div>
            <Divider className={styles.verticalLine} orientation="vertical" role="presentation" />
            <div className={styles.recordPerPage}>
              {recordsPerPage} {paginationRecordsPerPageMessage}
            </div>
          </div>
        </div>
      );
    }
    if (isAdmin && CommonUtils.isNonEmptyArray(data) && totalRocords <= recordsPerPage) {
      return (
        <div className={styles.paginationWrapper}>
          <div className={styles.d_flex}>
            <div className={styles.totalRecords}>
              {totalRocords} {totalRocords == 1 ? paginationTotalRecorsMessage.slice(0, -1) : paginationTotalRecorsMessage}
            </div>
          </div>
        </div>
      );
    }
  };

  const getConditionalRowStyles = () => {
    if (!selectedRowId && !selectedRowIds) {
      return [];
    }
    return [
      {
        when: (row) => (selectableRows ? !!selectedRowIds?.includes(row.id) : row.id === selectedRowId),
        style: {
          backgroundColor: 'var(--brand-color-secondary-active-yellow-2)'
        }
      }
    ];
  };

  return (
    <>
      {showCardView ? (
        <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 align-items-start">
          {data.map((row) => (
            <CustomCard columns={columns} row={row} />
          ))}
        </div>
      ) : (
        <div
          className={`${styles.tableContainer} ${getTypeClasses()} ${
            progressPending || !data || data?.length == 0 ? styles.noDataTable : ''
          }`}
          id={`data-table-${id}`}>
          <DataTable
            columns={columns}
            data={data}
            defaultSortFieldId={defaultSortColumn}
            sortServer={true}
            onSort={(selectedColumn, sortDirection, sortedRows) => onSortIconClick(selectedColumn, sortDirection, sortedRows)}
            pagination={false}
            sortIcon={sortIcon ? sortIcon : ''}
            customStyles={type === CUSTOM_TABLE_TYPE.NORMAL ? customStylesNormal : customStylesCompact}
            fixedHeader={stickyHeader}
            persistTableHead={true}
            noDataComponent={''}
            selectableRows={selectableRows}
            onSelectedRowsChange={handleRowSelected}
            fixedHeaderScrollHeight={fixedHeaderScrollHeight ? fixedHeaderScrollHeight : '590px'}
            progressComponent={''}
            progressPending={progressPending}
            defaultSortAsc={defaultSortAsc ? defaultSortAsc : false}
            onRowClicked={handleRowClicked}
            responsive={responsive}
            conditionalRowStyles={getConditionalRowStyles()}
            selectableRowSelected={rowSelectCritera}
          />
          <div>
            {progressPending ? (
              <div className={styles.tableLoader}>{progressComponent ? progressComponent : <Loader />}</div>
            ) : (
              <div>
                {data?.length < 1 && (
                  <div className={styles.dataTableEmptyUI}>
                    {typeof noDataComponent === 'string' ? <DataTableEmptyView text={noDataComponent} /> : noDataComponent}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Since we are already having pagination component, we are using our custom pagination*/}
      {pagination && renderPagination()}
    </>
  );
};

CustomDataTable.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['normal', 'compact']),
  //basic columns structure should be like
  // [{id: columnId, name: columnName, selector: (row) => row.columnId}]
  columns: PropTypes.array,
  data: PropTypes.array,
  progressPending: PropTypes.bool,
  onSortIconClick: PropTypes.func, //it will return (selectedColumn, sortDirection, sortedRows)
  currentPage: PropTypes.number,
  totalPageCount: PropTypes.number,
  handleChangePage: PropTypes.func,
  totalRocords: PropTypes.number,
  recordsPerPage: PropTypes.number,
  noDataComponent: PropTypes.any, // We can pass only string with no record message or new ui.
  fixedHeaderScrollHeight: PropTypes.string,
  defaultSortColumn: PropTypes.string,
  paginationTotalRecorsMessage: PropTypes.string,
  paginationRecordsPerPageMessage: PropTypes.string,
  stickyHeader: PropTypes.bool,
  selectableRows: PropTypes.bool,
  defaultSortAsc: PropTypes.bool,
  handleRowSelected: PropTypes.func, //it will return (allSelected, selectedCount, selectedRows)
  sortIcon: PropTypes.any,
  responsive: PropTypes.bool,
  isAdmin: PropTypes.bool,
  isStickyPagination: PropTypes.bool,
  selectedRowId: PropTypes.string,
  rowSelectCritera: PropTypes.func,
  selectedRowIds: PropTypes.array
};

CustomDataTable.defaultProps = {
  id: 'C-table',
  type: 'normal',
  responsive: true,
  isAdmin: false,
  isStickyPagination: false
};
