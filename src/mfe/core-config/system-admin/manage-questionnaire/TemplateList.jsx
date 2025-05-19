import React, { useEffect, useState } from 'react';
import CommonFilters from '@src/components/Filters';
import EmptyDataTable from '@src/components/EmptyTable';
import { useTranslate } from '@src/translations/useTranslation';
import EclipsesText from '@src/components/EclipsesText/EclipsesText';
import { ReactComponent as View } from '@src/assets/image/view.svg';
import { ReactComponent as CatalogImage } from '@src/assets/image/alert-circle-c.svg';
import { ReactComponent as AccountImage } from '@src/assets/image/alert-circle-a.svg';
import { ReactComponent as MaterialImage } from '@src/assets/image/alert-circle-m.svg';
import TableHeading from '@src/components/tableHeading/TableHeading';
import { Button, Heading, RadioGroup, Badge } from '@mckesson/mcp-component-library';
import FloatingDrawer from '@src/components/floating-drawer';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuestionnaire } from './context/QuestionnaireContext';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { useMultiCheckBox } from './useMultiCheckBox';
import useResponsiveView from '@src/hooks/useResponsiveView';
import CommonUtils from '@src/util/CommonUtils';
import { ROUTE_CONFIG } from './constants';
import { CustomDataTable } from '@src/components/dataTableComponent';
import usePermission from '@src/hooks/usePermissions';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import { renderTableCheckBox } from '@src/components/dataTableComponent/assets/constants/CustomTableConstants';

