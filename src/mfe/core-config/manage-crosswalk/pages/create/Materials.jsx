import React from 'react';
import {
  useFilters,
  usePagination,
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

const getColumns = ({ t, material, setMaterial }) => {
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
  const { data } = useTable();
  const { pagination, changePage } = usePagination();
  const { applyFilters } = useFilters();
  const [materialQuery, setMaterialQuery] = React.useState(null);
  const handleOnChange = (event) => {
    const value = event.target.value;
    if (value !== null || value !== undefined) {
      setMaterialQuery(value);
      applyFilters({
        query: value
      });
    }
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
        />
      </div>
    </React.Fragment>
  );
};

export default Materials;
