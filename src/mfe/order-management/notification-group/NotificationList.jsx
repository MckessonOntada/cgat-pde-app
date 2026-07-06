import { ReactComponent as AddIcon } from '@src/assets/image/add_circle_bold.svg';
import { Button, Heading, Alert, Badge, CheckboxGroup, Modal } from '@mckesson/mcp-component-library';
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
import { useMutation } from 'react-query';
import { DateUtils } from '@src/util/DateUtil';
import NotificationService from '@src/api/commonService/NotificationService';

function NotificationList() {
  const { t: translateFn } = useTranslate();
  const [alert, setAlert] = React.useState(null);
  const [selectedRows, setSelectedRows] = React.useState(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const showCardView = useResponsiveView();
  const location = useLocation();
  const navigate = useNavigate();
  const { data, loading, error, isFilterApplied, refreshTable } = useTable();
  const { changePage, pagination } = usePagination();
  const { applyFilters, clearFilters } = useFilters();

  const handleActivateDeactivateNotificationGroup = async ({ grpId, actionName }) => {
    if (actionName === translateFn('notificationGroup.button.activate')) {
      return await NotificationService.activateNotificationGroup(grpId);
    } else {
      return await NotificationService.deleteNotificationGroup(grpId);
    }
  };

  const { mutate } = useMutation({
    mutationFn: handleActivateDeactivateNotificationGroup,
    onSuccess: (response, variables) => {
      const { actionName } = variables;
      refreshTable();
      setSelectedRows(null);
      setAlert({
        type: 'success',
        description:
          actionName === translateFn('notificationGroup.button.deactivate')
            ? translateFn('notificationGroup.messages.deactivate_success')
            : translateFn('notificationGroup.messages.activate_success')
      });
    },
    onError: (error, variables) => {
      const { actionName } = variables;
      console.error(`Failed to activate/deactivate notification group:`, error);
      setAlert({
        type: 'error',
        description:
          actionName === translateFn('notificationGroup.button.deactivate')
            ? translateFn('notificationGroup.messages.deactivate_failure')
            : translateFn('notificationGroup.messages.activate_failure')
      });
    }
  });

  const handleActivateDeactivate = () => {
    setIsOpen(true);
  };

  const handleConfirm = (actionName) => {
    setIsOpen(false);
    mutate({ grpId: selectedRows?.id, actionName });
  };

  const handleConfirmCancel = () => {
    setIsOpen(false);
    setSelectedRows(null);
  };
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
        id: 'checkbox',
        name: '',
        showInMobileHeader: true,
        cell: (row) => (
          <CheckboxGroup
            id={'default'}
            caption=""
            items={[
              {
                onChange: (event) => setSelectedRows(event.target.checked ? row : null),
                value: row.id,
                isChecked: selectedRows?.id === row.id
              }
            ]}
          />
        ),
        wrap: true,
        width: '40px'
      },
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
        id: 'status',
        name: translateFn('notificationGroup.table.status'),
        center: true,
        minWidth: '100px',
        cell: (props) => (
          <div>{props.active ? <Badge text="Active" type="success" /> : <Badge text="Inactive" type="info-default" />}</div>
        )
      },
      {
        id: 'action',
        name: translateFn('table.column.caption.action'),
        wrap: true,
        maxWidth: '120px',
        cell: (props) => (
          <FlatButton size="small" style={{ paddingLeft: 0, paddingRight: 0 }} variant="text" onClick={() => navigate(`${props.id}`)}>
            View
          </FlatButton>
        )
      }
    ];
  }, [pagination.pageNo, selectedRows]);

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

  const AdditionalFiltersConfig = React.useMemo(() => {
    return [
      {
        type: 'dropdown',
        name: 'status',
        label: translateFn('notificationGroup.table.status'),
        options: [
          { label: 'All', value: 'all' },
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' }
        ]
      },
      {
        type: 'dateRangePicker',
        name: 'dateRange',
        startDateLabel: translateFn('labels.startDate'),
        endDateLabel: translateFn('labels.endDate')
      }
    ];
  }, []);

  const handleOnFilter = (filters = {}) => {
    const { searchQuery, status, dateRange } = filters;
    const formattedFilters = {};
    if (searchQuery !== undefined) {
      formattedFilters.searchQuery = searchQuery;
    }
    if (status && status !== 'all') {
      formattedFilters.status = [status];
    }
    if (dateRange && dateRange[0]) {
      formattedFilters.startDate = DateUtils.formatDate(dateRange[0], 'dd/mm/yyyy');
    }
    if (dateRange && dateRange[1]) {
      formattedFilters.endDate = DateUtils.formatDate(dateRange[1], 'dd/mm/yyyy');
    }
    applyFilters(formattedFilters);
  };

  const handleOnClearFilters = () => {
    clearFilters();
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
                additionalFilters={AdditionalFiltersConfig}
                searchPlaceholder={translateFn('placeholders.searchByGroup')}
              />
            </div>
            <TableHeading
              heading={translateFn('table.title.notificationGroupListing')}
              secondaryView={!!selectedRows}
              secondaryViewHeading={`1 ${translateFn('notificationGroup.selected_items')}`}
              secondaryViewControls={
                <Button variant="secondary" onClick={handleActivateDeactivate}>
                  {selectedRows?.active ? translateFn('notificationGroup.button.deactivate') : translateFn('notificationGroup.button.activate')}
                </Button>
              }
              style={{ marginBottom: '16px' }}
            />
            <CustomDataTable
              id={'notification-group-list'}
              type={'normal'}
              columns={columns}
              data={data}
              onSortIconClick={() => { }}
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
              progressPending={loading}
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
      <Modal
        {...{
          id: 'xxxs-modal',
          isOpen,
          onClose: () => setIsOpen(false),
          modalTitle: translateFn('notificationGroup.confirmationmessage'),
          modalBody: (
            <div className="MCP-modal-body">
              {selectedRows?.active
                ? translateFn('notificationGroup.confirmationmessage.message')
                : translateFn('notificationGroup.confirmationmessage.activatemessage')}
            </div>
          ),
          modalFooter: (
            <React.Fragment>
              <Button onClick={handleConfirmCancel} variant="secondary" size="md">
                {translateFn('notificationGroup.button.cancel')}
              </Button>
              <Button
                size="md"
                onClick={() =>
                  handleConfirm(
                    selectedRows?.active
                      ? translateFn('notificationGroup.button.deactivate')
                      : translateFn('notificationGroup.button.activate')
                  )
                }>
                {selectedRows?.active
                  ? translateFn('notificationGroup.button.deactivate')
                  : translateFn('notificationGroup.button.activate')}
              </Button>
            </React.Fragment>
          ),
          modalSize: 'xxxs'
        }}
      />
    </div>
  );
}

export default NotificationList;
