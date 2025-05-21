import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'react-data-table-component';
import styles from './assets/CustomDataTable.module.scss';
import {
  Divider,
  Dropdown,
  Button,
  Paginate,
  Loader,
  IconButton
} from '@mckesson/mcp-component-library';
import './assets/DataTableCssOverride.scss';
import {
  customStylesNormal,
  customStylesCompact,
  isEqual
} from './assets/DataTableCutomStyle.js';
// import { Paginate, Loader } from '@mckesson/mcp-component-library';
// import { Loader } from '@mckesson/mcp-component-library';
import { CUSTOM_TABLE_TYPE } from './assets/constants/CustomTableConstants';
import DataTableEmptyView from './assets/DataTableEmptyView';
import CommonUtils from '@src/util/CommonUtils';
import CustomCard from './CustomCards';
import { ReactComponent as arrowThickUp } from './assets/svg/arrowThickUp.svg';
import TableCardView from './TableCardView';

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
    StepperControls,
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
    showCardView,
    siblingBreakpoint = 'lg'
  } = props;

  const pageChangeEvent = (e, newPage) => {
    if (!showCardView)
      document.querySelector(`#data-table-${id} > *:first-child`).scrollTop = 0;
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
          className={
            isStickyPagination
              ? styles.paginationWrapperSticky
              : styles.paginationWrapper
          }>
          <div className={styles.d_flex}>
            <div className={styles.totalRecords}>
              {totalRocords} {paginationTotalRecorsMessage}
            </div>
            <Divider
              className={styles.verticalLine}
              orientation="vertical"
              role="presentation"
            />
            <div className={styles.pagination}>
              <Paginate
                currentPage={currentPage}
                totalCount={totalPageCount}
                onPageChange={(e, newPage) => pageChangeEvent(e, newPage)}
                pageSize={recordsPerPage}
              />
            </div>
            <Divider
              className={styles.verticalLine}
              orientation="vertical"
              role="presentation"
            />
            <div className={styles.recordPerPage}>
              {recordsPerPage} {paginationRecordsPerPageMessage}
            </div>
          </div>
        </div>
      );
    }
    if (
      isAdmin &&
      CommonUtils.isNonEmptyArray(data) &&
      totalRocords <= recordsPerPage
    ) {
      return (
        <div className={styles.paginationWrapper}>
          <div className={styles.d_flex}>
            <div className={styles.totalRecords}>
              {totalRocords}{' '}
              {totalRocords == 1
                ? paginationTotalRecorsMessage.slice(0, -1)
                : paginationTotalRecorsMessage}
            </div>
          </div>
        </div>
      );
    }
  };
  const renderStepperControls = () => {
    if (CommonUtils.isNonEmptyArray(data) && totalRocords > recordsPerPage) {
      console.log('currentPage', currentPage);
      console.log('totalPageCount', totalPageCount);
      console.log('recordsPerPage', recordsPerPage);
      return (
        <div className={styles.stepperControlsWrap}>
          <IconButton
            label={'< Pre'}
            size="sm"
            iconButton={false}
            textButton={true}
            Icon={''}
            onClick={(e) => pageChangeEvent(e, currentPage - 1)}
            disabled={currentPage <= 1}
          />
          <IconButton
            label={'Next >'}
            size="sm"
            iconButton={false}
            textButton={true}
            Icon={''}
            onClick={(e) => pageChangeEvent(e, currentPage + 1)}
            disabled={currentPage >= totalPageCount}
          />
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
        when: (row) =>
          selectableRows
            ? !!selectedRowIds?.includes(row.id)
            : row.id === selectedRowId,
        style: {
          backgroundColor: 'var(--brand-color-secondary-active-yellow-2)'
        }
      }
    ];
  };

  return (
    <>
      {showCardView ? (
        <TableCardView {...props} />
      ) : (
        <div
          className={`${styles.tableContainer} ${getTypeClasses()} ${
            progressPending || !data || data?.length == 0
              ? styles.noDataTable
              : ''
          }`}
          id={`data-table-${id}`}>
          <DataTable
            columns={columns}
            data={data}
            defaultSortFieldId={defaultSortColumn}
            sortServer={true}
            onSort={(selectedColumn, sortDirection, sortedRows) =>
              onSortIconClick(selectedColumn, sortDirection, sortedRows)
            }
            pagination={false}
            sortIcon={sortIcon ? sortIcon : ''}
            customStyles={
              type === CUSTOM_TABLE_TYPE.NORMAL
                ? customStylesNormal
                : customStylesCompact
            }
            fixedHeader={stickyHeader}
            persistTableHead={true}
            noDataComponent={noDataComponent}
            selectableRows={selectableRows}
            onSelectedRowsChange={handleRowSelected}
            fixedHeaderScrollHeight={
              fixedHeaderScrollHeight ? fixedHeaderScrollHeight : '590px'
            }
            progressComponent={
              <div className="dataTable-loader">
                <Loader variant="circular" />
              </div>
            }
            progressPending={progressPending}
            defaultSortAsc={defaultSortAsc ? defaultSortAsc : false}
            onRowClicked={handleRowClicked}
            responsive={responsive}
            conditionalRowStyles={getConditionalRowStyles()}
            selectableRowSelected={rowSelectCritera}
            siblingBreakpoint={siblingBreakpoint}
          />
        </div>
      )}

      {/* Since we are already having pagination component, we are using our custom pagination*/}
      {pagination && renderPagination()}
      {StepperControls && renderStepperControls()}
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
  selectedRowIds: PropTypes.array,
  defaultExpandedCardView: PropTypes.bool,
  collapsibleCardView: PropTypes.bool
};

CustomDataTable.defaultProps = {
  id: 'C-table',
  type: 'normal',
  responsive: true,
  isAdmin: false,
  isStickyPagination: false
};
