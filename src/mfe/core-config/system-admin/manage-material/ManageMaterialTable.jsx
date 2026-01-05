import React from 'react';
import { Loader, Button, Tooltip } from '@mckesson/mcp-component-library';
import EmptyDataTable from '@src/components/EmptyTable';
import { useTranslate } from '@src/translations/useTranslation';
import { useManageMaterial } from '@src/mfe/core-config/system-admin/manage-material/context/ManageMaterialContext';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { Link, useNavigate } from 'react-router-dom';
import ConfigureMaterials from './ConfigureMaterials';
import { CustomDataTable } from '@src/components/dataTableComponent';
import useResponsiveView from '@src/hooks/useResponsiveView';
import TableHeading from '@src/components/tableHeading/TableHeading';
import AuthUtils from '@src/util/AuthUtils';
import { renderTableCheckBox } from '@src/components/dataTableComponent/assets/constants/CustomTableConstants';
import { ReactComponent as ArrowAngleRight } from '@src/assets/svg/arrow-right.svg';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import CommonUtils, { checkIsDataFiltered } from '@src/util/CommonUtils';
import TherapyDetailsWithTabs from '@src/components/therapyDetails/TherapyDetailsWithTabs';
import {
  TherapyDetailsConstantsForBB,
  TherapyDetailsConstantsForSP
} from '@src/mfe/order-management/pages/create/form-segments/therapy-selection/assets/constants/TherapyDetailsConstants';
import { CHANNEL_TYPE } from '@src/mfe/order-management/pages/create/form-segments/Constants';
import OrderQuantityConfig from './OrderQuantityConfig';
import ConfigureSPMaterials from '../manage-sp-material/pages/ConfigureSPMaterials';
import { routeConstants } from './routes/constants';

