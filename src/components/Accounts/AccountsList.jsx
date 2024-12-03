import React, { useEffect, useMemo, useState } from 'react';
import { CustomDataTable, CheckboxGroup, Loader as LoadingComponent } from '@mckesson/mcp-component-library';
import { Link, Loader, redirect } from 'react-router-dom';
import SelectedAccounts from './SelectedAccounts';
import './styles.scss';
import Actions from './Action';
import { useTranslate } from '@src/translations/useTranslation';
import SelectedAccountChips from './SelectedAccountChips';
import EmptyDataTable from '../EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';

const RECORDS_PER_PAGE = 8;

// TODO: Create filter context
export default function AccountsList(props) {
  const {
    selectedRows,
    setSelectedRows,
    onRemoveAccount,
    showSelectedAccounts = false, // This is to show selected accounts in right rail
    selectableRows = true, // To enable or disable row selection
    omitColumns = [], // Pass column ids which you don't want to show in table.
    practiceId,
    userId,
    addNewAccounts,
    isLoading = false
  } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslate();

  return (
    <>
      {/* {true && <Loader type={'screen'} />} */}
      {showSelectedAccounts && (
        <div className="selected-account-chips">
          <SelectedAccountChips selectedAccounts={selectedRows} onRemoveAccount={onRemoveAccount} />
        </div>
      )}
      <div className="account-box">
        <div className="customTable-box">
          {isLoading ? (
            <div className="dashboard-loader">
              <LoadingComponent />
            </div>
          ) : (
            <CustomDataTable
              id="my-data-table"
              type="normal"
              columns={props.columns}
              data={props.data?.content || []} // Use the sliced data for the current page
              currentPage={props.currentPage}
              totalPageCount={props.data?.totalPages}
              pagination={true}
              handleChangePage={props.handleChangePage}
              totalRocords={props.data?.totalElements}
              recordsPerPage={props.recordsPerPage}
              paginationTotalRecorsMessage={t('orgManagement.results')}
              paginationRecordsPerPageMessage={t('orgManagement.per_page')}
              isAdmin={true}
              onSortIconClick={props.handleSort}
              // selectableRows={selectableRows}
              // handleRowSelected={handleRowSelected}
              // selectedRowId={selectedRows}
              noDataComponent={<EmptyDataTable image={EmptyDataImage} heading={t('account.add.label')} description={t('account.empty_table.description')} />}
            />
          )}
        </div>
        {showSelectedAccounts && (
          <div className="selected-account-box">
            <SelectedAccounts selectedAccounts={selectedRows} onRemoveAccount={onRemoveAccount} />
          </div>
        )}
      </div>
    </>
  );
}
