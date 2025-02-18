import React from 'react';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { useTranslate } from '@src/translations/useTranslation';
import useResponsiveView from '@src/hooks/useResponsiveView';
import { Heading } from '@mckesson/mcp-component-library';
import { CustomDataTable } from '@src/components/dataTableComponent';

function ApproverUserList({ data }) {
  const { t } = useTranslate();
  const columns = [
    {
      id: 'approver-list-user-name',
      name: 'Name',
      selector: () => {},
      sortable: true,
      sortKey: 'name',
      showInMobileHeader: true,
      showColumnNameInHeader: true,
      cell: (props) => props.userName
    },
    {
      id: 'updatedOn',
      name: 'Updated On',
      selector: () => {},
      sortable: true,
      sortKey: 'updatedOn',
      cell: (props) => props.updatedOn
    }
  ];
  const showCardView = useResponsiveView();

  const handleOnSort = (selectedColumn, sortDirection) => {};

  return (
    <>
      <Heading as="h3">Approver User List</Heading>

      <CustomDataTable
        id="order-management-order-listing"
        type={'normal'}
        columns={columns}
        data={data}
        onSortIconClick={handleOnSort}
        showCardView={showCardView}
        noDataComponent={
          <EmptyDataTable image={EmptyDataImage} heading={t('captions.emptyTableTitle')} description={t('captions.emptyTableSubtitle')} />
        }
      />
    </>
  );
}

export default ApproverUserList;
