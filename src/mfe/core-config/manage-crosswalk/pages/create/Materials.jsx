import React from 'react';
import {
  useFilters,
  usePagination,
  useSort,
  useTable
} from '@src/mfe/core-config/manage-providers/context/TableContext';
import {
  RadioGroup,
  InputField,
  Heading
} from '@mckesson/mcp-component-library';
import { CustomDataTable } from '@src/components/dataTableComponent';
import { useTranslate } from '@src/translations/useTranslation';
import { Link } from 'react-router-dom';
import style from './style.module.scss';
import { useGenericContext } from '../../config/GenericContext';
import CommonUtils from '@src/util/CommonUtils';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import EmptyDataTable from '@src/components/EmptyTable';
const getColumns = ({ t }) => {
  const { state, setValue } = useGenericContext();
  return [
    {
      id: 'id',
      selector: () => {},
      width: '40px',
      sortable: false,
      showInMobileHeader: true,
      isSelectable: true,
      cell: (props) => (
        <div className="MCP-table-cell radio-button-wrapper">
          <RadioGroup
            direction="column"
            id={`radio-button-material-${props.id}`}
            items={[
              {
                isDisabled: false,
                label: ' ',
                value: props.id
              }
            ]}
            onChangeValue={() => setValue('material', props)}
            onOtherTextChange={() => {}}
            onSubRadioFieldChange={() => {}}
            radioBtnWidth="auto"
            value={state.material?.id == props.id ? props.id : ''}
          />
        </div>
      )
    },
    {
      name: t('manageMaterial.table.materialDescription'),
      id: 'materialDescription',
      selector: (row) => row.materialDescription,
      wrap: true,
      minWidth: '240px',
      maxWidth: '240px',
      sortable: true,
      sortKey: 'materialDescription',
      cell: (props) => (
        <Link
          to={`?material=${props.materialNumber}`}
          className="MCP-table-link">
          {props?.materialDescription || '-'}
        </Link>
      )
    },
    {
      name: t('manageMaterial.table.nationalDrugCode'),
      id: 'ndcNumber',
      selector: (row) => row.ndcNumber,
      wrap: true,
      sortable: true,
      sortKey: 'ndc',
      minWidth: '140px',
      maxWidth: '140px',
      cell: (props) => (
        <div className="cellEllipse">{props?.ndcNumber || '-'}</div>
      )
    }
  ];
};

const Materials = () => {
  const { t } = useTranslate();
  const { data, error, isLoading } = useTable();
  const { pagination, changePage } = usePagination();
  const { applyFilters } = useFilters();
  const { applySort } = useSort();

  const [materialQuery, setMaterialQuery] = React.useState(null);
  const debouncedApplyFilter = CommonUtils.debounce((value) => {
    applyFilters({
      query: value
    });
  }, 1000);
  const handleOnChange = (event) => {
    const value = event.target.value;
    if (value !== null || value !== undefined) {
      setMaterialQuery(value);
      debouncedApplyFilter(value);
    }
  };
  const handleOnSort = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey)
      applySort({ sortBy: selectedColumn.sortKey, sortOrder: sortDirection });
  };
  return (
    <React.Fragment>
      <div className={style['grid-item']}>
        <div className={`MCP-module-body ${style['header']}`}>
          <div className="MCP-CardContainer">
            <InputField
              value={materialQuery}
              errors={{}}
              placeholder={'Search by Description, NDC'}
              id="material-search-field"
              name="materialQuery"
              onBlurFn={() => {}}
              onChangeFn={() => {}}
              onInputBlur={() => {}}
              onInputChange={handleOnChange}
              preventCharacters={[]}
              register={() => {}}
              tooltipText="Search Material"
              useRegister={false}
              validationFn={() => {}}
            />
          </div>
          <Heading as="h3">{t('label.materialListing')}</Heading>
        </div>
      </div>
      <div className={style['grid-item']}>
        <CustomDataTable
          id="manage-material-table"
          type="normal"
          columns={getColumns({ t })}
          data={data}
          currentPage={pagination.pageNo}
          totalPageCount={pagination.totalPages}
          pagination={true}
          totalRocords={pagination.totalElements}
          onSortIconClick={handleOnSort}
          handleChangePage={(_event, pageNumber) => changePage(pageNumber)}
          recordsPerPage={pagination.pageSize}
          paginationTotalRecorsMessage={t(
            'manageMaterial.table.pagination.totalRecords'
          )}
          paginationRecordsPerPageMessage={t(
            'manageMaterial.table.pagination.perPage'
          )}
          responsive={true}
          showCardView={false}
          defaultExpandedCardView={true}
          noDataComponent={
            <EmptyDataTable
              isLoading={isLoading}
              error={error}
              image={EmptyDataImage}
              heading={t('captions.emptyTableTitle')}
              description={t('captions.emptyTableSubtitle')}
            />
          }
        />
      </div>
    </React.Fragment>
  );
};

export default Materials;
