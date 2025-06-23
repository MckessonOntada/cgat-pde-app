import React from 'react';
import DataTable from 'react-data-table-component';
import styles from './assets/CustomDataTable.module.scss';
import { Divider, Paginate, Loader, IconButton } from '@mckesson/mcp-component-library';
import './assets/DataTableCssOverride.scss';
import { customStylesNormal, customStylesCompact } from './assets/DataTableCutomStyle.js';
import { CUSTOM_TABLE_TYPE } from './assets/constants/CustomTableConstants';
import CommonUtils from '@src/util/CommonUtils';
import TableCardView from './TableCardView';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { ReactComponent as IconArrowRight } from '@src/assets/svg/arrow-right.svg';

export const CustomDataTable = (props) => {
  const {
    id = 'C-table',
    type = 'normal',
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
    responsive = true,
    isAdmin = false,
    isStickyPagination = false,
    selectedRowId,
    rowSelectCritera,
    selectedRowIds,
    showCardView,
    siblingBreakpoint = 'lg',
    expandableRows = null,
    expandableRowDisabled = false,
    expandableRowsComponent = null,
    ...rest
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
    if (totalRocords > recordsPerPage) {
      return (
        <div data-testid={'table-pagination-' + id} className={isStickyPagination ? styles.paginationWrapperSticky : styles.paginationWrapper}>
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
  const renderStepperControls = () => {
    if (CommonUtils.isNonEmptyArray(data) && totalRocords > recordsPerPage) {
      return (
        <div className={styles.stepperControlsWrap}>
          <IconButton
            label={'Pre'}
            size="md"
            iconButton={false}
            textButton={true}
            Icon={IconArrowLeft}
            onClick={(e) => pageChangeEvent(e, currentPage - 1)}
            disabled={currentPage <= 1}
          />
          <IconButton
            label={'Next'}
            size="md"
            iconButton={false}
            iconPosition="right"
            textButton={true}
            Icon={IconArrowRight}
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
        <TableCardView {...props} />
      ) : (
        <div
          className={`${styles.tableContainer} ${getTypeClasses()} ${progressPending || !data || data?.length == 0 ? styles.noDataTable : ''}`}
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
            noDataComponent={noDataComponent}
            selectableRows={selectableRows}
            onSelectedRowsChange={handleRowSelected}
            fixedHeaderScrollHeight={fixedHeaderScrollHeight ? fixedHeaderScrollHeight : '590px'}
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
            expandableRows={expandableRows}
            expandableRowDisabled={expandableRowDisabled}
            expandableRowsComponent={expandableRowsComponent}
            {...rest}
          />
        </div>
      )}

      {pagination && renderPagination()}
      {StepperControls && renderStepperControls()}
    </>
  );
};
