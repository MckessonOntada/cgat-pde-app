import { ReactComponent as AddIcon } from '@src/assets/image/add_circle_bold.svg';
import { Button, Heading, Alert } from '@mckesson/mcp-component-library';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '@src/components/module-header';
import CommonFilters from '@src/components/Filters';
import React from 'react';
import { ROUTE_PATH } from './config';
import TableHeading from '@src/components/tableHeading/TableHeading';
import { useFilters, usePagination, useTable } from '@src/context/TableContext';
import useResponsiveView from '@src/hooks/useResponsiveView';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { CustomDataTable } from '@src/components/dataTableComponent';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import CommonUtils from '@src/util/CommonUtils';
import FlatButton from '@src/components/button';
import { useLocation, useNavigate } from 'react-router-dom';

function NotificationList() {
  const { t: translateFn } = useTranslate();
  const [alert, setAlert] = React.useState(null);
  const showCardView = useResponsiveView();
  const location = useLocation();
  const navigate = useNavigate();
  const { data, loading, error, isFilterApplied } = useTable();
  const { changePage, pagination } = usePagination();
  const { applyFilters } = useFilters();
  const breadcrumbItems = [
    {
      label: translateFn('userManagement.breadcrumb.admin'),
      url: '/admin'
    },
    {
      label: translateFn('dashboard.card.notificationGroup.title')
    }
  ];
  const columns = React.useMemo(() => {
    return [
      {
        id: 'group-name',
        name: translateFn('table.column.caption.groupName'),
        wrap: true,
        maxWidth: '320px',
        cell: (props) => (
          <div>
            <EclipsesTextcss str={props.name} maxWidth={310} />
          </div>
        )
      },
      {
        id: 'created-by',
        name: translateFn('table.column.caption.createdBy'),
        wrap: true,
        minWidth: '260px',
        cell: (props) => (
          <div>
            <EclipsesTextcss str={props.createdBy.name} maxWidth={250} />
          </div>
        )
      },
      {
        id: 'created-on',
        name: translateFn('table.column.caption.createdOn'),
        wrap: true,
        maxWidth: '260px',
        cell: (props) => (
          <div>
            <EclipsesTextcss str={CommonUtils.convertDateStringFormat(props.createdAt)} maxWidth={250} />
          </div>
        )
      },
      {
        id: 'action',
        name: translateFn('table.column.caption.action'),
        wrap: true,
        maxWidth: '120px',
        cell: (props) => (
          <FlatButton size="small" style={{ paddingLeft: 0, paddingRight: 0 }} variant="text" onClick={() => navigate(`${props.id}/edit`)}>
            View
          </FlatButton>
        )
      }
    ];
  }, [pagination.pageNo]);

  React.useEffect(() => {
    if (error)
      setAlert({
        type: 'error',
        description: CommonUtils.getAxiosErrorMessage(error)
      });
  }, [error]);

  React.useEffect(() => {
    const { alert = null } = location.state || {};
    if (alert) {
      setAlert(alert);
      navigate(location.pathname, { replace: true });
    }
  }, [location]);

  const handleOnFilter = (filters = {}) => {
    const { searchQuery: query } = filters;
    if (query !== undefined) {
      applyFilters({ query });
    }
  };

  const handleOnClearFilters = () => {
    applyFilters({});
  };

  return (
    <div className="MCP-module-wrapper">
      <div className="MCP-module-header">
        <Breadcrumbs items={breadcrumbItems} />
        <ModuleHeader
          heading={<Heading as="h2">{translateFn('dashboard.card.notificationGroup.title')}</Heading>}
          controls={
            <div className="controls">
              <Button Icon={AddIcon} className="button-icon" variant="primary" size="md" onClick={() => navigate(ROUTE_PATH.CREATE)}>
                {translateFn('userManagement.button.addNewGroup')}
              </Button>
            </div>
          }
        />
      </div>
      <div className="MCP-module-body">
        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
        <div className="MCP-panel-container">
          <div className="stack">
            <div className="MCP-CardContainer">
              <CommonFilters
                autoFocus={true}
                onApplyFilters={handleOnFilter}
                onClearFilters={handleOnClearFilters}
                additionalFilters={[]}
                searchPlaceholder={translateFn('placeholders.searchByGroup')}
              />
            </div>
            <TableHeading heading={translateFn('table.title.notificationGroupListing')} />
            <CustomDataTable
              id={'notification-group-list'}
              type={'normal'}
              columns={columns}
              data={data}
              onSortIconClick={() => {}}
              handleChangePage={(_event, newPageIndex) => changePage(newPageIndex)}
              currentPage={pagination.pageNo}
              totalPageCount={pagination.totalPages}
              totalRocords={pagination.totalElements}
              recordsPerPage={pagination.pageSize}
              paginationTotalRecorsMessage={translateFn('table.pagination.result')}
              paginationRecordsPerPageMessage={translateFn('table.pagination.perPage')}
              stickyHeader
              responsive
              pagination={true}
              showCardView={showCardView}
              defaultExpandedCardView={true}
              noDataComponent={
                <EmptyDataTable
                  isLoading={loading}
                  isError={error}
                  image={EmptyDataImage}
                  heading={
                    isFilterApplied ? translateFn('table.messages.noRecordsFoundWithFilters') : translateFn('emptyTable.title.noRecordsFoundNotificationGroup')
                  }
                  description={!isFilterApplied && translateFn('emptyTable.description.noRecordsFoundNotificationGroup')}
                />
              }
            />
          </div>
        </div>
      </div>
      <div className="MCP-module-footer"></div>
    </div>
  );
}

export default NotificationList;
