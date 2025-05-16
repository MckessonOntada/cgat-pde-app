import React, { useState } from 'react';
import { useManagerQuestionnaire } from '../../context/ManageQuestionnaireContext';
import { getColumnsByEntityType } from './tableColumns';
import { useNavigate } from 'react-router-dom';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { useTranslate } from '@src/translations/useTranslation';
import { MasterEntityType } from '../util';
import FloatingDrawer from '@src/components/floating-drawer';
import TherapyDetails from '@src/components/therapyDetails/TherapyDetails';
import { ConfigConstants, MaterialDetailsConstants } from '../../pages/system-configuration/manageMaterial/assets/constants/MaterialConstants';
import { CustomDataTable } from '@src/components/dataTableComponent';
import useResponsiveView from '@src/hooks/useResponsiveView';
import CatalogDetails from '../../pages/system-configuration/manage-catalog/pages/CatalogDetails';
import AccountDetails from '../../pages/system-configuration/manage-account/pages/AccountDetails';
import { CHANNEL_TYPE } from '../../pages/create/form-segments/Constants';
import SPMaterialDetails from '../../pages/system-configuration/manage-spmaterial/pages/SPMaterialDetails';

const EntityDataTable = ({ EntityType, setSelectedRows, showAlert }) => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const showCardView = useResponsiveView();

  const { paginationConfig, setCurrentPage, applySort, MaterialData, CatalogData, AccountsData, isLoading, isError } = useManagerQuestionnaire();
  const isMaterial = EntityType == MasterEntityType.Material;
  const isCatalog = EntityType == MasterEntityType.Catalog;
  const isAccount = EntityType == MasterEntityType.Account;
  const entityData = isMaterial && MaterialData ? MaterialData : isCatalog && CatalogData ? CatalogData : isAccount && AccountsData ? AccountsData : [];
  const columns = getColumnsByEntityType(t, navigate, EntityType, entityData, setSelectedRows, setOpenDetails, setSelectedDetails);

  const handleOnPageChange = (_event, pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const handleOnSort = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey) applySort({ sortBy: selectedColumn.sortKey, sortOrder: sortDirection });
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
          <CatalogDetails
            openCatalogDetails={openDetails}
            setOpenCatalogDetails={setOpenDetails}
            viewCatalog={selectedDetails}
            setViewCatalog={setSelectedDetails}
            showAlert={showAlert}
          />
        ) : isAccount ? (
          <AccountDetails openDetails={openDetails} setOpenDetails={setOpenDetails} viewAccount={selectedDetails} setViewAccount={setSelectedDetails} />
        ) : null)}
    </>
  );
};

export default EntityDataTable;