function ManageMaterialTable({ onSuccess, onError, ...props }) {
  const { t } = useTranslate();
  const { data, paginationConfig, setPageNumber, isFetching, isError, selectedMaterials, setSelectedMaterials, filterConfig, applySort } = useManageMaterial();
  const [openConfiguration, setOpenConfiguration] = React.useState({
    config: false,
    orderQuantityConfig: false
  });
  const [materialNumber, setMaterialNumber] = React.useState(null);
  const searchParams = new URLSearchParams(location.search);
  const trade = searchParams.get('trade');
  const channelType = searchParams.get('channelType');
  const therapy = searchParams.get('therapy');
  const navigate = useNavigate();
  const showCardView = useResponsiveView();
  const isCustomerCenter = AuthUtils.isCustomerCenter();
  const isTreatmentCenterExecutive = AuthUtils.isTreatmentCentreExecutive();
  const disableCheckbox = isCustomerCenter || isTreatmentCenterExecutive;
  const [expandedRows, setExpandedRows] = React.useState([]);
  const isRowExpanded = (row) => expandedRows.includes(row.tradeName);
  const onExpandToggle = (row) => {
    setExpandedRows((prev) => (prev.includes(row.tradeName) ? prev.filter((name) => name !== row.tradeName) : [...prev, row.tradeName]));
  };
  const processedTherapies = CommonUtils.flattenTherapies(data).map((item) => ({
    ...item,
    active: item.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA ? false : true
  }));
  const isDataFiltered = React.useMemo(() => {
    return checkIsDataFiltered(filterConfig);
  }, [filterConfig]);

  const getColumns = () => [
    {
      id: 'checkbox',
      name:
        isCustomerCenter || isTreatmentCenterExecutive ? (
          <input type="checkbox" disabled checked={false} />
        ) : (
          renderTableCheckBox(
            { id: 'ALL_ITEMS_' + paginationConfig.pageNumber },
            processedTherapies,
            'materialNumber',
            {
              ...paginationConfig,
              totalElements: data.reduce((acc, item) => acc + (item.therapies ? item.therapies.length : 1), 0)
            },
            selectedMaterials,
            setSelectedMaterials
          )
        ),
      cell: (row, index) => {
        const processedRow = row.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA ? { ...row, active: false } : { ...row, active: true };
        processedTherapies;
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
        if (row.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA || disableCheckbox) {
          return <input type="checkbox" disabled checked={false} />;
        }
        return renderTableCheckBox(
          processedRow,
          processedTherapies,
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
      showInMobileHeader: true
      //  omit: isCustomerCenter || isTreatmentCenterExecutive
    },
    {
      name: t('labels.therapy'),
      id: 'trade_name',
      selector: (row) => row.therapy,
      wrap: true,
      sortable: true,
      sortKey: 'trade_name',
      minWidth: '220px',
      cell: (row) => {
        const { tradeName, channelType, cellValue, id, isParent } = row;
        const searchParams = new URLSearchParams({
          trade: tradeName,
          channelType
        });
        if (!isParent) {
          const therapyParam = id ? id : tradeName;
          searchParams.set('therapy', therapyParam);
        }
        return (
          <Link className="MCP-table-link" aria-label={t('table.columns.captions.accountNumber')} to={`?${searchParams.toString()}`}>
            <EclipsesTextcss str={cellValue} />
          </Link>
        );
      }
    },

    {
      name: t('labels.genericName'),
      id: 'genericName',
      selector: (row) => row.genericName,
      wrap: true,
      sortable: false,
      minWidth: '214px',
      cell: ({ isExpandable, genericName }) => {
        let toolTip = '',
          cellValue = '';
        if (isExpandable) {
          toolTip = genericName?.join('/ ');
          cellValue = CommonUtils.getListOverflowingDisplayLabel(genericName, 2, ' / ');
        } else {
          toolTip = genericName;
          cellValue = genericName;
        }
        return (
          <span aria-label={t('table.columns.captions.nationalDrugCode')}>
            <Tooltip body={toolTip}>
              <span>{cellValue}</span>
            </Tooltip>
          </span>
        );
      }
    },
    {
      name: t('labels.ndc'),
      id: 'ndcNumber',
      selector: (row) => row.ndcNumber,
      wrap: true,
      sortable: false,
      minWidth: '214px',
      cell: ({ isExpandable, ndc }) => {
        let toolTip = '',
          cellValue = '';
        if (isExpandable) {
          toolTip = ndc.join(', ');
          cellValue = t('labels.multiple');
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
      name: t('labels.manufacturer'),
      id: 'manufacturerName',
      selector: (row) => row.manufacturerName,
      wrap: true,
      sortable: false,
      minWidth: '224px',
      cell: (props) => {
        const { isExpandable, manufacturer, manufacturerName, channelType } = props;

        if (channelType === CHANNEL_TYPE.BUY_AND_BILL) {
          let toolTip = '',
            cellValue = '';
          if (isExpandable) {
            toolTip = manufacturer?.join(' / ');
            cellValue = CommonUtils.getListOverflowingDisplayLabel(manufacturer, 2, ' / ');
          } else {
            toolTip = manufacturerName;
            cellValue = manufacturerName;
          }
          return (
            <span aria-label={t('table.columns.captions.manufacturerName')}>
              <Tooltip body={toolTip}>
                <span>{cellValue}</span>
              </Tooltip>
            </span>
          );
        } else {
          return <div className="cellEllipse">{manufacturerName || '-'}</div>;
        }
      }
    },
    {
      name: t('labels.productForm'),
      id: 'formulation',
      selector: (row) => row.strength,
      wrap: true,
      cell: (props) => <div className="cellEllipse">{props.channelType === CHANNEL_TYPE.BUY_AND_BILL ? props.productForm || '-' : '-'}</div>
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
  const isSPSelected = selectedMaterials?.every((item) => item.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA);
  const isBothSelected =
    selectedMaterials?.some((item) => item.channelType === CHANNEL_TYPE.BUY_AND_BILL) &&
    selectedMaterials?.some((item) => item.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA);

  const handleChangePage = (e, newPage) => {
    setPageNumber(newPage);
  };

  const handleOnClose = () => {
    searchParams.delete('trade');
    searchParams.delete('channelType');
    searchParams.delete('therapy');
    navigate({
      pathname: '',
      search: searchParams.toString() ? `?${searchParams.toString()}` : ''
    });
  };

  const handleOnSort = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey) {
      applySort({
        sortBy: selectedColumn.sortKey,
        sortOrder: sortDirection
      });
    }
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

  const handleConfiguration = (selectedMaterial) => {
    if (selectedMaterial && Array.isArray(selectedMaterial))
      navigate(routeConstants.CONFIGURE, {
        state: { therapy: selectedMaterial, materialType: CHANNEL_TYPE.BUY_AND_BILL }
      });
  };
  return (
    <React.Fragment>
      <TableHeading
        heading={'Material Listing'}
        secondaryView={selectedMaterials?.length}
        secondaryViewHeading={`${selectedMaterials?.length} ${t('manageMaterial.table.header.text')}`}
        secondaryViewControls={
          <div className="controls">
            <Button
              variant="secondary"
              onClick={() => {
                setOpenConfiguration((prev) => ({
                  ...prev,
                  orderQuantityConfig: !prev.orderQuantityConfig
                }));
              }}
              size="sm">
              {t('manageMaterial.table.header.button.OrderQuantity')}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                // setOpenConfiguration((prev) => ({ ...prev, config: !prev.config }));
                handleConfiguration(selectedMaterials);
              }}
              size="sm"
              disabled={isBothSelected || isSPSelected}>
              {t('manageMaterial.table.header.button.configure')}
            </Button>
          </div>
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
        onSortIconClick={handleOnSort}
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
            heading={isDataFiltered ? t('errors.messages.noRecordsFound') : t('manageMaterial.table.emptyData')}
            description={!isDataFiltered && t('manageMaterial.table.emptyDataDescription')}
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
          channelType={channelType}
          therapy={therapy || trade}
          isMaterialListing={true}
          onSelect={() => {}}
          onClose={handleOnClose}
          buyAndBillTherapyConstants={TherapyDetailsConstantsForBB(false)}
          spTherapyConstants={TherapyDetailsConstantsForSP}
          heading={t('manageMaterial.drawer.details.heading')}
          showFooter={false}
        />
      )}
      {openConfiguration.config && (
        <ConfigureMaterials onClose={() => setOpenConfiguration((prev) => ({ ...prev, config: false }))} onSuccess={onSuccess} onError={onError} />
      )}
      {openConfiguration.orderQuantityConfig && (
        <OrderQuantityConfig
          onClose={() => setOpenConfiguration((prev) => ({ ...prev, orderQuantityConfig: false }))}
          onSuccess={onSuccess}
          onError={onError}
        />
      )}
    </React.Fragment>
  );
}

export default ManageMaterialTable;
