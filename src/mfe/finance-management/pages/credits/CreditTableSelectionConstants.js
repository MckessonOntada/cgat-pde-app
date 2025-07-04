import React from 'react';
import CommonUtils from '@src/util/CommonUtils';

export const renderTableCheckBoxCredit = (
  row,
  data,
  dataKey,
  paginationConfig,
  selectedData,
  setSelectedData,
  disableInactive = true,
  allowInactiveSelection = false,
  disableSelection = false,
  paymentAmountSum
) => {
  const isCheckboxDisabled = () => {
    const isHeaderCheckbox = row.id === 'ALL_ITEMS_' + paginationConfig.pageNumber;
    if (!isHeaderCheckbox && disableSelection) {
      return true;
    }
    const isRowInactive = row.active === false || row.active === 'Inactive' || row.isActive === false || row.isActive === 'Inactive';
    return (isHeaderCheckbox && !CommonUtils.isNonEmptyArray(data)) || (disableInactive && isRowInactive && !allowInactiveSelection);
  };

  const handleRowSelected = () => {
    if (row.id === 'ALL_ITEMS_' + paginationConfig.pageNumber) {
      handleHeaderCheck();
    } else {
      handleIndividualCheck();
    }
  };

  const handleHeaderCheck = () => {
    const activeRows = data.filter((item) => {
      if (!disableInactive) return true;
      if (item.hasOwnProperty('active') && item.active === true) {
        return true;
      }
      if (item.hasOwnProperty('isActive') && item.isActive === true) {
        return true;
      }

      if (!item.hasOwnProperty('active') && !item.hasOwnProperty('isActive')) {
        return true;
      }
      return false;
    });
    const currentPageMaterialNumbers = activeRows.map((item) => item[dataKey]);

    const cleanedSelection = selectedData.filter((item) => {
      if (!disableInactive) return true;
      if ('active' in item && item.active === false) return false;
      if ('isActive' in item && item.isActive === false) return false;
      return true;
    });

    if (isAllChecked()) {
      setSelectedData(cleanedSelection.filter((item) => !currentPageMaterialNumbers.includes(item[dataKey])));
    } else {
      setSelectedData([...getRowsWithinCreditLimit(cleanedSelection, activeRows, paymentAmountSum)]);
    }
  };
  function getRowsWithinCreditLimit(cleanedSelection, activeRows, paymentAmountSum) {
    const selectedRows = [];
    const storedBillNo = new Set();
    let runningTotal = 0;
    let exceededOnce = false;

    for (const row of cleanedSelection) {
      const nextTotal = runningTotal + row.openAmount;
      if (nextTotal < paymentAmountSum) {
        selectedRows.push(row);
        runningTotal = nextTotal;
        storedBillNo.add(row.billNumber);
      } else if (nextTotal === paymentAmountSum) {
        selectedRows.push(row);
        storedBillNo.add(row.billNumber);
        return selectedRows;
      } else {
        if (!exceededOnce) {
          selectedRows.push(row);
          storedBillNo.add(row.billNumber);
          return selectedRows;
        }
      }
    }
    for (const row of activeRows) {
      if (storedBillNo.has(row.billNumber)) continue;
      const nextTotal = runningTotal + row.openAmount;
      if (nextTotal < paymentAmountSum) {
        selectedRows.push(row);
        runningTotal = nextTotal;
        storedBillNo.add(row.billNumber);
      } else if (nextTotal === paymentAmountSum) {
        selectedRows.push(row);
        break;
      } else {
        if (!exceededOnce) {
          selectedRows.push(row);
          break;
        }
      }
    }
    return selectedRows;
  }

  const isAllChecked = () => {
    if (disableSelection) return true;
    const activeRows = data.filter((item) => {
      if (!disableInactive) return true;
      if ('active' in item) return item.active === true;
      if ('isActive' in item) return item.isActive === true;
      return true;
    });
    return activeRows.every((item) => selectedData.some((selected) => selected[dataKey] === item[dataKey]));
  };

  const handleIndividualCheck = () => {
    if (selectedData.find((item) => item[dataKey] === row[dataKey])) {
      setSelectedData(selectedData.filter((item) => item[dataKey] !== row[dataKey]));
      return;
    }
    setSelectedData([...selectedData, ...[row]]);
  };

  const isChecked = () => {
    if (row.id === 'ALL_ITEMS_' + paginationConfig.pageNumber) {
      if (data && data.length == 0) {
        return false;
      }
      return getIndeterminate();
    }
    let availableRow = selectedData.find((item) => item[dataKey] === row[dataKey]);
    return !!availableRow;
  };

  const getIndeterminate = () => {
    const allDataIncluded = data.every((element) => selectedData.some((item) => item[dataKey] === element[dataKey]));
    return allDataIncluded;
  };

  return (
    <input
      data-testid="rowCheckbox"
      type="checkbox"
      id={'checkbox' + row?.id}
      disabled={isCheckboxDisabled()}
      onChange={() => handleRowSelected()}
      checked={isChecked()}
    />
  );
};
