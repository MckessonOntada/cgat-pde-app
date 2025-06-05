import React from 'react';
import CommonUtils from '@src/util/CommonUtils';

export const CUSTOM_TABLE_TYPE = Object.freeze({
  NORMAL: 'normal',
  COMPACT: 'compact'
});

export const renderTableCheckBox = (
  row,
  data,
  dataKey,
  paginationConfig,
  selectedData,
  setSelectedData
) => {
  const isCheckboxDisabled = () => {
    const isHeaderCheckbox =
      row.id === 'ALL_ITEMS_' + paginationConfig.pageNumber;
    const isRowInactive =
      row.active === false ||
      row.active === 'Inactive' ||
      row.isActive === false ||
      row.isActive === 'Inactive';
    return (
      (isHeaderCheckbox && !CommonUtils.isNonEmptyArray(data)) || isRowInactive
    );
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

    if (isAllChecked()) {
      setSelectedData(
        selectedData.filter(
          (item) => !currentPageMaterialNumbers.includes(item[dataKey])
        )
      );
    } else {
      const allDataIncluded = activeRows.every((item) =>
        selectedData.some(
          (includedItem) => includedItem[dataKey] === item[dataKey]
        )
      );
      if (!allDataIncluded) {
        const newSelections = activeRows.filter(
          (ele) => !selectedData.some((item) => item[dataKey] === ele[dataKey])
        );
        setSelectedData([...selectedData, ...newSelections]);
      } else {
        setSelectedData(
          selectedData.filter(
            (item) => !currentPageMaterialNumbers.includes(item[dataKey])
          )
        );
      }
    }
  };

  const isAllChecked = () => {
    const activeRows = data.filter((item) => {
      if ('active' in item) return item.active === true;
      if ('isActive' in item) return item.isActive === true;
      return true;
    });

    return activeRows.every((item) =>
      selectedData.some((selected) => selected[dataKey] === item[dataKey])
    );
  };

  const handleIndividualCheck = () => {
    if (selectedData.find((item) => item[dataKey] === row[dataKey])) {
      setSelectedData(
        selectedData.filter((item) => item[dataKey] !== row[dataKey])
      );
      return;
    }
    setSelectedData([...selectedData, ...[row]]);
  };

  const isChecked = () => {
    if (row.id === 'ALL_ITEMS_' + paginationConfig.pageNumber) {
      if (data && data.length == 0) {
        return false;
      }
      return getindeterminate();
    }
    let availableRow = selectedData.find(
      (item) => item[dataKey] === row[dataKey]
    );
    return !!availableRow;
  };

  const getindeterminate = () => {
    const allDataIncluded = data.every((element) =>
      selectedData.some((item) => item[dataKey] === element[dataKey])
    );
    return allDataIncluded;
  };

  return (
    <input
      data-testid="rowcheckbox"
      type="checkbox"
      id={'checkbox' + row?.id}
      disabled={isCheckboxDisabled()}
      onChange={() => handleRowSelected()}
      checked={isChecked()}
    />
  );
};
