import React, { useEffect, useState } from 'react';
import CommonFilters from '@src/components/Filters';
import EmptyDataTable from '@src/components/EmptyTable';
import { useTranslate } from '@src/translations/useTranslation';
import EclipsesText from '@src/components/EclipsesText/EclipsesText';
import { ReactComponent as View } from '@src/assets/image/view.svg';
import { ReactComponent as CatalogImage } from '@src/assets/image/alert-circle-c.svg';
import { ReactComponent as AccountImage } from '@src/assets/image/alert-circle-a.svg';
import { ReactComponent as MaterialImage } from '@src/assets/image/alert-circle-m.svg';

import { Button, CustomDataTable, Heading, RadioGroup, Badge } from '@mckesson/mcp-component-library';
import FloatingDrawer from '@src/components/floating-drawer';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuestionnaire } from '../context/QuestionnaireContext';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { useMultiCheckBox } from './MultiSelectDatatable';
import CommonUtils from '@src/util/CommonUtils';

function TemplateList() {
  const { t } = useTranslate();
  const location = useLocation();
  const navigate = useNavigate();
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
    refetchTemplates
  } = useQuestionnaire();
  const { renderCheckBox, selectedData, setSelectedData } = useMultiCheckBox(data, paginationConfig, selectedTemplates);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const selectedEntityType = location.state?.value || false;

  useEffect(() => {
    if (!selectedEntityType) {
      setTemplates(selectedData);
      setSelectedData(selectedData);
    } else {
      setSelectedData(selectedTemplates);
    }
  }, [selectedTemplates, setSelectedData, selectedData]);

 

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
      name: data?.length > 0 ? renderCheckBox({ id: 'ALL_ROWS' + paginationConfig.pageNumber }) : null,
      sortable: false,
      cell: (row, index) => renderCheckBox(row, index),
      selector: (row) => row.id,
      width: '50px'
    },
    {
      id: 'templateName',
      name: t('Template Name'),
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
      sortable: true,
      sortKey: 'active',
      minWidth: '160px',
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
            {props.configuredAt.map((item) => {
              if (!item) return null;
              const iconMap = {
                catalog: <CatalogImage />,
                account: <AccountImage />,
                material: <MaterialImage />
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
      cell: (props) => CommonUtils.convertDateStringFormat(props.updatedAt || props.createdAt, 'MM-DD-YYYY')
    },
    {
      id: 'createdBy',
      name: t('table.columns.captions.created_By'),
      selector: (row) => row.createdBy || '',
      sortable: true,
      sortKey: 'created_by',
      minWidth: '160px',
      cell: (props) => {}
    },
    {
      id: 'actions',
      name: t('table.columns.captions.action'),
      minWidth: '160px',
      cell: (props) => (
        <div className="actionsBox">
          <Button Icon={View} variant="tertiary" size="md" className="button-icon" onClick={() => handleView(row.id)}>
            {t('userManagement.table.action.view')}
          </Button>
        </div>
      )
    }
  ];

  const handleOnSelectMaster = (entity) => {
    navigate('map-questionnaire', { state: { value: entity } });
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

      <div className="styledHeading">
        <Heading as="h2">Questionnaire Listing</Heading>
      </div>

      <div>
        {selectedTemplates && selectedTemplates.length > 0 && (
          <div>
            <div className="selected-item-alert row-space-between-center">
              <p className="selected-item-text">{`${selectedTemplates.length} items selected.`}</p>

              <Button onClick={() => setIsDrawerOpen(true)} size="sm" variant="secondary">
                Configure
              </Button>
            </div>
          </div>
        )}
        <CustomDataTable
          id="questionnaire-template-listing"
          columns={columns}
          data={data?.content || []}
          handleChangePage={handleChangePage}
          onSortIconClick={handleOnSortIconClick}
          pagination={true}
          currentPage={paginationConfig.pageNumber}
          totalPageCount={paginationConfig.totalPages}
          totalRocords={paginationConfig.totalElements}
          recordsPerPage={paginationConfig.pageSize}
          paginationRecordsPerPageMessage={t('labels.perPage')}
          paginationTotalRecorsMessage={t('labels.results')}
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
      <FloatingDrawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <SelectMaster onClose={() => setIsDrawerOpen(false)} onSubmit={handleOnSelectMaster} t={t} />
      </FloatingDrawer>
    </div>
  );
}

const SelectMaster = ({ onClose, onSubmit, t }) => {
  const [entity, setEntity] = React.useState('Material');
  const options = [
    {
      isDisabled: false,
      label: t('Material'),
      value: 'Material'
    },
    {
      isDisabled: false,
      label: t('Catalog'),
      value: 'Catalog'
    },
    {
      isDisabled: false,
      label: t('Account'),
      value: 'Account'
    }
  ];
  const handleOnSubmit = () => {
    if (onSubmit) onSubmit(entity);
  };
  return (
    <div className="grail-layout floating-drawer">
      <div className="styled-heading">
        <Heading as="h3">{t('Select Master')}</Heading>
      </div>
      <div className="grow">
        <div className="styled-radio-group">
          <RadioGroup
            caption={t('label.selectContent')}
            direction="column"
            items={options}
            onChangeValue={setEntity}
            radioBtnWidth="auto"
            value={entity}
          />
        </div>
      </div>
      <div className="controls">
        <Button variant="secondary" size="md" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" size="md" onClick={handleOnSubmit}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default TemplateList;
