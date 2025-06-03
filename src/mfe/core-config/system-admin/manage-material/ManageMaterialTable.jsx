import React from 'react';
import { Loader, Button, Tooltip } from '@mckesson/mcp-component-library';
import EmptyDataTable from '@src/components/EmptyTable';
import { useTranslate } from '@src/translations/useTranslation';
import { useManageMaterial } from '@src/mfe/core-config/system-admin/manage-material/context/ManageMaterialContext';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { Link, useNavigate } from 'react-router-dom';
import TherapyDetails from '@src/components/therapyDetails/TherapyDetails';
import { ConfigConstants, MaterialDetailsConstants } from './assets/constants/MaterialConstants';
import ConfigureMaterials from './ConfigureMaterials';
import { CustomDataTable } from '@src/components/dataTableComponent';
import useResponsiveView from '@src/hooks/useResponsiveView';
import TableHeading from '@src/components/tableHeading/TableHeading';
import AuthUtils from '@src/util/AuthUtils';
import { renderTableCheckBox } from '@src/components/dataTableComponent/assets/constants/CustomTableConstants';
import { ReactComponent as ArrowAngleRight } from '@src/assets/svg/arrow-right.svg';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import CommonUtils from '@src/util/CommonUtils';
import TherapyDetailsWithTabs from '@src/components/therapyDetails/TherapyDetailsWithTabs';
import {
  TherapyDetailsConstantsForBB,
  TherapyDetailsConstantsForSP
} from '@src/mfe/order-management/pages/create/form-segments/therapy-selection/assets/constants/TherapyDetailsConstants';

function flattenMaterials(data) {
  if (!data && !Array.isArray(data)) {
    throw new Error('Invalid data provided to flattenMaterials function');
  }

  return data.reduce((acc, item) => {
    if (item.therapies && Array.isArray(item.therapies) && item.therapies.length > 0) {
      item.therapies.forEach((material) => {
        acc.push(material);
      });
    }
    return acc;
  }, []);
}

