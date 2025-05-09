import React, { useEffect, useState } from 'react';
import CommonFilters from '@src/components/Filters';
import { CustomDataTable } from '@src/components/dataTableComponent';
import { Button, Alert } from '@mckesson/mcp-component-library';
import { ReactComponent as EmptyProviderTable } from '@src/assets/svg/EmptyProviderTable.svg';
import { ReactComponent as ErrorIcon } from '@src/assets/svg/ErrorCircleFilled.svg';
import { useFilters, usePagination, useSelection, useSort, useTable } from '@src/mfe/core-config/manage-providers/context/TableContext';
import { useTranslate } from '@src/translations/useTranslation';
import { Link, useNavigate } from 'react-router-dom';
import SPMaterialDetails from '@src/mfe/order-management/pages/system-configuration/manage-spmaterial/pages/SPMaterialDetails';
import useTimedArray from '@src/mfe/order-management/pages/create/form-segments/summary/useTimedArray';
import { IconButton } from '@mckesson/mcp-component-library';
import { ReactComponent as linkIcon } from '@src/assets/svg/link.svg';
import { renderTableCheckBox } from '@src/components/dataTableComponent/assets/constants/CustomTableConstants';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import TableHeading from '@src/components/tableHeading/TableHeading';
import { renderModal } from '@src/util/ModalUtil';

