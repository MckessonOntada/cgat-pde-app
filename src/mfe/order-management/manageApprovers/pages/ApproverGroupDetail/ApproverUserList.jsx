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
      name: t('approverGroup.userList.name'),
      selector: () => {},
      sortable: true,
      sortKey: 'name',
      showInMobileHeader: true,
      showColumnNameInHeader: true,
      cell: (props) => props.userName
    },
    {
      id: 'emailAddress',
      name: t('approverGroup.userList.emailAddress'),
      selector: () => {},
      sortable: true,
      sortKey: 'email',
      cell: (props) => props.email
    }
  ];

  const handleOnSort = (selectedColumn, sortDirection) => {};

  return (
    <>
      <Heading as="h3">{t('approverGroup.userList.title')}</Heading>
      <CustomDataTable
        id="order-management-order-listing"
        type={'normal'}
        columns={columns}
        data={data}
        onSortIconClick={handleOnSort}
        noDataComponent={<EmptyDataTable image={EmptyDataImage} heading={t('captions.emptyTableTitle')} description={t('captions.emptyTableSubtitle')} />}
      />
    </>
  );
}

export default ApproverUserList;
