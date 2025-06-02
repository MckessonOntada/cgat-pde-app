import React, { useState } from 'react';
import { getColumnsByEntityType } from './TableColumns';
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
import CommonUtils from '@src/util/CommonUtils';

const EntityDataTable = ({ entityType, selectedRows, setSelectedRows, showAlert }) => {
  const { t } = useTranslate();
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const showCardView = useResponsiveView();
  const [expandedRows, setExpandedRows] = useState([]);
  const isRowExpanded = (row) => expandedRows.includes(row.tradeName);
  const onExpandToggle = (row) => {
    setExpandedRows((prev) => (prev.includes(row.tradeName) ? prev.filter((name) => name !== row.tradeName) : [...prev, row.tradeName]));
  };

  const { paginationConfig, setCurrentPage, applySort, MaterialData, CatalogData, AccountsData, isLoading, isError } = useManagerQuestionnaire();
  const [entityData, setEntityData] = React.useState([]);
  const [attributes, setAttributes] = React.useState({});

  React.useEffect(() => {
    if (!entityType) return;

    let data = [];
    const attributes = {};

    switch (entityType) {
      case MasterEntityType.Material: {
        data = MaterialData;
        attributes.noDataComponentHeading = 'captions.questionnaire.material.emptyTableTitle';
        attributes.noDataComponentDescription = 'captions.questionnaire.material.emptyTableSubtitle';
        attributes.tableAriaLabel = 'table.ariaLabel.materialList';
        break;
      }
      case MasterEntityType.Catalog: {
        data = CatalogData;
        attributes.noDataComponentHeading = 'captions.questionnaire.catalog.emptyTableTitle';
        attributes.noDataComponentDescription = 'captions.questionnaire.catalog.emptyTableSubtitle';
        attributes.tableAriaLabel = 'table.ariaLabel.catalogList';
        break;
      }
      case MasterEntityType.Account: {
        data = AccountsData;
        attributes.noDataComponentHeading = 'captions.questionnaire.account.emptyTableTitle';
        attributes.noDataComponentDescription = 'captions.questionnaire.account.emptyTableSubtitle';
        attributes.tableAriaLabel = 'table.ariaLabel.accountList';
        break;
      }
    }
    setEntityData(data || []);
    setAttributes(attributes);
  }, [entityType, MaterialData, CatalogData, AccountsData]);

  const columns = getColumnsByEntityType({
    entityType,
    entityData,
    selectedRows,
    setSelectedRows,
    setOpenDetails,
    setSelectedDetails,
    isRowExpanded,
    onExpandToggle
  });

  const handleOnPageChange = (_event, pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const handleOnSort = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey) applySort({ sortBy: selectedColumn.sortKey, sortOrder: sortDirection });
  };

  const ExpandedComponent = ({ data }) => {
    const expandedData = data.therapies || [];
    if (!CommonUtils.isNonEmptyArray(data.therapies)) return null;

    const expandedColumns = getColumnsByEntityType({
      entityType,
      entityData,
      selectedRows,
      setSelectedRows,
      setOpenDetails,
      setSelectedDetails,
      isRowExpanded,
      onExpandToggle
    });

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

  const renderDetailsComponent = () => {
    if (entityType === MasterEntityType.Material) {
      return selectedDetails?.channelType === CHANNEL_TYPE.BUY_AND_BILL ? (
        <TherapyDetails
          therapyId={selectedDetails?.materialNumber}
          therapyData={MaterialDetailsConstants}
          configurationData={ConfigConstants}
          onClose={() => setOpenDetails(false)}
          showFooter={false}
          isMaterialConfiguration={true}
          useMaterialService={true}
          heading={t('manageMaterial.drawer.heading')}
          notify={({ type, message }) => {
            showAlert(type, message);
          }}
        />
      ) : (
        <SPMaterialDetails openSPMaterialDetails={openDetails} setOpenSPMaterialDetails={setOpenDetails} viewSPMaterial={selectedDetails} />
      );
    }

    if (entityType === MasterEntityType.Catalog) {
      return selectedDetails?.channelType === CHANNEL_TYPE.BUY_AND_BILL ? (
        <CatalogDetails
          openCatalogDetails={openDetails}
          setOpenCatalogDetails={setOpenDetails}
          viewCatalog={selectedDetails}
          setViewCatalog={setSelectedDetails}
          showAlert={showAlert}
        />
      ) : (
        <SPMaterialDetails openSPMaterialDetails={openDetails} setOpenSPMaterialDetails={setOpenDetails} viewSPMaterial={selectedDetails} isSPCatalog={true} />
      );
    }

    if (entityType === MasterEntityType.Account) {
      return <AccountDetails openDetails={openDetails} setOpenDetails={setOpenDetails} viewAccount={selectedDetails} setViewAccount={setSelectedDetails} />;
    }

    return null;
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
        aria-label={t(attributes.tableAriaLabel)}
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
            heading={t(attributes.noDataComponentHeading)}
            description={t(attributes.noDataComponentDescription)}
          />
        }
      />
      {openDetails && renderDetailsComponent()}
    </>
  );
};

export default EntityDataTable;
