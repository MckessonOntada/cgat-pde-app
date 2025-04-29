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
    let isDisbled =
      row.id === 'ALL_ITEMS_' + paginationConfig.pageNumber &&
      !CommonUtils.isNonEmptyArray(data);
    return isDisbled;
  };

  const handleRowSelected = () => {
    if (row.id === 'ALL_ITEMS_' + paginationConfig.pageNumber) {
      handleHeaderCheck();
    } else {
      handleIndividualCheck();
    }
  };

  const handleHeaderCheck = () => {
    const currentPageMaterialNumbers = data.map((item) => item[dataKey]);

    if (isAllChecked()) {
      setSelectedData(
        selectedData.filter(
          (item) => !currentPageMaterialNumbers.includes(item[dataKey])
        )
      );
    } else {
      const allDataIncluded = data.every((item) =>
        selectedData.some(
          (includedItem) => includedItem[dataKey] === item[dataKey]
        )
      );
      if (!allDataIncluded) {
        const newSelections = data.filter(
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
    return selectedData.length === paginationConfig.totalElements;
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
    debugger;
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
