import React, { useEffect, useState } from 'react';
import CommonFilters from '@src/components/Filters';
import EmptyDataTable from '@src/components/EmptyTable';
import { useTranslate } from '@src/translations/useTranslation';
import EclipsesText from '@src/components/EclipsesText/EclipsesText';
import { ReactComponent as ViewIcon } from '@src/assets/svg/eye_open_filled.svg';
import { Button, CustomDataTable, Heading, RadioGroup, CheckboxGroup } from '@mckesson/mcp-component-library';
import FloatingDrawer from '@src/components/floating-drawer';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuestionnaire } from '../context/QuestionnaireContext';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { useMultiCheckBox } from './MultiSelectDatatable';

function TemplateList() {
  const { t } = useTranslate();
  const location = useLocation();
  const handleOnPageChange = () => {};
  const handleOnSort = () => {};
  const navigate = useNavigate();
  const { applyFilters, clearFilters, data, isError, isLoading, paginationConfig, selectedTemplates, setTemplates } = useQuestionnaire();
  const { renderCheckBox, selectedData, setSelectedData } = useMultiCheckBox(data, paginationConfig, selectedTemplates);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const selectedEntityType = location.state?.value || false;
  console.log('selectedTemplates', selectedTemplates, selectedTemplates?.length);
  useEffect(() => {
    if (!selectedEntityType) {
      setTemplates(selectedData);
      setSelectedData(selectedData);
    } else {
      setSelectedData(selectedTemplates);
    }
  }, [selectedTemplates, setSelectedData, selectedData]);
  const columns = [
    {
      id: 'checkbox',
      name: data?.length > 0 ? renderCheckBox({ id: 'ALL_ROWS' + paginationConfig.pageNumber }) : null,
      sortable: false,
      cell: (row, index) => renderCheckBox(row, index),
      selector: (row) => row.MRN,
      width: '50px'
    },
    {
      id: 'templateName',
      name: 'Template Name',
      selector: () => {},
      sortable: true,
      sortKey: 'id',
      minWidth: '160px',
      maxWidth: '270px',
      cell: (props) => {
        return <EclipsesText str={props.templateName || ''} maxLength={260} />;
      }
    },
    {
      id: 'status',
      name: 'Status',
      selector: () => {},
      sortable: true,
      sortKey: 'id',
      minWidth: '160px',
      cell: (props) => {}
    },
    {
      id: 'createdOn',
      name: 'Date Created On',
      selector: () => {},
      sortable: true,
      sortKey: 'id',
      minWidth: '160px',
      cell: (props) => {}
    },
    {
      id: 'createdBy',
      name: 'Created By',
      selector: () => {},
      sortable: true,
      sortKey: 'id',
      minWidth: '160px',
      cell: (props) => {}
    },
    {
      id: 'actions',
      name: 'Action',
      selector: () => {},
      sortable: true,
      sortKey: 'id',
      minWidth: '160px',
      cell: (props) => (
        <div className="styled-icon-button error-button">
          <Button icon={ViewIcon} variant="secondary" size="md">
            View
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
          onApplyFilters={() => {}}
          onClearFilters={() => {}}
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
          data={data || []}
          handleChangePage={handleOnPageChange}
          onSortIconClick={handleOnSort}
          pagination={true}
          currentPage={1}
          totalPageCount={100}
          totalRocords={800}
          recordsPerPage={8}
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
