import React, { Fragment, useState } from 'react';

import styles from './assets/styles/CustomDataTable.module.scss';

import binSvg from '../../assets/svg/bin.svg';

import { ReactComponent as UploadArrowSvg } from '../../assets/svg/uploadArrowWhite.svg';
import { ReactComponent as FileUploadSvg } from '../../assets/svg/fileUpload.svg';
import { ReactComponent as WarningSvg } from '../../assets/svg/warning.svg';

import { Button, Loader } from '@mckesson/mcp-component-library';
import CommonUtils from '../../common/util/CommonUtils';

// TODO: Change file name to fit functionality

export function CustomDataTable(props) {
  const {
    tableField,
    setFileValue,
    bodyData,
    handleRemove,
    isLoading,
    tableSize,
    fileInputRef,
    handleClickUpload,
    handleFileSelect,
    style
  } = props;

  const renderTableHeader = (headers) => (
    <thead className={styles.tableHead}>
      <tr className={styles.tableRow}>
        {headers.map((header, idx) => (
          <th key={idx} className={styles.tableHeader} style={{ width: header.columnWidth }}>
            {header.name}
          </th>
        ))}
        {/* <th className={styles.tableHeader}>Warning</th> */}
      </tr>
    </thead>
  );

  const renderTableData = (data, headers, index) => (
    <tr className={styles.tableRow}>
      {headers.map((header, idx) => (
        <td
          key={idx}
          className={`${styles.tableData} ${
            data['validationMessages'].length !== 0 && styles.tableRowWarn
          }`}>
          {header.id === 'validationMessages' && data['validationMessages'].length !== 0 ? (
            <div className={styles.tableDataWarnContainer}>
              <WarningSvg />
              <div className={styles.tableDataWarnMessage}>
                {Array.isArray(data[header.id])
                  ? data[header.id].map((item, index) => (
                      <span key={index}>
                        {item}
                        {index < data[header.id].length - 1 ? ', ' : ''}
                      </span>
                    ))
                  : data[header.id]}
              </div>
            </div>
          ) : (
            data[header.id]
          )}
        </td>
      ))}
    </tr>
  );

  return (
    <div
      className={`${styles.dataTableContainer} md:grid-column-${tableSize?.gridStart}-by-${tableSize?.gridEnd}`}
      style={style}>
      <table className={styles.dataTable}>
        {CommonUtils.isNonEmptyArray(tableField['columns']) &&
          renderTableHeader(tableField['columns'])}

        <tbody className={styles.tableBody}>
          {bodyData &&
            bodyData.length > 0 &&
            bodyData.map((data, idx) => (
              <Fragment key={idx}>{renderTableData(data, tableField['columns'], idx)}</Fragment>
            ))}
        </tbody>
      </table>
      {isLoading && (
        <div className={styles.tablePrompt}>
          <Loader type="inline" loaderText="" />
        </div>
      )}
      {bodyData && !isLoading && bodyData.length === 0 && (
        <div className={styles.tablePrompt}>
          <FileUploadSvg />
          <span>Please choose a file to upload</span>
          <Button
            size="lg"
            Icon={UploadArrowSvg}
            iconPosition="left"
            onClick={(e) => {
              handleClickUpload(e);
            }}>
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
            Choose File
          </Button>
        </div>
      )}
    </div>
  );
}
