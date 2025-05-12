import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader, Badge, Heading, Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import TableHeading from '@src/components/tableHeading/TableHeading';
import { useSPMaterial } from '../context/SPMaterialContext';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import SPMaterialDetails from './SPMaterialDetails';
import { renderTableCheckBox } from '@src/components/dataTableComponent/assets/constants/CustomTableConstants';
import SelectedAccounts from '@src/components/Accounts/SelectedAccounts';
import '../manageSPMaterial.scss';
import ModuleHeader from '@src/components/module-header';
import AuthUtils from '@src/util/AuthUtils';
import { CustomDataTable } from '@src/components/dataTableComponent';

function SPMaterialDataTable({ isLinkCatalog = false }) {
  const { t } = useTranslate();
  const { paginationConfig, data, setPageNumber, isLoading, refreshData, applySort, selectedSPMaterial, setSelectedSPMaterial } = useSPMaterial();
  const [openSPMaterialDetails, setOpenSPMaterialDetails] = useState(false);
  const [viewSPMaterial, setViewSPMaterial] = useState(null);
  const isCustomerCenter = AuthUtils.isCustomerCenter();
  const [tableHeight, setTableHeight] = useState('100%');
  const columns = [
    {
      id: 'checkbox',
      name: renderTableCheckBox({ id: 'ALL_ITEMS_' + paginationConfig.pageNumber }, data, 'id', paginationConfig, selectedSPMaterial, setSelectedSPMaterial),
      sortable: false,
      cell: (row, index) => renderTableCheckBox(row, data, 'id', paginationConfig, selectedSPMaterial, setSelectedSPMaterial),
      width: '50px',
      omit: !isLinkCatalog ? true : false
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
      sortKey: 'material_description',
      wrap: true,
      cell: (props) => <EclipsesTextcss str={props?.materialDescription} maxWidth={350} />
    },
    {
      id: 'ndcNumber',
      name: t('manageSPMaterial.table.ndc'),
      selector: (row) => {},
      minWidth: '250px',
      sortable: false,
      sortKey: 'ndc_number',
      wrap: true,
      cell: (props) => <div>{props?.ndcNumber || '-'}</div>
    },
    {
      id: 'siteName',
      name: t('manageSPMaterial.table.sitename'),
      selector: (row) => {},
      minWidth: '250px',
      sortable: true,
      sortKey: 'site_name',
      wrap: true,
      cell: (props) => <div>{props?.siteName || '-'}</div>,
      omit: isLinkCatalog ? true : false
    },
    {
      id: 'status',
      name: t('manageSPMaterial.table.status'),
      selector: (row) => {},
      sortKey: 'status',
      minWidth: '100px',
      center: true,
      cell: (props) =>
        props.itemStatus === 'A' ? (
          <Badge customStyle={{ minWidth: '120px' }} text="Active" type="success" />
        ) : (
          <Badge customStyle={{ minWidth: '120px' }} text="Inactive" type="info-default" />
        ),
      omit: isLinkCatalog ? true : false
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      let eleHeight = document.getElementById('data-table-sp-material-table')?.offsetHeight;
      setTableHeight(eleHeight);
    }, 100);
  }, [data]);

  const handleChangePage = (e, newPage) => {
    setPageNumber(newPage);
  };

  const handleOnSortIconClick = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey) applySort({ sortBy: selectedColumn.sortKey, sortOrder: sortDirection });
  };

  const onRemoveSelectedSPMaterial = useCallback(
    (item) => {
      const updatedList = selectedSPMaterial.filter((SPMaterial) => SPMaterial.id !== item.id);
      setSelectedSPMaterial(updatedList);
      if (isLinkCatalog) setSelectedSPMaterial(updatedList);
    },
    [selectedSPMaterial, isLinkCatalog, setSelectedSPMaterial]
  );
  const handleSelectAll = () => {
    const merged = [...selectedSPMaterial, ...data.filter((newItem) => !selectedSPMaterial.some((existing) => existing.id === newItem.id))];
    setSelectedSPMaterial(merged);
  };
  const handleClearAll = () => {
    setSelectedSPMaterial([]);
  };

  return (
    <div>
      {isLinkCatalog ? (
        <div style={{ marginBottom: '24px', marginTop: '16px' }}>
          <ModuleHeader
            heading={<Heading as="h2">{t('SPCatalog.SelectSPMaterial')}</Heading>}
            controls={
              !isCustomerCenter && (
                <div className="controls">
                  {
                    <>
                      <Button className="button-icon" textButton size="md" onClick={handleClearAll}>
                        {t('SPCatalog.Material.clearall')}
                      </Button>
                      <Button className="button-icon" variant="secondary" size="md" onClick={handleSelectAll}>
                        {t('SPCatalog.Material.selectall')}
                      </Button>
                    </>
                  }
                </div>
              )
            }
          />
        </div>
      ) : (
        <TableHeading heading={t('manageSPMaterial.heading.materialListing')} style={{ marginBottom: '16px' }} />
      )}
      <div className="accountBox">
        <div className="customTableBox">
          <CustomDataTable
            id="sp-material-table"
            type="normal"
            columns={columns}
            data={data}
            onSortIconClick={handleOnSortIconClick}
            currentPage={paginationConfig.pageNumber}
            totalPageCount={paginationConfig.totalPages}
            pagination={true}
            handleChangePage={handleChangePage}
            totalRocords={paginationConfig.totalElements}
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
        </div>
        {isLinkCatalog && (
          <div className="selectedAccountBox" style={{ height: tableHeight }}>
            <SelectedAccounts
              selectedAccounts={selectedSPMaterial}
              onRemoveAccount={onRemoveSelectedSPMaterial}
              header={t('SPCatalog.SelectedMaterial')}
              isLinkCatalog={true}
            />
          </div>
        )}
      </div>
      <SPMaterialDetails openSPMaterialDetails={openSPMaterialDetails} setOpenSPMaterialDetails={setOpenSPMaterialDetails} viewSPMaterial={viewSPMaterial} />
    </div>
  );
}
export default SPMaterialDataTable;
