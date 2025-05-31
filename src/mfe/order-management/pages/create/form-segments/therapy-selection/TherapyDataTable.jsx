import React, { useState } from 'react';
import { useTherapy } from '../../../../context/TherapyContext';
import { useTranslate } from '@src/translations/useTranslation';
import { createColumns } from './TherapyDataColumns';
import { useNavigate } from 'react-router-dom';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import useResponsiveView from '@src/hooks/useResponsiveView';
import { CustomDataTable } from '@src/components/dataTableComponent';

const TherapyDataTable = (props) => {
  const { trade, onChange } = props;

  const { t } = useTranslate();
  const { data, paginationConfig, setPageNumber, isFetching, error, applySort } = useTherapy();
  const showCardView = useResponsiveView();

  const [expandedRows, setExpandedRows] = React.useState([]);
  React.useEffect(() => {
    if (trade && trade.isExpandable) {
      setExpandedRows([trade.tradeId]);
    } else setExpandedRows((prevState) => prevState || []);
  }, [trade]);

  React.useEffect(() => {
    if (data && trade && !trade.id) {
      const { tradeName, channelType, ndc } = trade;
      const targetTrade = data.find((item) => item.tradeName === tradeName && item.channelType === channelType);
      const targetTherapy = targetTrade && targetTrade.isExpandable ? targetTrade?.therapies.find((therapy) => therapy.ndc === ndc) : {};
      if (targetTherapy) {
        onChange({
          ...targetTherapy,
          ...targetTrade
        });
      }
    }
  }, [data, trade]);

  const isRowExpanded = (row) => {
    return expandedRows.includes(row.tradeId);
  };
  const onExpandToggle = (tradeId) => {
    setExpandedRows((prev) => (prev.includes(tradeId) ? prev.filter((id) => id !== tradeId) : [...prev, tradeId]));
  };

  const ExpandedComponent = ({ data }) => {
    const expandedData = data.therapies || [];
    const expandedColumns = createColumns({ t, trade, onChange });
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

  const handleOnPageChange = (_event, pageIndex) => {
    setPageNumber(pageIndex);
  };

  const handleOnSort = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey) {
      applySort({
        sortBy: selectedColumn.sortKey,
        sortOrder: sortDirection
      });
    }
  };

  const columns = createColumns({ t, trade, onChange, isRowExpanded, onExpandToggle });

  return (
    <CustomDataTable
      id="order-management-therapy-listing"
      type="normal"
      columns={columns}
      data={data}
      handleChangePage={handleOnPageChange}
      onSortIconClick={handleOnSort}
      pagination
      currentPage={paginationConfig.pageNumber}
      totalPageCount={paginationConfig.totalPages}
      totalRocords={paginationConfig.totalElements}
      recordsPerPage={paginationConfig.pageSize}
      aria-label={t('table.ariaLabel.orderList')}
      paginationRecordsPerPageMessage={t('labels.perPage')}
      paginationTotalRecorsMessage={t('labels.results')}
      showCardView={showCardView}
      defaultExpandedCardView={false}
      expandableRows
      expandableRowExpanded={isRowExpanded}
      expandableRowsComponent={ExpandedComponent}
      expandableRowsHideExpander={true}
      noDataComponent={
        <EmptyDataTable
          isLoading={isFetching}
          error={error?.message}
          image={EmptyDataImage}
          heading={t('table.labels.therapySelectionNoDataAvailable')}
          description={t('table.labels.therapySelectionNoDataAvailableDescription')}
        />
      }
    />
  );
};

export default TherapyDataTable;
