import React, { useState } from 'react';

export const useMultiCheckBox = (inputData, paginationConfig, setExternalSelectedRows) => {
  const [selectedData, setSelectedData] = useState([]);

  const setExternalStateItems = (updatedRows) => {
    setSelectedData(updatedRows);
    if (setExternalSelectedRows) {
      setExternalSelectedRows(updatedRows);
    }
  };

  const getIndeterminate = () => {
    const allDataIncluded = inputData?.every((item) => selectedData.some((includedItem) => includedItem.id === item.id));
    return allDataIncluded;
  };

  const isChecked = (row) => {
    if (row.id === 'ALL_ROWS' + paginationConfig.pageNumber) {
      return getIndeterminate();
    }
    return selectedData.some((item) => item.id === row?.id);
  };

  const isAllChecked = () => selectedData.length === inputData.length;

  const isCheckboxDisabled = (row) => {
    return row.id === 'ALL_ROWS' + paginationConfig.pageNumber && inputData.length === 0;
  };

  const handleRowSelected = (row) => {
    if (row.id === 'ALL_ROWS' + paginationConfig.pageNumber) {
      handleHeaderCheck();
    } else {
      handleIndividualCheck(row);
    }
  };

  const handleIndividualCheck = (row) => {
    const exists = selectedData.some((item) => item.id === row?.id);
    const updatedRows = exists ? selectedData.filter((item) => item.id !== row?.id) : [...selectedData, row];

    setExternalStateItems(updatedRows);
  };

  const handleHeaderCheck = () => {
    if (isAllChecked()) {
      setExternalStateItems([]);
    } else {
      const allDataIncluded = inputData.every((item) => selectedData.some((includedItem) => includedItem.id === item.id));
      if (!allDataIncluded) {
        const updatedData = [...selectedData, ...inputData];
        setExternalStateItems(updatedData);
      } else {
        const filteredData = selectedData.filter((item) => !inputData.some((excludedItem) => excludedItem.id === item.id));
        setExternalStateItems(filteredData);
      }
    }
  };

  const renderCheckBox = (row) => (
    <input
      data-testid="rowcheckbox"
      type="checkbox"
      id={`checkbox${row?.id}`}
      disabled={isCheckboxDisabled(row)}
      onChange={() => handleRowSelected(row)}
      checked={isChecked(row)}
      ref={(el) => {
        if (el) {
          el.indeterminate = row.id === 'ALL_ROWS' + paginationConfig.pageNumber && selectedData.length > 0 && !getIndeterminate();
        }
      }}
    />
  );

  return {
    selectedData,
    setSelectedData,
    getIndeterminate,
    isChecked,
    isAllChecked,
    isCheckboxDisabled,
    renderCheckBox,
    handleRowSelected,
    handleHeaderCheck
  };
};