function ManageMaterialTable({ onSuccess, onError, ...props }) {
  const { t } = useTranslate();
  const { data, paginationConfig, setPageNumber, isFetching, isError, selectedMaterials, setSelectedMaterials } = useManageMaterial();
  const [openDetails, setOpenDetails] = React.useState(false);
  const [openConfiguration, setOpenConfiguration] = React.useState(false);
  const [materialNumber, setMaterialNumber] = React.useState(null);
  const searchParams = new URLSearchParams(location.search);
  const trade = searchParams.get('trade');
  const navigate = useNavigate();
  const showCardView = useResponsiveView();
  const isCustomerCenter = AuthUtils.isCustomerCenter();
  const [expandedRows, setExpandedRows] = React.useState([]);
  const isRowExpanded = (row) => expandedRows.includes(row.tradeName);
  const onExpandToggle = (row) => {
    setExpandedRows((prev) => (prev.includes(row.tradeName) ? prev.filter((name) => name !== row.tradeName) : [...prev, row.tradeName]));
  };

  const getColumns = () => [
    {
      id: 'checkbox',
      name: renderTableCheckBox(
        { id: 'ALL_ITEMS_' + paginationConfig.pageNumber },
        flattenMaterials(data),
        'materialNumber',
        {
          ...paginationConfig,
          totalElements: data.reduce((acc, item) => acc + (item.therapies ? item.therapies.length : 1), 0)
        },
        selectedMaterials,
        setSelectedMaterials
      ),
      cell: (row, index) => {
        if (row.isExpandable && row.therapies.length > 1) {
          const expanded = isRowExpanded?.(row);
          return (
            <div className="expand-icon-wrapper" onClick={() => onExpandToggle?.(row)} aria-label={expanded ? 'Collapse row' : 'Expand row'}>
              <div className={`row-expansion-icon ${expanded ? 'open' : null}`}>
                <ArrowAngleRight />
              </div>
            </div>
          );
        }
        return renderTableCheckBox(
          row,
          flattenMaterials(data),
          'materialNumber',
          {
            ...paginationConfig,
            totalElements: data.reduce((item, acc) => acc + (item.therapies ? item.therapies.length : 1), 0)
          },
          selectedMaterials,
          setSelectedMaterials
        );
      },
      selector: (row) => row['materialNumber'],
      width: '50px',
      showInMobileHeader: true,
      omit: isCustomerCenter
    },
    {
      name: t('labels.therapy'),
      id: 'therapy',
      selector: (row) => row.therapy,
      wrap: true,
      sortable: true,
      sortKey: 'therapy',
      minWidth: '220px',
      cell: (row) => {
        const { tradeName, cellValue } = row;

        return (
          <Link className="MCP-table-link" aria-label={t('table.columns.captions.accountNumber')} to={`?trade=${tradeName}`}>
            <EclipsesTextcss str={tradeName} />
          </Link>
        );
      }
    },
    {
      name: t('labels.ndc'),
      id: 'ndcNumber',
      selector: (row) => row.ndcNumber,
      wrap: true,
      sortable: true,
      sortKey: 'ndc',
      minWidth: '214px',
      cell: ({ isExpandable, ndc }) => {
        let toolTip = '',
          cellValue = '';
        if (isExpandable) {
          toolTip = ndc.join(', ');
          cellValue = CommonUtils.getListOverflowingDisplayLabel(ndc, 2);
        } else {
          toolTip = ndc;
          cellValue = ndc;
        }
        return (
          <span aria-label={t('table.columns.captions.nationalDrugCode')}>
            <Tooltip body={toolTip}>{cellValue}</Tooltip>
          </span>
        );
      }
    },
    {
      name: t('labels.formulation'),
      id: 'formulation',
      selector: (row) => row.strength,
      wrap: true,
      cell: (props) => <div className="cellEllipse">{props?.formulation || '-'}</div>
    },
    {
      name: t('manageMaterial.table.dosage'),
      id: 'dosage',
      selector: (row) => row.dosage,
      wrap: true,
      maxWidth: '140px',
      cell: (row) => {
        let displayCaption = '-';
        if (!row.isExpandable) {
          displayCaption = row.dosage;
        }
        return <span aria-label={t('table.columns.captions.dosage')}>{displayCaption}</span>;
      }
    }
  ];

  const columns = getColumns();

  const handleChangePage = (e, newPage) => {
    setPageNumber(newPage);
  };

  const handleOnClose = () => {
    searchParams.delete('trade');
    searchParams.delete('channelType');
    navigate({
      pathname: '',
      search: searchParams.toString() ? `?${searchParams.toString()}` : ''
    });
  };

  const ExpandedComponent = ({ data }) => {
    if (!CommonUtils.isNonEmptyArray(data.therapies)) return null;
    const expandedData = data.therapies || [];
    const expandedColumns = getColumns();

    return (
      <div className="expanded-rows">
        <CustomDataTable
          data={expandedData}
          columns={expandedColumns}
          noTableHead
          noHeader
          pagination={false}
          showHeader={false}
          hideColumnHeader
          type="expanded"
          striped
        />
      </div>
    );
  };

  return (
    <React.Fragment>
      <TableHeading
        heading={'Material Listing'}
        secondaryView={selectedMaterials?.length}
        secondaryViewHeading={`${selectedMaterials?.length} ${t('manageMaterial.table.header.text')}`}
        secondaryViewControls={
          <Button
            variant="secondary"
            onClick={() => {
              setOpenConfiguration(!openConfiguration);
            }}
            size="sm">
            {t('manageMaterial.table.header.button.configure')}
          </Button>
        }
      />

      <CustomDataTable
        id="manage-material-table"
        type="normal"
        columns={columns}
        data={data || []}
        currentPage={paginationConfig.pageNumber}
        totalPageCount={paginationConfig.totalPages}
        pagination={true}
        totalRocords={paginationConfig.totalElements}
        handleChangePage={handleChangePage}
        recordsPerPage={paginationConfig.pageSize}
        paginationTotalRecorsMessage={t('manageMaterial.table.pagination.totalRecords')}
        paginationRecordsPerPageMessage={t('manageMaterial.table.pagination.perPage')}
        progressPending={isFetching}
        responsive={true}
        showCardView={showCardView}
        defaultExpandedCardView={true}
        expandableRows
        expandableRowExpanded={isRowExpanded}
        expandableRowsComponent={ExpandedComponent}
        expandableRowsHideExpander={true}
        noDataComponent={
          <EmptyDataTable
            isLoading={isFetching}
            error={isError ? t('manageMaterial.table.error') : null}
            image={EmptyDataImage}
            heading={t('manageMaterial.table.emptyData')}
            description={t('manageMaterial.table.emptyDataDescription')}
          />
        }
        progressComponent={
          <div
            style={{
              alignItems: 'center',
              border: '1px solid #ccc',
              display: 'flex',
              height: '350px',
              justifyContent: 'center'
            }}>
            <Loader variant="circular" />
          </div>
        }
      />

      {trade && (
        <TherapyDetailsWithTabs
          trade={trade}
          onSelect={() => {}}
          onClose={handleOnClose}
          buyAndBillTherapyConstants={TherapyDetailsConstantsForBB}
          spTherapyConstants={TherapyDetailsConstantsForSP}
          heading={t('manageMaterial.drawer.heading')}
          showFooter={false}
        />
      )}

      {/* {openDetails && (
        <TherapyDetails
          therapyId={materialNumber}
          therapyData={MaterialDetailsConstants}
          configurationData={ConfigConstants}
          onClose={() => setOpenDetails(!openDetails)}
          showFooter={false}
          isMaterialConfiguration={true}
          useMaterialService={true}
          hasDeleteConfigAccess={!isCustomerCenter}
          heading={t('manageMaterial.drawer.heading')}
          notify={({ type, message }) => {
            if (type === 'success') {
              onSuccess({
                type,
                description: message
              });
            } else {
              onError({
                type,
                description: message
              });
            }
          }}
        />
      )} */}
      {openConfiguration && <ConfigureMaterials onClose={() => setOpenConfiguration(!openConfiguration)} onSuccess={onSuccess} onError={onError} />}
    </React.Fragment>
  );
}

export default ManageMaterialTable;
