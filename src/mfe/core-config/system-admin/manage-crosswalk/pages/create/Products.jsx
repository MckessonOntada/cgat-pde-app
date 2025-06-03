import React from 'react';
import { useFilters, usePagination, useSort, useTable } from '@src/mfe/core-config/admin/manage-providers/context/TableContext';
import { CustomDataTable } from '@src/components/dataTableComponent';
import { useTranslate } from '@src/translations/useTranslation';
import { renderTableCheckBox } from '@src/components/dataTableComponent/assets/constants/CustomTableConstants';
import { InputField, Heading, Tooltip } from '@mckesson/mcp-component-library';
import style from './style.module.scss';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SPMaterialDetails from '@src/mfe/core-config/system-admin/manage-sp-material/pages/SPMaterialDetails';
import { useGenericContext } from '../../config/GenericContext';
import CommonUtils from '@src/util/CommonUtils';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import EmptyDataTable from '@src/components/EmptyTable';
import ServiceUtil from '@src/api/commonService/ServiceUtil';

const getColumns = ({ t }) => {
  const { state, setValue } = useGenericContext();
  const { pagination } = usePagination();
  const { data } = useTable();
  const onSelectProduct = (products) => {
    setValue('selectedProducts', products);
  };

  return [
    {
      id: 'checkbox',
      name: renderTableCheckBox({ id: 'ALL_ITEMS_' + pagination.pageNumber }, data, 'id', pagination, state.selectedProducts || [], onSelectProduct),
      cell: (row, index) => renderTableCheckBox(row, data, 'id', pagination, state.selectedProducts || [], onSelectProduct),
      selector: (row) => row.materialNumber,
      width: '50px',
      showInMobileHeader: true
    },
    {
      id: 'genericName',
      name: t('manageMaterial.table.spProductName'),
      selector: (row) => {},
      minWidth: '240px',
      sortable: true,
      sortKey: 'material_description',
      wrap: true,
      cell: (props) => {
        console.log(props);
        return (
          <Link to={`?catalog=${props.id}`} className="MCP-table-link">
            {props?.materialDescription}
          </Link>
        );
      }
    },
    {
      id: 'ndcNumber',
      name: t('manageMaterial.table.spNDC'),
      selector: (row) => {},
      minWidth: '140px',
      sortable: false,
      wrap: true,
      cell: ({ ndc }) => (
        <span aria-label={t('table.columns.captions.nationalDrugCode')}>
          <Tooltip body={ndc}>{ndc}</Tooltip>
        </span>
      )
    }
  ];
};

const Products = () => {
  const { t } = useTranslate();
  const { data, isLoading, error } = useTable();
  const navigate = useNavigate();
  const { pagination, changePage } = usePagination();
  const { applySort } = useSort();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const catalog = searchParams.get('catalog');
  const [spProductQuery, setSpProductQuery] = React.useState(null);
  const { applyFilters } = useFilters();
  const beautifiedData = ServiceUtil.transformTherapies(data);

  const debouncedApplyFilter = React.useCallback(
    CommonUtils.debounce((value) => {
      applyFilters({
        query: value
      });
    }, 500),
    []
  );

  const handleOnChange = (event) => {
    const value = event.target.value;
    if (value !== null || value !== undefined) {
      setSpProductQuery(value);
      debouncedApplyFilter(value);
    }
  };

  const handleOnDetailsPanelClose = () => {
    const params = new URLSearchParams(location.search);
    params.delete('catalog');

    const newSearch = params.toString();
    navigate(`${location.pathname}${newSearch ? `?${newSearch}` : ''}`, {
      replace: true
    });
  };

  const handleOnSort = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey) applySort({ sortBy: selectedColumn.sortKey, sortOrder: sortDirection });
  };

  console.log(data, beautifiedData);

  return (
    <React.Fragment>
      <div className={style['grid-item']}>
        <div className={`MCP-module-body ${style['header']}`}>
          <div className="MCP-CardContainer">
            <InputField
              value={spProductQuery}
              errors={{}}
              id="sp-product-search-field"
              placeholder={t('crosswalk.product.searchPlaceholder')}
              name="spProductQuery"
              onBlurFn={() => {}}
              onChangeFn={() => {}}
              onInputBlur={() => {}}
              onInputChange={handleOnChange}
              preventCharacters={[]}
              register={() => {}}
              tooltipText={t('crosswalk.product.searchProductTooltip')}
              useRegister={false}
              validationFn={() => {}}
            />
          </div>
          <Heading as="h3">{t('label.spProductListing')}</Heading>
        </div>
      </div>
      <div className={style['grid-item']}>
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
          data={beautifiedData}
          onSortIconClick={handleOnSort}
          currentPage={pagination.pageNo}
          totalPageCount={pagination.totalPages}
          pagination={false}
          StepperControls={true}
          totalRocords={pagination.totalElements}
          handleChangePage={(_event, pageNumber) => changePage(pageNumber)}
          recordsPerPage={pagination.pageSize}
          paginationTotalRecorsMessage={t('manageMaterial.table.pagination.totalRecords')}
          paginationRecordsPerPageMessage={t('manageMaterial.table.pagination.perPage')}
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
        {catalog && (
          <SPMaterialDetails
            openSPMaterialDetails={true}
            setOpenSPMaterialDetails={handleOnDetailsPanelClose}
            viewSPMaterial={beautifiedData.find((item) => item.id == catalog)}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default Products;
