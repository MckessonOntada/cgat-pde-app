import React from 'react';
import CommonFilters from '@src/components/Filters';
import EmptyDataTable from '@src/components/EmptyTable';
import { useTranslate } from '@src/translations/useTranslation';
import EclipsesText from '@src/components/EclipsesText/EclipsesText';
import { ReactComponent as ViewIcon } from '@src/assets/svg/eye_open_filled.svg';
import { Button, CustomDataTable, Heading } from '@mckesson/mcp-component-library';

function TemplateList() {
  const { t } = useTranslate();
  const handleOnPageChange = () => {};
  const handleOnSort = () => {};
  const [selectedRows, setSelectedRows] = React.useState([1, 2, 3, 4]);

  const handleOnChange = (state, id) => {
    if (state) {
      selectedRows.push(id);
    } else {
      selectedRows = selectedRows.filter((row) => row !== id);
    }
    setSelectedRows([...selectedRows]);
  };

  const columns = [
    {
      id: 'questionnaire-template-list-item-control',
      name: '',
      selector: () => {},
      sortable: true,
      sortKey: 'id',
      width: '40px',
      cell: (props) => {
        return (
          <CheckboxGroup
            id={`questionnaire-template-list-item-${props.id}`}
            caption=""
            items={[
              {
                onChange: (event) => handleOnChange(event.target.checked, row.id),
                value: props.id,
                isChecked: selectedRows === props.id,
                isDisabled: !props.isActive
              }
            ]}
          />
        );
      }
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
        return <EclipsesText str={props.templateName} maxLength={260} />;
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
  return (
    <div className="MCP-module-wrapper">
      <div className="MCP-CardContainer">
        <CommonFilters
          onApplyFilters={() => {}}
          onClearFilters={() => {}}
          additionalFilters={[]}
          searchPlaceholder={'Search by label, variant type'}
        />
      </div>

      <div className="styledHeading">
        <Heading as="h2">Questionnaire Listing</Heading>
      </div>

      <div>
        {selectedRows && selectedRows.length > 0 && (
          <div>
            <div className="selected-item-alert row-space-between-center">
              <p className="selected-item-text">{`${selectedRows.length} items selected.`}</p>
              <Button size="sm" variant="secondary">
                Configure
              </Button>
            </div>
          </div>
        )}
        <CustomDataTable
          id="questionnaire-template-listing"
          columns={columns}
          data={[]}
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
              isLoading={true}
              //   error={error && error.message}
              //   image={EmptyDataImage}
              heading={t('captions.emptyTableTitle')}
              description={t('captions.emptyTableSubtitle')}
            />
          }
        />
      </div>
    </div>
  );
}

export default TemplateList;