function TemplateList() {
  const { t } = useTranslate();
  const location = useLocation();
  const navigate = useNavigate();
  const showCardView = useResponsiveView();
  const {
    applyFilters,
    clearFilters,
    applySort,
    data,
    isError,
    isLoading,
    paginationConfig,
    selectedTemplates,
    setTemplates,
    setPageNumber,
    refetchTemplates
  } = useQuestionnaire();
  // const { renderCheckBox, selectedData, setSelectedData } = useMultiCheckBox(data, paginationConfig, selectedTemplates, setTemplates);
  const [selectedData, setSelectedData] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const selectedEntityType = location.state?.value || false;
  const isSuccess = location.state?.isSuccess || false;
  const { hasPermission } = usePermission();

  useEffect(() => {
    if (!selectedEntityType) {
      setTemplates(selectedData);
      setSelectedData(selectedData);
    } else {
      setSelectedData(selectedTemplates);
    }
  }, [selectedTemplates, setSelectedData, selectedData]);

  useEffect(() => {
    if (isSuccess) {
      setSelectedData([]);
      setTemplates([]);
    }
    refetchTemplates();
  }, []);

  const handleChangePage = (e, newPage) => {
    setPageNumber(newPage);
  };

  const handleOnSortIconClick = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey) applySort({ sortBy: selectedColumn.sortKey, sortOrder: sortDirection });
  };

  const handleView = (id) => {};

  const columns = [
    {
      id: 'checkbox',
      // name: data?.length > 0 ? renderCheckBox({ id: 'ALL_ROWS' + paginationConfig.pageNumber }) : null,
      name:
        data?.length > 0
          ? renderTableCheckBox({ id: 'ALL_ITEMS_' + paginationConfig.pageNumber }, data, 'id', paginationConfig, selectedData, setSelectedData)
          : null,
      sortable: false,
      cell: (row, index) => renderTableCheckBox(row, data, 'id', paginationConfig, selectedData, setSelectedData),
      selector: (row) => row.id,
      width: '50px',
      omit: !hasPermission(PERMISSIONS_ENUM.SYSTEM_CONFIGURATION.CONFIGURE_QUESTIONNAIRE)
    },
    {
      id: 'templateName',
      name: t('label.templateName'),
      selector: (row) => row.templateName || '',
      sortable: true,
      sortKey: 'template_name',
      minWidth: '160px',
      maxWidth: '270px',
      cell: (props) => {
        return <EclipsesText str={props.templateName || ''} maxLength={260} />;
      }
    },
    {
      id: 'status',
      name: t('table.columns.captions.status'),
      selector: (row) => row.active,
      sortKey: 'active',
      minWidth: '160px',
      wrap: true,
      center: true,
      cell: (props) => (props.active ? <Badge text="Active" type="success" /> : <Badge text="Inactive" type="info-default" />)
    },
    {
      id: 'configuredAt',
      name: t('table.columns.captions.configuredfor'),
      selector: (row) => row.configuredAt,
      sortKey: 'configuredAt',
      minWidth: '160px',
      cell: (props) => {
        return (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {props.configuredAt.map((item, index) => {
              if (!item) return null;
              const iconMap = {
                catalog: <CatalogImage key={index} />,
                account: <AccountImage key={index} />,
                material: <MaterialImage key={index} />
              };
              return iconMap[item.toLowerCase()] || null;
            })}
          </div>
        );
      }
    },
    {
      id: 'createdOn',
      name: t('table.columns.captions.dateCreatedOn'),
      selector: (row) => row.createdOn || '',
      sortable: true,
      sortKey: 'created_at',
      minWidth: '160px',
      cell: (props) => CommonUtils.convertDateStringFormat(props.createdAt, 'MM-DD-YYYY')
    },
    {
      id: 'createdByUserName',
      name: t('table.columns.captions.created_By'),
      selector: (row) => row.createdBy || '',
      sortKey: 'createdByUserName',
      minWidth: '160px',
      cell: (props) => props.createdByUserName || 'NA'
    },
    {
      id: 'actions',
      name: t('table.columns.captions.action'),
      minWidth: '160px',
      wrap: true,
      center: true,
      cell: (props) => (
        <div className="actionsBox">
          <Button Icon={View} variant="tertiary" size="md" className="button-icon" onClick={() => navigate(`${ROUTE_CONFIG.VIEW_QUESTIONNAIRE}/${props.id}`)}>
            {t('userManagement.table.action.view')}
          </Button>
        </div>
      )
    }
  ];

  const handleOnSelectMaster = (entity) => {
    navigate('map-questionnaire', { state: { value: entity, selectedTemplates: selectedTemplates } });
  };

  return (
    <div className="MCP-module-wrapper">
      <div className="MCP-CardContainer">
        <CommonFilters
          onApplyFilters={applyFilters}
          onClearFilters={clearFilters}
          additionalFilters={[]}
          searchPlaceholder={t('controls.placeholder.searchQuestionnaire')}
        />
      </div>

      <div>
        <TableHeading
          heading={t('table.ariaLabel.questionaaireList')}
          secondaryView={selectedTemplates && selectedTemplates.length > 0}
          secondaryViewHeading={`${selectedTemplates.length} ${t('userManagement.selected_items')}`}
          secondaryViewControls={
            <Button onClick={() => setIsDrawerOpen(true)} size="sm" variant="secondary">
              {t('label.configure')}
            </Button>
          }
          style={{ marginBottom: '16px' }}
        />
        <CustomDataTable
          id="questionnaire-template-listing"
          columns={columns}
          data={data || []}
          handleChangePage={handleChangePage}
          onSortIconClick={handleOnSortIconClick}
          pagination={true}
          currentPage={paginationConfig.pageNumber}
          totalPageCount={paginationConfig.totalPages}
          totalRocords={paginationConfig.totalElements}
          recordsPerPage={paginationConfig.pageSize}
          aria-label={t('table.ariaLabel.questionaaireList')}
          paginationRecordsPerPageMessage={t('labels.perPage')}
          paginationTotalRecorsMessage={t('labels.results')}
          showCardView={showCardView}
          noDataComponent={
            <EmptyDataTable
              isLoading={isLoading}
              isError={isError && isError.message}
              image={EmptyDataImage}
              heading={t('captions.questionnaire.emptyTableTitle')}
              description={t('captions.questionnaire.emptyTableSubtitle')}
            />
          }
        />
      </div>
      {isDrawerOpen && <SelectMaster onSubmit={handleOnSelectMaster} t={t} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />}
    </div>
  );
}

const SelectMaster = ({ onClose, onSubmit, t, isDrawerOpen, setIsDrawerOpen }) => {
  const [entity, setEntity] = React.useState('Material');
  const options = [
    {
      isDisabled: false,
      label: t('label.Material'),
      value: 'Material'
    },
    {
      isDisabled: false,
      label: t('label.Catalog'),
      value: 'Catalog'
    },
    {
      isDisabled: false,
      label: t('label.Account'),
      value: 'Account'
    }
  ];
  const handleOnSubmit = () => {
    if (onSubmit) onSubmit(entity);
  };
  return (
    <FloatingDrawer
      anchor="right"
      open={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
      heading={t('label.selectMaster')}
      controls={
        <div className="controls">
          <Button variant="secondary" size="md" onClick={() => setIsDrawerOpen(false)}>
            {t('captions.btnCancel')}
          </Button>
          <Button variant="primary" size="md" onClick={handleOnSubmit}>
            {t('modal.action.continue')}
          </Button>
        </div>
      }>
      <div className="radio-group">
        <RadioGroup caption={t('label.selectContent')} direction="column" items={options} onChangeValue={setEntity} radioBtnWidth="auto" value={entity} />
      </div>
    </FloatingDrawer>
  );
};

export default TemplateList;
