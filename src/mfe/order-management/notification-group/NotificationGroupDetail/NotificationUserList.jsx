import React from 'react';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { useTranslate } from '@src/translations/useTranslation';
import { Heading } from '@mckesson/mcp-component-library';
import { CustomDataTable } from '@src/components/dataTableComponent';

function NotificationUserList({ data }) {
  const { t } = useTranslate();
  const columns = [
    {
      id: 'notificationGroup-user-list-name',
      name: t('notificationgroup.userList.name'),
      selector: () => {},
      sortable: false,
      showInMobileHeader: true,
      showColumnNameInHeader: true,
      cell: (props) => props.userName
    },
    {
      id: 'emailAddress',
      name: t('notificationgroup.userList.emailAddress'),
      selector: () => {},
      sortable: false,
      cell: (props) => props.email
    }
  ];

  const handleOnSort = (selectedColumn, sortDirection) => {};

  return (
    <>
      <Heading as="h3">{t('notificationgroup.userList.title')}</Heading>
      <CustomDataTable
        id="notificationGroup-user-list"
        type={'normal'}
        columns={columns}
        data={data}
        onSortIconClick={handleOnSort}
        noDataComponent={<EmptyDataTable image={EmptyDataImage} heading={t('captions.emptyTableTitle')} description={t('captions.emptyTableSubtitle')} />}
      />
    </>
  );
}

export default NotificationUserList;
