import React from 'react';
import {
  useFilters,
  usePagination,
  useSelection,
  useTable
} from '@src/mfe/core-config/manage-providers/context/TableContext';
import { CustomDataTable } from '@src/components/dataTableComponent';
import { useTranslate } from '@src/translations/useTranslation';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { renderTableCheckBox } from '@src/components/dataTableComponent/assets/constants/CustomTableConstants';
import { InputField, Heading, Button } from '@mckesson/mcp-component-library';
import Summary from './Summary';
import style from './style.module.scss';
import CommonUtils from '@src/util/CommonUtils';
import { Link } from 'react-router-dom';

const getColumns = ({ t, pagination, data }) => {
  const { selectedRows, setSelection } = useSelection();
  const alteredSelectedRows = [
    ...Array.from(selectedRows).map((val) => ({
      id: val
    }))
  ];
  return [
    {
      id: 'checkbox',
      name: renderTableCheckBox(
        { id: 'ALL_ITEMS_' + pagination.pageNo },
        data,
        'id',
        pagination,
        alteredSelectedRows,
        setSelection
      ),
      cell: (row, index) =>
        renderTableCheckBox(
          row,
          data,
          'id',
          pagination,
          alteredSelectedRows,
          setSelection
        ),
      selector: (row) => row.materialNumber,
      width: '50px',
      showInMobileHeader: true
    },
    {
      id: 'genericName',
      name: t('manageSPMaterial.table.productname'),
      selector: (row) => {},
      minWidth: '240px',
      sortable: true,
      sortKey: 'material_description',
      wrap: true,
      cell: (props) => (
        <Link to={`?catalog=${props.id}`} className="MCP-table-link">
          {props?.materialDescription}
        </Link>
      )
    },
    {
      id: 'ndcNumber',
      name: t('manageSPMaterial.table.ndc'),
      selector: (row) => {},
      minWidth: '140px',
      sortable: false,
      sortKey: 'ndc_number',
      wrap: true,
      cell: (props) => <div>{props?.ndcNumber || '-'}</div>
    }
  ];
};

const Products = ({ setSelection, selection }) => {
  const { t } = useTranslate();
  const { data } = useTable();
  const { pagination, changePage } = usePagination();
  const [spProductQuery, setSpProductQuery] = React.useState(null);
  const { applyFilters } = useFilters();
  const { selectedRows } = useSelection();
  const handleOnChange = (event) => {
    const value = event.target.value;
    if (value !== null || value !== undefined) {
      setSpProductQuery(value);

      applyFilters({
        query: value
      });
    }
  };

  const handleOnLinkMaterials = () => {
    const materials = data.filter((item) =>
      Array.from(selectedRows).includes(item.id)
    );
    setSelection(materials);
  };
  return (
    <React.Fragment>
      <div className={style['col']}>
        <div className={`MCP-module-body ${style['header']}`}>
          <div className="MCP-CardContainer">
            <InputField
              value={spProductQuery}
              errors={{}}
              id="sp-product-search-field"
              placeholder={'Search by Product Name, NDC'}
              name="spProductQuery"
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
          <Heading as="h3">{t('label.spProductListing')}</Heading>
        </div>
        <div className={`${style['body']}`}>
          <CustomDataTable
            siblingBreakpoint="md"
            totalCount={5}
            id="manage-material-table"
            type="normal"
            columns={getColumns({
              t,
              pagination,
              selectedMaterials: [],
              setSelectedMaterials: () => {},
              data
            })}
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
      </div>
      <div className={`${style['col']} ${style['summary-wrapper']}`}>
        <div className={`MCP-module-body ${style['header']}`}>
          <div></div>
        </div>
        <div className={`MCP-module-body ${style['body']}`}>
          <Summary items={selection} />
          <div className="controls">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleOnLinkMaterials}>
              Link Materials
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Products;
