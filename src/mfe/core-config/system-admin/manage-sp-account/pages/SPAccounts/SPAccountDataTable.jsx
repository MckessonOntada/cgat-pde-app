import { useTranslate } from '@src/translations/useTranslation';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CustomDataTable } from '@src/components/dataTableComponent';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { useSPAccountContext } from '../../context/SPAccountContext';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import ModuleHeader from '@src/components/module-header';
import { ReactComponent as add_circle_bold } from '@src/assets/image/add_circle_bold.svg';
import { Heading, Button, Alert, IconButton } from '@mckesson/mcp-component-library';
import { routeConstants } from '../../routes/constants';
import { getAddress } from '@src/mfe/core-config/system-admin/manage-questionnaire/util';
import AuthUtils from '@src/util/AuthUtils';
import { ChannelType } from '../../util';
import AccountDetails from '../../../manage-account/pages/AccountDetails';
import { ReactComponent as linkIcon } from '@src/assets/svg/link.svg';

function SPAccountDataTable({ isLinkedAccount, isSpMaterial, handleUnlinkSpAccounts }) {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { paginationConfig, SPAccountList, setPageNumber, isLoading, applySort, organizationId, fileteredData } = useSPAccountContext();
  const isCustomerCenter = AuthUtils.isCustomerCenter();
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const columns = [
    {
      id: 'accountNumber',
      name: t('table.columns.captions.accountNumber'),
      selector: (row) => row.accountNumber || '',
      maxWidth: '350px',
      cell: (props) =>
        props.channelType === ChannelType.BUY_AND_BILL ? (
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
        ) : (
          <Link to={`${props.id}?orgId=${organizationId}`} className="MCP-table-link" aria-label={t('table.columns.captions.accountNumber')}>
            <EclipsesTextcss str={props.accountNumber} maxWidth={240} />
          </Link>
        ),
      sortable: true,
      sortKey: 'sap_partner'
    },
    {
      id: 'accountName',
      name: t('table.columns.captions.accountName'),
      selector: (row) => row.accountName || '',
      maxWidth: '350px',
      cell: (props) => <EclipsesTextcss str={props.accountName} maxWidth={330} />,
      sortable: true,
      sortKey: 'name_1'
    },
    {
      id: 'address',
      name: t('table.columns.captions.address'),
      selector: (row) => row.address || '',
      maxWidth: '450px',
      cell: (props) => <EclipsesTextcss str={getAddress(props.address)} maxWidth={430} />
    },
    {
      id: 'salesOrg',
      name: t('account.sales_org'),
      selector: (row) => row.salesOrg || '',
      maxWidth: '450px',
      cell: (props) => <EclipsesTextcss str={props.salesOrg} maxWidth={430} />,
      omit: !isLinkedAccount ? true : false
    },
    {
      id: 'distributionChannel',
      name: t('account.distribution'),
      selector: (row) => row.channelType || '',
      maxWidth: '450px',
      cell: (props) => (
        <EclipsesTextcss
          str={props.channelType === ChannelType.BUY_AND_BILL ? t('manageSPAccount.channelType.buynbill') : t('manageSPAccount.channelType.specialtyPharma')}
          maxWidth={430}
        />
      ),
      omit: !isLinkedAccount ? true : false
    },
    {
      id: 'action',
      center: true,
      name: t('manageSPAccount.table.action'),
      isAction: true,
      width: '200px',
      cell: (row) => {
        return (
          <IconButton
            label={t('manageSPAccount.providers.column.unlink')}
            size="lg"
            iconButton={false}
            textButton={true}
            Icon={linkIcon}
            onClick={(row) => {
              handleUnlinkSpAccounts(row.accountNumber);
            }}
          />
        );
      },
      omit: !isSpMaterial
    }
  ];

  const handleChangePage = (e, newPage) => {
    setPageNumber(newPage);
  };

  const handleOnSortIconClick = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey) applySort({ sortBy: selectedColumn.sortKey, sortOrder: sortDirection });
  };

  return (
    <div>
      {!isSpMaterial && (
        <div style={{ marginBottom: '24px', marginTop: '16px' }}>
          <ModuleHeader
            heading={<Heading as="h2">{!isLinkedAccount ? t('manageSPAccount.heading.AccountListing') : t('Account Listing')}</Heading>}
            controls={
              !isCustomerCenter &&
              !isLinkedAccount && (
                <div className="controls">
                  {
                    <Button
                      Icon={add_circle_bold}
                      className="button-icon"
                      variant="primary"
                      size="md"
                      onClick={() => navigate(`${routeConstants.ADD_SPACCOUNT}?orgId=${organizationId}`)}>
                      {t('manageSPAccount.heading.addSPAccount')}
                    </Button>
                  }
                </div>
              )
            }
          />
        </div>
      )}
      <CustomDataTable
        id="my-data-table"
        type="normal"
        columns={columns}
        data={SPAccountList}
        currentPage={paginationConfig.pageNumber}
        totalPageCount={paginationConfig.totalPages}
        pagination={true}
        onSortIconClick={handleOnSortIconClick}
        handleChangePage={handleChangePage}
        totalRocords={paginationConfig.totalElements}
        recordsPerPage={paginationConfig.pageSize}
        paginationTotalRecorsMessage={t('orgManagement.results')}
        paginationRecordsPerPageMessage={t('orgManagement.per_page')}
        noDataComponent={
          <EmptyDataTable
            isLoading={isLoading}
            image={EmptyDataImage}
            heading={!fileteredData ? t('manageSPAccount.table.emptyData') : t('errors.messages.noRecordsFound')}
            description={!fileteredData && !isSpMaterial && t('manageSPAccount.table.emptyDataDescription')}
          />
        }
      />
      <AccountDetails
        openDetails={openDetails}
        setOpenDetails={setOpenDetails}
        viewAccount={selectedDetails}
        setViewAccount={setSelectedDetails}
        isLinkedAccount={isLinkedAccount}
      />
    </div>
  );
}
export default SPAccountDataTable;
