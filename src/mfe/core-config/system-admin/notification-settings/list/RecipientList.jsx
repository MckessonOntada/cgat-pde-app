import React, { useMemo } from 'react';
import { CustomDataTable, Button } from '@mckesson/mcp-component-library';
import { TableProvider } from '@src/context/TableContext';
import { useTranslate } from '@src/translations/useTranslation';
import { openModal, closeModal } from '@src/store/reducer/modalReducer';
import { useDispatch } from 'react-redux';
import { createColumns } from './TableColumns';
import CommonUtils from '@src/util/CommonUtils';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import EmptyDataTable from '@src/components/EmptyTable';

const RecipientList = ({ recipients = [], handleOnOptionSelection }) => {
  const dispatch = useDispatch();
  const { t } = useTranslate();

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

  const columns = useMemo(() => createColumns(t, handleOptionSelection), []);

  const defaultFilters = useMemo(
    () => ({
      sortBy: 'fullName'
    }),
    []
  );

  const tableData = useMemo(
    () =>
      recipients.map((recipient) => ({
        ...recipient,
        fullName: CommonUtils.getFullName(recipient)
      })),
    [recipients]
  );

  return (
    <TableProvider defaultFilters={defaultFilters} allowedSort={['fullName', 'updatedDate']}>
      <CustomDataTable
        id="recipient-data-table"
        type="normal"
        columns={columns}
        data={tableData}
        pagination={false}
        noDataComponent={
          <EmptyDataTable isLoading={false} image={EmptyDataImage} heading={'No recipients available'} description={'Please add recipients to see here'} />
        }
      />
    </TableProvider>
  );
};

export default RecipientList;
