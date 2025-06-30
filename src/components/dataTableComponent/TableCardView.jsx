import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'react-data-table-component';
import styles from './assets/CustomDataTable.module.scss';
import { Divider, Dropdown, Button, Paginate, Loader } from '@mckesson/mcp-component-library';
import './assets/DataTableCssOverride.scss';
import { customStylesNormal, customStylesCompact, isEqual } from './assets/DataTableCutomStyle.js';
// import { Paginate, Loader } from '@mckesson/mcp-component-library';
// import { Loader } from '@mckesson/mcp-component-library';
import { CUSTOM_TABLE_TYPE } from './assets/constants/CustomTableConstants';
import DataTableEmptyView from './assets/DataTableEmptyView';
import CommonUtils from '@src/util/CommonUtils';
import CustomCard from './CustomCards';
import { ReactComponent as arrowThickUp } from './assets/svg/arrowThickUp.svg';

function TableCardView(props) {
  const {
    columns,
    data,
    onSortIconClick,
    noDataComponent,
    defaultSortColumn,
    sortIcon,
    progressPending,
    progressComponent,
    defaultExpandedCardView,
    collapsibleCardView,
    isMultipleRowSelect = false,
    selectedData = [],
    setSelectedData,
    nestedCardViewKey
  } = props;

  const [tableSortKey, setTableSortKey] = useState(defaultSortColumn || '');
  const [sortOrder, setSortOrder] = useState('asc');
  const [subCardExpandable, setSubCardExpandable] = useState(false);

  const selectedAll = useMemo(() => data.every((record) => selectedData.some((selected) => isEqual(selected, record))), [data, selectedData]);

  const handleSelectAll = () => {
    if (selectedAll) {
      // Deselect all records of the current page
      setSelectedData((prev) => prev.filter((record) => !data.some((pageRecord) => isEqual(pageRecord, record))));
    } else {
      // Select all records of the current page
      setSelectedData((prev) => [...prev, ...data.filter((record) => !prev.some((selected) => isEqual(selected, record)))]);
    }
  };

  const renderCardSort = () => {
    const sortableColumns = columns.filter((col) => col.sortable).map((col) => ({ value: col.name, label: col.name }));
    return (
      <div className={styles.actionsBar}>
        {isMultipleRowSelect && (
          <div onClick={handleSelectAll} className={styles.selectAllText}>
            {selectedAll ? 'DESELECT ALL' : 'SELECT ALL'}
          </div>
        )}
        <div className={styles.sortByContainer}>
          <span className={styles.sortByText}>Sort by:</span>
          <div className={styles.dropdownContainer}>
            <Dropdown
              size="lg"
              value={tableSortKey}
              options={sortableColumns}
              onChange={(val) => {
                setTableSortKey(val);
                onSortIconClick(
                  columns.find((col) => col.name === val),
                  sortOrder,
                  data
                );
              }}
            />
          </div>
          <Button
            size="md"
            disabled={!tableSortKey}
            iconButton={true}
            className={sortOrder === 'asc' ? styles.cardSortIconButton : styles.cardSortIconButtonRotated}
            variant="secondary"
            Icon={!!sortIcon ? sortIcon : arrowThickUp}
            onClick={() => {
              setSortOrder((prevSort) => (prevSort === 'asc' ? 'desc' : 'asc'));
              onSortIconClick(
                columns.find((col) => col.name === tableSortKey),
                sortOrder === 'asc' ? 'desc' : 'asc',
                data
              );
            }}
          />
        </div>
      </div>
    );
  };

  const renderEmptyDataComponent = () => (
    <div>
      {progressPending ? (
        <div className={styles.tableLoader}>{progressComponent ? progressComponent : <Loader />}</div>
      ) : (
        <div>
          {data?.length < 1 && (
            <div className={styles.dataTableEmptyUI}>
              {typeof noDataComponent === 'string' ? <DataTableEmptyView text={noDataComponent} /> : noDataComponent}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <React.Fragment>
      {data && data.length > 0 ? (
        <React.Fragment>
          {renderCardSort()}
          <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 align-items-start">
            {data.map((row, index) => (
              <React.Fragment key={`main-${index}`}>
                <CustomCard
                  columns={columns}
                  rowIndex={index}
                  row={row}
                  defaultExpandedCardView={defaultExpandedCardView}
                  collapsibleCardView={collapsibleCardView}
                  selectedData={selectedData}
                  setSubCardExpandable={setSubCardExpandable}
                  nestedRow={!!row[nestedCardViewKey]}
                />
                {row.isParent &&
                  subCardExpandable &&
                  row[nestedCardViewKey].map((nestedRow, nestedIndex) => (
                    <div className="custom-sub-card">
                      <CustomCard
                        key={`nested-${index}-${nestedIndex}`}
                        columns={columns}
                        rowIndex={`${index}-${nestedIndex}`}
                        row={nestedRow}
                        defaultExpandedCardView={defaultExpandedCardView}
                        collapsibleCardView={collapsibleCardView}
                        selectedData={selectedData}
                      />
                    </div>
                  ))}
              </React.Fragment>
            ))}
          </div>
        </React.Fragment>
      ) : (
        renderEmptyDataComponent()
      )}
    </React.Fragment>
  );
}
export default TableCardView;
