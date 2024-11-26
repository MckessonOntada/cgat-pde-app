import React from 'react';
import PropTypes from 'prop-types';
import DataTable from 'react-data-table-component';
import styles from './assets/ExpandableDataTable.module.scss';
import { Divider } from '@mui/material';
import './assets/DataTableCssOverride.scss';
import {
  customStylesNormal,
  customStylesCompact,
  customStylesModal,
  customStylesBorderless
} from './assets/DataTableCutomStyle.js';
import { CUSTOM_TABLE_TYPE } from './assets/constants/CustomTableConstants.js';
import DataTableEmptyView from './assets/DataTableEmptyView.js';
import CommonUtils from '@src/util/CommonUtils.js';
import { Paginate, Loader } from '@mckesson/mcp-component-library';

export const ExpandableDataTable = (props) => {
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
    expandableRows,
    expandableRowDisabled,
    expandableRowsComponent,
    expandableRowsHideExpander,
    noTableHead,
    conditionalRowStyles,
    expandableRowExpanded,
    onRowMouseEnter,
    onRowMouseLeave,
    handleRowDoubleClicked,
    expandableIcon
  } = props;

  const pageChangeEvent = (e, newPage) => {
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
      case CUSTOM_TABLE_TYPE.BORDERLESS:
        classes = styles.typeBorderless;
        break;
      case CUSTOM_TABLE_TYPE.MODAL:
        classes = styles.typeModal;
      default:
        break;
    }
    return classes;
  };

  const getCustomStyles = () => {
    let customStyles;
    switch (type) {
      case CUSTOM_TABLE_TYPE.COMPACT:
        customStyles = customStylesCompact;
        break;
      case CUSTOM_TABLE_TYPE.MODAL:
        customStyles = customStylesModal;
        break;
      case CUSTOM_TABLE_TYPE.NORMAL:
        customStyles = customStylesNormal;
        break;
      case CUSTOM_TABLE_TYPE.BORDERLESS:
        customStyles = customStylesBorderless;
        break;
      default:
        customStyles = customStylesNormal;
        break;
    }
    return customStyles;
  };

  const renderPagination = () => {
    if (CommonUtils.isNonEmptyArray(data) && totalRocords > recordsPerPage) {
      return (
        <div
          data-testid={'table-pagination-' + id}
          className={
            isStickyPagination ? styles.paginationWrapperSticky : styles.paginationWrapper
          }>
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

  return (
    <>
      <div className={`${styles.tableContainer} ${getTypeClasses()}`} id={`data-table-${id}`}>
        <DataTable
          columns={columns}
          data={data}
          defaultSortFieldId={defaultSortColumn}
          sortServer={true}
          onSort={(selectedColumn, sortDirection, sortedRows) => {
            onSortIconClick(selectedColumn, sortDirection, sortedRows);
          }}
          pagination={false}
          sortIcon={sortIcon ? sortIcon : ''}
          customStyles={getCustomStyles()}
          fixedHeader={stickyHeader}
          persistTableHead={true}
          noDataComponent={
            typeof noDataComponent === 'string' ? (
              <DataTableEmptyView text={noDataComponent} />
            ) : (
              noDataComponent
            )
          }
          selectableRows={selectableRows}
          onSelectedRowsChange={handleRowSelected}
          fixedHeaderScrollHeight={fixedHeaderScrollHeight ? fixedHeaderScrollHeight : '590px'}
          progressComponent={progressComponent ? progressComponent : <Loader />}
          progressPending={progressPending}
          defaultSortAsc={defaultSortAsc ? defaultSortAsc : false}
          onRowClicked={handleRowClicked}
          onRowDoubleClicked={handleRowDoubleClicked}
          responsive={responsive}
          expandableRows={expandableRows}
          expandableRowDisabled={expandableRowDisabled}
          expandableRowExpanded={expandableRowExpanded}
          expandableRowsComponent={expandableRowsComponent}
          expandableRowsHideExpander={expandableRowsHideExpander}
          noTableHead={noTableHead}
          conditionalRowStyles={conditionalRowStyles}
          onRowMouseEnter={onRowMouseEnter}
          onRowMouseLeave={onRowMouseLeave}
          expandableIcon={expandableIcon}
        />
      </div>

      {/* Since we are already having pagination component, we are using our custom pagination*/}
      {pagination && renderPagination()}
    </>
  );
};

ExpandableDataTable.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['normal', 'compact', 'borderless', 'modal']),
  //basic columns structure should be like
  // [{id: columnId, name: columnName, selector: (row) => row.columnId}]
  columns: PropTypes.array,
  data: PropTypes.array,
  onSortIconClick: PropTypes.func, //it will return (selectedColumn, sortDirection, sortedRows)
  currentPage: PropTypes.number,
  totalPageCount: PropTypes.number,
  handleChangePage: PropTypes.func,
  totalRocords: PropTypes.number,
  recordsPerPage: PropTypes.number,
  recordsPerPage: PropTypes.number,
  noDataComponent: PropTypes.any, // We can pass only string with no record message or new ui.
  fixedHeaderScrollHeight: PropTypes.any,
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
  expandableRowsHideExpander: PropTypes.bool
};

ExpandableDataTable.defaultProps = {
  id: 'C-table',
  type: 'normal',
  responsive: true,
  isAdmin: false,
  isStickyPagination: false,
  noTableHead: false
};
