import { useTranslate } from '@src/translations/useTranslation';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomDataTable } from '@mckesson/mcp-component-library';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { useAccountContext } from '../context/AccountContext';
import AccountDetails from './AccountDetails';
import TableHeading from '@src/components/tableHeading/TableHeading';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { getAddress } from '@src/mfe/core-config/system-admin/manage-questionnaire/util';

function AccountDataTable(props) {
  const { t } = useTranslate();
  const { paginationConfig, AccountList: data, setPageNumber, isLoading } = useAccountContext();
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);

  const columns = [
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
      maxWidth: '350px',
      cell: (props) => <EclipsesTextcss str={props.accountName} maxWidth={240} />
    },
    {
      id: 'address',
      name: t('table.columns.captions.address'),
      selector: (row) => row.accountNumber || '',
      maxWidth: '350px',
      cell: (props) => <EclipsesTextcss str={getAddress(props.address)} maxWidth={240} />
    },
    {
      id: 'salesOrg',
      name: t('labels.salesOrg'),
      selector: (row) => row.salesOrg || '',
      maxWidth: '250px',
      sortable: false,
      cell: (props) => props.salesOrg
    },
    {
      id: 'distributionChannel',
      name: t('labels.distributionChannel'),
      selector: (row) => row.distributionChannel || '',
      maxWidth: '200px',
      sortable: false,
      cell: (props) => props.distributionChannel
    }
  ];

  const handleChangePage = (e, newPage) => {
    setPageNumber(newPage);
  };

  const handleAlertClose = () => {
    setIsAlertVisible(false);
  };

  return (
    <div>
      <TableHeading heading={t('ManageAccount.table.ariaLabel.accountList')} style={{ marginBottom: '16px' }} />

      <CustomDataTable
        id="my-data-table"
        type="normal"
        columns={columns}
        data={data}
        currentPage={paginationConfig.pageNumber}
        totalPageCount={paginationConfig.totalPages}
        pagination={true}
        handleChangePage={handleChangePage}
        totalRocords={paginationConfig.totalElements} // Corrected typo here
        recordsPerPage={paginationConfig.pageSize}
        paginationTotalRecorsMessage={t('orgManagement.results')}
        paginationRecordsPerPageMessage={t('orgManagement.per_page')}
        noDataComponent={
          <EmptyDataTable image={EmptyDataImage} heading={t('ManageAccount.emptyTableTitle')} description={t('ManageAccount.emptyTableSubtitle')} />
        }
      />

      <AccountDetails openDetails={openDetails} setOpenDetails={setOpenDetails} viewAccount={selectedDetails} setViewAccount={setSelectedDetails} />
    </div>
  );
}
export default AccountDataTable;
