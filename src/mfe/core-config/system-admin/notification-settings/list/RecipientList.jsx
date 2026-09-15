import React, { useMemo } from 'react';
import { CustomDataTable, Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { openModal, closeModal } from '@src/store/reducer/modalReducer';
import { useDispatch } from 'react-redux';
import { createColumns } from './TableColumns';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import EmptyDataTable from '@src/components/EmptyTable';
import { useRecipientList } from '../context/RecipientListContext';

const RecipientList = ({ handleOnOptionSelection, isActionsDisabled = false }) => {
  const dispatch = useDispatch();
  const { t } = useTranslate();
  const { pagedData, paginationConfig, totalElements, totalPages, handleSort, handleChangePage } = useRecipientList();

  const confirmOnDelete = (row) => {
    const onDelete = () => {
      handleOnOptionSelection('delete', row);
      dispatch(closeModal());
    };

    const state = {
      title: t('recipients.delete.title'),
      body: (
        <div className="MCP-modal-body">
          <p>{t('recipients.delete.confirmation')}</p>
        </div>
      ),
      footer: (
        <div className="controls">
          <Button size="md" variant="secondary" onClick={() => dispatch(closeModal())}>
            {t('button.caption.no')}
          </Button>
          <Button size="md" variant="primary" onClick={onDelete}>
            {t('button.caption.yes')}
          </Button>
        </div>
      )
    };

    dispatch(openModal(state));
  };

  const handleOptionSelection = (value, row) => {
    if (value === 'delete') {
      confirmOnDelete(row);
      return;
    }

    handleOnOptionSelection(value, row);
  };

  const columns = useMemo(() => createColumns(t, handleOptionSelection, isActionsDisabled), [isActionsDisabled]);

  const conditionalRowStyles = useMemo(() => (isActionsDisabled ? [{ when: () => true, style: { backgroundColor: '#FBFBFA' } }] : []), [isActionsDisabled]);

  return (
    <CustomDataTable
      id="recipient-data-table"
      type="normal"
      columns={columns}
      data={pagedData}
      pagination={true}
      currentPage={paginationConfig.pageNumber}
      totalPageCount={totalPages}
      totalRocords={totalElements}
      recordsPerPage={paginationConfig.pageSize}
      handleChangePage={handleChangePage}
      onSortIconClick={handleSort}
      conditionalRowStyles={conditionalRowStyles}
      paginationTotalRecorsMessage={t('orgManagement.results')}
      paginationRecordsPerPageMessage={t('orgManagement.per_page')}
      noDataComponent={
        <EmptyDataTable isLoading={false} image={EmptyDataImage} heading={'No recipients available'} description={'Please add recipients to see here'} />
      }
    />
  );
};

export default RecipientList;