const ReviewCatalogList = ({ service, sendNotification }) => {
  const { applyFilters, clearFilters } = useFilters();
  const [openSPMaterialDetails, setOpenSPMaterialDetails] = useState(false);
  const [viewSPMaterial, setViewSPMaterial] = useState(null);
  const { pagination, changePage } = usePagination();
  const { t } = useTranslate();
  const { data, refreshTable } = useTable();
  const { applySort } = useSort();
  const { selectedRows, setSelection } = useSelection();
  const { items: notifications, add: addNotification, remove: removeNotification } = useTimedArray(10000);
  const additionalFiltersConfig = React.useMemo(() => {
    return [];
  }, []);

  const handleOnSort = (field, direction) => {
    const { sortKey } = field;
    if (sortKey && direction) {
      applySort(sortKey, direction);
    }
  };

  const columns = [
    {
      id: 'checkbox',
      name: renderTableCheckBox(
        { id: 'ALL_ITEMS_' + pagination.pageNumber },
        data,
        'id',
        pagination,
        [
          ...Array.from(selectedRows).map((val) => ({
            id: val
          }))
        ],
        setSelection
      ),
      sortable: false,
      cell: (row, index) =>
        renderTableCheckBox(
          row,
          data,
          'id',
          pagination,
          [
            ...Array.from(selectedRows).map((val) => ({
              id: val
            }))
          ],

          setSelection
        ),
      width: '50px'
    },
    {
      name: t('manageSPMaterial.table.spproductId'),
      id: 'material_number',
      selector: (row) => {},
      wrap: true,
      minWidth: '220px',
      sortable: true,
      sortKey: 'material_number',
      cell: (props) => (
        <div className="cellEllipse">
          <Link
            style={{
              color: '#007bff',
              fontWeight: '600',
              textDecoration: 'none'
            }}
            onClick={() => {
              setViewSPMaterial(props);
              setOpenSPMaterialDetails(true);
            }}>
            <EclipsesTextcss str={props?.materialNumber} maxWidth={280} />
          </Link>
        </div>
      )
    },
    {
      id: 'genericName',
      name: t('manageSPMaterial.table.productname'),
      selector: (row) => {},
      minWidth: '350px',
      sortable: true,
      sortKey: 'productName',
      wrap: true,
      cell: (props) => <EclipsesTextcss str={props?.productName} maxWidth={350} />
    },
    {
      id: 'ndcNumber',
      name: t('manageSPMaterial.table.ndc'),
      selector: (row) => {},
      minWidth: '250px',
      sortable: false,
      sortKey: 'ndcNumber',
      wrap: true,
      cell: (props) => <EclipsesTextcss str={props?.ndcNumber} maxWidth={250} />
    },
    {
      id: 'accountNumber',
      name: t('table.columns.captions.accountNumber'),
      selector: (row) => {},
      minWidth: '250px',
      sortable: true,
      sortKey: 'accountNumber',
      wrap: true,
      cell: (props) => <EclipsesTextcss str={props?.accountNumber} maxWidth={350} />
    },
    {
      name: 'Action',
      cell: (row) => (
        <IconButton
          label={t('manageSPAccount.providers.column.unlink')}
          size="lg"
          iconButton={false}
          textButton={true}
          Icon={linkIcon}
          onClick={() => {
            handleUnlink(row.id);
          }}
        />
      ),
      width: '150px'
    }
  ];

  const handleUnlinkSPMaterial = async (ids) => {
    try {
      for (const id of ids) {
        await service.unlinkMaterial(id);
      }
      setSelection([]);
      const updatedData = service.getCombinedData();
      refreshTable(updatedData);
      sendNotification({
        type: 'success',
        description: t('SPCatalog.unlink.SPMaterial.success')
      });
    } catch (error) {
      sendNotification({
        type: 'error',
        description: t('SPCatalog.unlink.SPMaterial.error')
      });
    }
  };

  const handleUnlink = (ids, type) => {
    renderModal({
      title: t('messages.header.confirmation'),
      bodyContent: (
        <div className="MCP-modal-body">
          <p>{t('SPCatalog.unlink.SPMaterial.confirmation')}</p>
        </div>
      ),
      footerActions: {
        cancel: {
          label: t('manageSPAccount.button.cancel')
        },
        confirm: {
          label: t('manageSPAccount.button.confirm'),
          action: () => {
            if (type === 'bulk') {
              const allSelectedIds = Array.isArray(ids) ? ids : [ids];
              handleUnlinkSPMaterial(allSelectedIds);
            } else {
              service.unlinkMaterial(ids);
              const updatedData = service.getCombinedData();
              refreshTable(updatedData);
            }
          }
        }
      }
    });
  };

  const handleBulkUnlink = () => {
    const allSelectedIds = Array.from(selectedRows);
    if (allSelectedIds.length > 0) {
      handleUnlink(allSelectedIds, 'bulk');
    }
  };

  return (
    <div className="MCP-module-wrapper">
      <div className="MCP-panel-container">
        <CommonFilters
          onApplyFilters={applyFilters}
          onClearFilters={clearFilters}
          additionalFilters={additionalFiltersConfig}
          searchPlaceholder={t('controls.placeholder.searchSPCatalogPlaceholder')}
        />
      </div>

      <TableHeading
        heading={t('label.sPCatalogListing')}
        secondaryView={selectedRows.size > 0}
        secondaryViewHeading={`${selectedRows.size} ${t('userManagement.selected_items')}`}
        secondaryViewControls={
          <Button variant="secondary" onClick={handleBulkUnlink}>
            {t('manageSPAccount.providers.column.unlink')}
          </Button>
        }
      />

      <CustomDataTable
        id="provider-list-table"
        columns={columns}
        data={data}
        handleChangePage={(_event, pageNumber) => changePage(pageNumber)}
        onSortIconClick={handleOnSort}
        pagination={true}
        currentPage={pagination.pageNumber}
        totalPageCount={pagination.totalPages}
        totalRocords={pagination.totalElements}
        recordsPerPage={pagination.pageSize}
        paginationRecordsPerPageMessage={t('labels.perPage')}
        paginationTotalRecorsMessage={t('labels.results')}
        noDataComponent={
          <ErrorBanner image={<EmptyProviderTable />} heading={t('label.spCatalogDataGrid')} description={t('label.spCatalogDataGridDescription')} />
        }
      />
      <SPMaterialDetails openSPMaterialDetails={openSPMaterialDetails} setOpenSPMaterialDetails={setOpenSPMaterialDetails} viewSPMaterial={viewSPMaterial} />
    </div>
  );
};

export default ReviewCatalogList;

const ErrorBanner = ({ heading, description, image }) => {
  const { isLoading, isError, error } = useTable();
  if (isLoading) {
    return (
      <div className="dashboard-loader">
        <Loader variant="circular" />
      </div>
    );
  }
  let headingContent, descriptionContent, thumbnail;
  if (isError) {
    headingContent = 'Some error has occurred';
    descriptionContent = error.message;
    thumbnail = <ErrorIcon />;
  } else {
    headingContent = heading;
    descriptionContent = description;
    thumbnail = image;
  }
  return (
    <div className="table-notification">
      <div className="MCP-module-wrapper">
        <div className="MCP-module-body">
          {thumbnail}
          <p className="heading">{headingContent}</p>
          <p>{descriptionContent}</p>
        </div>
      </div>
    </div>
  );
};
