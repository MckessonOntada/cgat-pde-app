import React, { useState } from 'react';
import { getColumnsByEntityType } from './tableColumns';
import { useNavigate } from 'react-router-dom';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { useTranslate } from '@src/translations/useTranslation';
import { MasterEntityType } from '../util';
import TherapyDetails from '@src/components/therapyDetails/TherapyDetails';
import { CustomDataTable } from '@src/components/dataTableComponent';
import useResponsiveView from '@src/hooks/useResponsiveView';
import CatalogDetails from '@src/mfe/core-config/system-admin/manage-catalog/pages/CatalogDetails';
import AccountDetails from '@src/mfe/core-config/system-admin/manage-account/pages/AccountDetails';
import { ConfigConstants, MaterialDetailsConstants } from '@src/mfe/core-config/system-admin/manage-material/assets/constants/MaterialConstants';
import { useManagerQuestionnaire } from '@src/mfe/core-config/system-admin/manage-questionnaire/context/ManageQuestionnaireContext';
import { CHANNEL_TYPE } from '@src/mfe/order-management/pages/create/form-segments/Constants';
import SPMaterialDetails from '../../manage-sp-material/pages/SPMaterialDetails';

const EntityDataTable = ({ EntityType, setSelectedRows, showAlert }) => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const showCardView = useResponsiveView();
  const [expandedRows, setExpandedRows] = useState([]);
  const isRowExpanded = (row) => expandedRows.includes(row.tradeName);
  const onExpandToggle = (row) => {
    setExpandedRows((prev) => (prev.includes(row.tradeName) ? prev.filter((name) => name !== row.tradeName) : [...prev, row.tradeName]));
  };

  const { paginationConfig, setCurrentPage, applySort, MaterialData, CatalogData, AccountsData, isLoading, isError } = useManagerQuestionnaire();
  const isMaterial = EntityType == MasterEntityType.Material;
  const isCatalog = EntityType == MasterEntityType.Catalog;
  const isAccount = EntityType == MasterEntityType.Account;
  const entityData = isMaterial && MaterialData ? MaterialData : isCatalog && CatalogData ? CatalogData : isAccount && AccountsData ? AccountsData : [];
  const columns = getColumnsByEntityType(
    t,
    navigate,
    EntityType,
    entityData,
    setSelectedRows,
    setOpenDetails,
    setSelectedDetails,
    isRowExpanded,
    onExpandToggle
  );

  const handleOnPageChange = (_event, pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const handleOnSort = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey) applySort({ sortBy: selectedColumn.sortKey, sortOrder: sortDirection });
  };

  const ExpandedComponent = ({ data }) => {
    const expandedData = data.therapies || [];
    const expandedColumns = getColumnsByEntityType(
      t,
      navigate,
      EntityType,
      entityData,
      setSelectedRows,
      setOpenDetails,
      setSelectedDetails,
      isRowExpanded,
      onExpandToggle
    );

    return (
      <div className="expanded-rows">
        <CustomDataTable
          data={expandedData}
          columns={expandedColumns}
          noTableHead
          noHeader
          pagination={false}
          showHeader={false}
          hideColumnHeader
          type="expanded"
          striped
        />
      </div>
    );
  };

  return (
    <>
      <CustomDataTable
        type={'normal'}
        columns={columns}
        data={entityData || []}
        handleChangePage={handleOnPageChange}
        onSortIconClick={handleOnSort}
        pagination={true}
        currentPage={paginationConfig.pageNumber}
        totalPageCount={paginationConfig.totalPages}
        totalRocords={paginationConfig.totalElements}
        recordsPerPage={paginationConfig.pageSize}
        aria-label={t(isMaterial ? 'table.ariaLabel.materialList' : isCatalog ? 'table.ariaLabel.catalogList' : 'table.ariaLabel.accountList')}
        paginationRecordsPerPageMessage={t('labels.perPage')}
        paginationTotalRecorsMessage={t('labels.results')}
        showCardView={showCardView}
        expandableRows
        expandableRowExpanded={isRowExpanded}
        expandableRowsComponent={ExpandedComponent}
        expandableRowsHideExpander={true}
        noDataComponent={
          <EmptyDataTable
            isLoading={isLoading}
            error={isError && isError.message}
            image={EmptyDataImage}
            heading={t(
              isMaterial
                ? 'captions.questionnaire.material.emptyTableTitle'
                : isCatalog
                ? 'captions.questionnaire.catalog.emptyTableTitle'
                : 'captions.questionnaire.account.emptyTableTitle'
            )}
            description={t(
              isMaterial
                ? 'captions.questionnaire.material.emptyTableSubtitle'
                : isCatalog
                ? 'captions.questionnaire.catalog.emptyTableSubtitle'
                : 'captions.questionnaire.account.emptyTableSubtitle'
            )}
          />
        }
      />
      {openDetails &&
        (isMaterial ? (
          selectedDetails?.channelType === CHANNEL_TYPE.BUY_AND_BILL ? (
            <TherapyDetails
              therapyId={selectedDetails?.materialNumber}
              therapyData={MaterialDetailsConstants}
              configurationData={ConfigConstants}
              onClose={() => setOpenDetails(!openDetails)}
              showFooter={false}
              isMaterialConfiguration={true}
              useMaterialService={true}
              heading={t('manageMaterial.drawer.heading')}
            />
          ) : (
            <SPMaterialDetails openSPMaterialDetails={openDetails} setOpenSPMaterialDetails={setOpenDetails} viewSPMaterial={selectedDetails} />
          )
        ) : isCatalog ? (
          selectedDetails?.channelType === CHANNEL_TYPE.BUY_AND_BILL ? (
            <CatalogDetails
              openCatalogDetails={openDetails}
              setOpenCatalogDetails={setOpenDetails}
              viewCatalog={selectedDetails}
              setViewCatalog={setSelectedDetails}
              showAlert={showAlert}
            />
          ) : (
            <SPMaterialDetails
              openSPMaterialDetails={openDetails}
              setOpenSPMaterialDetails={setOpenDetails}
              viewSPMaterial={selectedDetails}
              isSPCatalog={true}
            />
          )
        ) : isAccount ? (
          <AccountDetails openDetails={openDetails} setOpenDetails={setOpenDetails} viewAccount={selectedDetails} setViewAccount={setSelectedDetails} />
        ) : null)}
    </>
  );
};

export default EntityDataTable;
