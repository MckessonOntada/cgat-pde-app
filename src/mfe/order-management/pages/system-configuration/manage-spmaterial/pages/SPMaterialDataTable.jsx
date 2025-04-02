import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CustomDataTable, Loader, Alert, Button, Badge, MenuList } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import TableHeading from '@src/components/tableHeading/TableHeading';
import AuthUtils from '@src/util/AuthUtils';
import { renderTableCheckBox } from '@src/components/dataTableComponent/assets/constants/CustomTableConstants';
import { useSPMaterial } from '../context/SPMaterialContext';
import { ReactComponent as IconEllipsis } from '@src/assets/svg/ellipsis.svg';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { routeConstants } from '../routes/constants';
import { renderModal } from '@src/util/ModalUtil';
import { useMutation } from 'react-query';
import SPMaterialDetails from './SPMaterialDetails';

function SPMaterialDataTable(onActionSuccess) {
  const { t } = useTranslate();
  const navigate = useNavigate();

  const { paginationConfig, data, setPageNumber, isLoading, refreshData } = useSPMaterial();
  const [selectedSPMaterials, setSelectedSPMaterials] = useState([]);
  const [openSPMaterialDetails, setOpenSPMaterialDetails] = useState(false);
  const [viewSPMaterial, setViewSPMaterial] = useState(null);
  const isCustomerCenter = AuthUtils.isCustomerCenter();

  const handleDeactivateSPMaterial = async () => {
    //Implement APi CAll
  };

  const handleOnOptionSelection = (value, row) => {
    if (value == 'edit') {
      navigate(`${routeConstants.EDIT_SPMATERIAL}/${row.id}`);
    } else {
      renderModalforDeactivate(row);
    }
  };

  const handleDeactivate = () => {
    renderModalforDeactivate();
  };

  const renderModalforDeactivate = (row) => {
    renderModal({
      title: t('messages.header.confirmation'),
      bodyContent: (
        <div className="MCP-modal-body">
          <p>{t('manageSPMaterial.message.deactivateConfirmaiton')}</p>
        </div>
      ),
      footerActions: {
        cancel: {
          label: t('manageSPMaterial.button.cancel')
        },
        confirm: {
          label: t('manageSPMaterial.button.confirm'),
          action: () => {
            handleDeactivateSPMaterial(row);
          }
        }
      }
    });
  };

  const { mutate } = useMutation({
    mutationFn: handleDeactivateSPMaterial,
    onSuccess: (response) => {
      refreshData();
      const isSuccess = true;
      const message = t('manageSPMaterial.message.deactivate_success');
      onActionSuccess(isSuccess, message);
    },
    onError: (error) => {
      const isSuccess = false;
      const message = t('manageSPMaterial.message.deactivate_failure');
      onActionSuccess(isSuccess, message);
    }
  });

  const columns = [
    {
      id: 'checkbox',
      name: renderTableCheckBox(
        { id: 'ALL_ITEMS_' + paginationConfig.pageNumber },
        data,
        'id',
        paginationConfig,
        selectedSPMaterials,
        setSelectedSPMaterials
      ),
      sortable: false,
      cell: (row, index) => renderTableCheckBox(row, data, 'id', paginationConfig, selectedSPMaterials, setSelectedSPMaterials),
      width: '50px',
      omit: isCustomerCenter
    },
    {
      name: t('manageSPMaterial.table.spproductId'),
      id: 'spProductID',
      selector: (row) => {},
      wrap: true,
      minWidth: '220px',
      sortable: true,
      sortKey: 'spProductID',
      cell: (props) => (
        <div className="cellEllipse">
          <Link
            style={{ color: '#007bff', fontWeight: '600', textDecoration: 'none' }}
            onClick={() => {
              setViewSPMaterial(props);
              setOpenSPMaterialDetails(true);
            }}>
            <EclipsesTextcss str={props?.spProductID} maxWidth={280} />
          </Link>
        </div>
      )
    },
    {
      id: 'productName',
      name: t('manageSPMaterial.table.productname'),
      selector: (row) => {},
      minWidth: '300px',
      sortable: true,
      sortKey: 'productName',
      wrap: true,
      cell: (props) => <EclipsesTextcss str={props?.productName} maxWidth={350} />
    },
    {
      id: 'ndc',
      name: t('manageSPMaterial.table.ndc'),
      selector: (row) => {},
      minWidth: '200px',
      sortable: false,
      sortKey: 'ndc',
      wrap: true,
      cell: (props) => <div>{props?.ndc || '-'}</div>
    },
    {
      id: 'siteName',
      name: t('manageSPMaterial.table.sitename'),
      selector: (row) => {},
      minWidth: '200px',
      sortable: true,
      sortKey: 'siteName',
      wrap: true,
      cell: (props) => <div>{props?.siteName || '-'}</div>
    },
    {
      id: 'status',
      name: t('manageSPMaterial.table.status'),
      selector: (row) => {},
      sortable: true,
      sortKey: 'status',
      wrap: true,
      center: true,
      cell: (props) => (props.status == 'ACTIVE' ? <Badge text="Active" type="success" /> : <Badge text="Inactive" type="info-default" />)
    },
    {
      id: 'action',
      center: true,
      name: t('manageSPMaterial.table.action'),
      cell: (row) => (
        <MenuList
          menuIcon={<IconEllipsis key={'menu-list-spmaterial-table'} />}
          handleSelect={(value) => handleOnOptionSelection(value, row)}
          options={[
            {
              label: t('manageSPMaterial.button.Edit'),
              value: 'edit'
            },
            {
              label: t('manageSPMaterial.button.Deactivate'),
              value: 'deactivate'
            }
          ]}
          isDisabled={selectedSPMaterials.length > 0}
        />
      ),

      omit: isCustomerCenter,
      isAction: true
    }
  ];

  const handleChangePage = (e, newPage) => {
    setPageNumber(newPage);
  };

  return (
    <div>
      <TableHeading
        heading={t('manageSPMaterial.heading.materialListing')}
        secondaryView={selectedSPMaterials?.length}
        secondaryViewHeading={`${selectedSPMaterials?.length} ${t('orgManagement.selected_items')}`}
        secondaryViewControls={
          <Button variant="secondary" onClick={handleDeactivate}>
            {t('manageSPMaterial.button.Deactivate')}
          </Button>
        }
        style={{ marginBottom: '16px' }}
      />

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
          <EmptyDataTable
            image={EmptyDataImage}
            heading={t('manageSPMaterial.messageemptyTableTitle')}
            description={t('manageSPMaterial.messages.emptyTableSubtitle')}
          />
        }
        progressPending={isLoading}
        progressComponent={
          <div
            style={{
              alignItems: 'center',
              border: '1px solid #ccc',
              display: 'flex',
              height: '350px',
              justifyContent: 'center'
            }}>
            <Loader variant="circular" />
          </div>
        }
      />

      <SPMaterialDetails
        openSPMaterialDetails={openSPMaterialDetails}
        setOpenSPMaterialDetails={setOpenSPMaterialDetails}
        viewSPMaterial={viewSPMaterial}
        setViewSPMaterial={setViewSPMaterial}
        showAlert={() => {}}
      />
    </div>
  );
}
export default SPMaterialDataTable;
