import React from 'react';
import { CustomDataTable } from '@mckesson/mcp-component-library';
import { useManagerQuestionnaire } from '../../context/ManageQuestionnaireContext';
import { getColumnsByEntityType } from './tableColumns';
import { useNavigate } from 'react-router-dom';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { useTranslate } from '@src/translations/useTranslation';
import { MasterEntityType } from '../util';

const EntityDataTable = ({ EntityType, setSelectedRows }) => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { paginationConfig, setCurrentPage, applySort, MaterialData, CatalogData, AccountsData, isLoading, isError } =
    useManagerQuestionnaire();
  const isMaterial = EntityType == MasterEntityType.Material;
  const isCatalog = EntityType == MasterEntityType.Catalog;
  const isAccount = EntityType == MasterEntityType.Account;
  console.log('MaterialData', MaterialData, CatalogData, AccountsData);
  const entityData =
    isMaterial && MaterialData ? MaterialData : isCatalog && CatalogData ? CatalogData : isAccount && AccountsData ? AccountsData : [];
  const columns = getColumnsByEntityType(t, navigate, EntityType, entityData, setSelectedRows);

  const handleOnPageChange = (_event, pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const handleOnSort = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey) applySort({ sortBy: selectedColumn.sortKey, sortOrder: sortDirection });
  };

  return (
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
      aria-label={t(
        isMaterial ? 'table.ariaLabel.materialList' : isCatalog ? 'table.ariaLabel.catalogList' : 'table.ariaLabel.accountList'
      )}
      paginationRecordsPerPageMessage={t('labels.perPage')}
      paginationTotalRecorsMessage={t('labels.results')}
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
  );
};

export default EntityDataTable;
