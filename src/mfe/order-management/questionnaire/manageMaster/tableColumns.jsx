import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAddress, MasterEntityType } from '../util';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { useManagerQuestionnaire } from '../../context/ManageQuestionnaireContext';
import CommonUtils from '@src/util/CommonUtils';

export const getColumnsByEntityType = (t, navigate, masterEntityType,entityData,setSelectedRows) => { 
  const [data, setData] = useState([]);
  const {  paginationConfig, } = useManagerQuestionnaire(); 

  const getindeterminate = () => {
    const allDataIncluded = entityData?.every((item) =>
      data.some((includedItem) => includedItem.id === item.id)
    );
    return allDataIncluded;
  };
  const renderCheckBox = (row, index) => {
    return (
      <input
        data-testid="rowcheckbox"
        type="checkbox"
        id={'checkbox' + row?.id}
        disabled={isCheckboxDisabled(row)}
        onChange={() => handleRowSelected(row)}
        checked={isChecked(row)}
        ref={(el) => {
          if (el) {
            el.indeterminate =
              row.id === 'ALL_ROWS' + paginationConfig.pageNumber && data.length > 0 && !getindeterminate();
          }
        }}
      />
    );
  };

  const isChecked = (row) => {
    if (row.id === 'ALL_ROWS' + paginationConfig.pageNumber) {
      return getindeterminate();
    }
    let availableRow = data.find((item) => item.id === row?.id);
    return !!availableRow;
  };

  const isAllChecked = () => {
    return data.length === entityData.length;
  };

  const isCheckboxDisabled = (row) => {
    let isDisbled = row.id === 'ALL_ROWS' + paginationConfig.pageNumber && !CommonUtils.isNonEmptyArray(entityData);
    return isDisbled;
  };

  const handleRowSelected = (entityData) => {
    if (entityData.id === 'ALL_ROWS' + paginationConfig.pageNumber) {
      handleHeaderCheck(entityData);
    } else {
      handleIndividualCheck(entityData);
    }
  };

  const handleIndividualCheck = (entityData) => {
    if (data.find((item) => item.id === entityData?.id)) {
      const updatedRows=data.filter((item) => item.id !== entityData?.id);
      setData(updatedRows);
      setSelectedRows(updatedRows);
      return;
    }
    setData([...data, ...[entityData]]);
    setSelectedRows([...data, ...[entityData]]);

  };
  
  const handleHeaderCheck = () => {
    if (isAllChecked()) {
      setData([]);
      setSelectedRows([]);
    } else {
      if (paginationConfig.pageNumber === 1) {
        setData(entityData);
        setSelectedRows(entityData);
      } else {
        const allDataIncluded = entityData.every((item) =>
          data.some((includedItem) => includedItem.id === item.id)
        );
        if (!allDataIncluded) {
          setData([...data, ...entityData]);
          setSelectedRows([...data, ...[entityData]]);
        } else {
          setData(data.filter((item) => !entityData.some((item) => item.id === item.id)));
          setSelectedRows(data.filter((item) => !entityData.some((item) => item.id === item.id)));
        }
      }
    }
  };

  switch (masterEntityType) {
    case MasterEntityType.Material:
      return [
        {
          id: 'checkbox',
          name: entityData?.length > 0 
          ? renderCheckBox({ id: 'ALL_ROWS' + paginationConfig.pageNumber }) 
          : null, 
          sortable: false,
          cell: (row, index) => renderCheckBox(row, index),
          selector: (row) => row.MRN,
          width: '50px'
        },
        {
          id: 'materialNumber',
          name: t('labels.therapy.materialNumber'),
          selector: () => {},
          maxWidth: '350px',
          sortable: true,
          sortKey: 'materialNumber',
          cell: (props) => (
            <Link className="MCP-table-link" aria-label={t('labels.therapy.materialNumber')}>
              <EclipsesTextcss str={props.materialNumber} maxWidth={240} />
            </Link>
          )
        },
        {
          id: 'materialDescription',
          name: t('labels.therapy.materialDescription'),
          selector: () => {},
          maxWidth: '350px',
          sortable: true,
          sortKey: 'materialDescription',
          cell: (props) => <span aria-label={t('labels.therapy.Description')}>{props.materialDescription}</span>
        },
        {
          id: 'ndc',
          name: t('table.columns.captions.nationalDrugCode'),
          selector: () => {},
          maxWidth: '290px',
          sortable: true,
          sortKey: 'ndcNumber',
          cell: (props) => (
            <span aria-label={t('table.columns.captions.nationalDrugCode')}>
              <EclipsesTextcss str={props.ndcNumber} maxWidth={180} />
            </span>
          )
        },
        {
          id: 'strength',
          name: t('table.columns.captions.strength'),
          selector: () => {},
          maxWidth: '150px',
          sortable: false,
          cell: (props) => <span aria-label={t('table.columns.captions.strength')}>{props.strength}</span>
        },
        {
          id: 'dosage',
          name: t('table.columns.captions.dosage'),
          selector: () => {},
          maxWidth: '150px',
          sortable: false,
          cell: (props) => <span aria-label={t('table.columns.captions.dosage')}>{props.dosage}</span>
        }
      ];
    case MasterEntityType.Account:
      return [
        {
          id: 'checkbox',
          name: entityData?.length > 0 
          ? renderCheckBox({ id: 'ALL_ROWS' + paginationConfig.pageNumber }) 
          : null, 
          sortable: false,
          cell: (row, index) => renderCheckBox(row, index),
          selector: (row) => row.MRN,
          width: '50px'
        },
        {
          id: 'accountNumber',
          name: t('table.columns.captions.accountNumber'),
          selector: () => {},
          maxWidth: '350px',
          sortable: true,
          sortKey: 'accountNumber',
          cell: (props) => (
            <Link className="MCP-table-link" aria-label={t('table.columns.captions.accountNumber')}>
              <EclipsesTextcss str={props.accountNumber} maxWidth={240} />
            </Link>
          )
        },
        {
          id: 'accountName',
          name: t('table.columns.captions.accountName'),
          selector: () => {},
          maxWidth: '350px',
          sortable: true,
          sortKey: 'accountName',
          cell: (props) => <span aria-label={t('table.columns.captions.accountName')}>{props.accountName}</span>
        },
        {
          id: 'address',
          name: t('table.columns.captions.address'),
          selector: () => {},
          maxWidth: '290px',
          sortable: true,
          sortKey: 'address',
          cell: (props) => (
            <span aria-label={t('table.columns.captions.address')}>
              <EclipsesTextcss str={getAddress(props.accountNumber)} maxWidth={180} />
            </span>
          )
        },
        {
          id: 'salesOrg',
          name: t('labels.salesOrg'),
          selector: () => {},
          maxWidth: '150px',
          sortable: false,
          cell: (props) => <span aria-label={t('labels.salesOrg')}>{props.salesOrg}</span>
        },
        {
          id: 'distributionChannel',
          name: t('labels.distributionChannel'),
          selector: () => {},
          maxWidth: '350px',
          sortable: false,
          cell: (props) => <span aria-label={t('labels.distributionChannel')}>{props.distributionChannel}</span>
        }
      ];
    case MasterEntityType.Catalog:
      return [
        {
          id: 'checkbox',
            name: entityData?.length > 0 
          ? renderCheckBox({ id: 'ALL_ROWS' + paginationConfig.pageNumber }) 
          : null, 
          sortable: false,
          cell: (row, index) => renderCheckBox(row, index),
          selector: (row) => row.MRN,
          width: '50px'
        },
        {
          id: 'materialNumber',
          name: t('labels.SapmaterialID'),
          selector: () => {},
          maxWidth: '350px',
          sortable: true,
          sortKey: 'materialNumber',
          cell: (props) => (
            <Link className="MCP-table-link" aria-label={t('labels.SapmaterialID')}>
              <EclipsesTextcss str={props.materialNumber} maxWidth={240} />
            </Link>
          )
        },
        {
          id: 'materialDescription',
          name: t('labels.therapy.materialDescription'),
          selector: () => {},
          maxWidth: '350px',
          sortable: true,
          sortKey: 'materialDescription',
          cell: (props) => <span aria-label={t('labels.therapy.Description')}>{props.materialDescription}</span>
        },
        {
          id: 'ndc',
          name: t( 'labels.therapy.ndc'),
          selector: () => {},
          maxWidth: '290px',
          sortable: true,
          sortKey: 'ndcNumber',
          cell: (props) => (
            <span aria-label={t('labels.therapy.ndc')}>
              <EclipsesTextcss str={props.ndcNumber} maxWidth={180} />
            </span>
          )
        },
        {
          id: 'ndc',
          name: t('labels.distChannel'),
          selector: () => {},
          maxWidth: '290px',
          sortable: true,
          sortKey: 'ndcNumber',
          cell: (props) => (
            <span aria-label={t('labels.distChannel')}>
              <EclipsesTextcss str={props.ndcNumber} maxWidth={180} />
            </span>
          )
        },
        {
          id: 'strength',
          name: t('labels.variant'),
          selector: () => {},
          maxWidth: '150px',
          sortable: false,
          cell: (props) => <span aria-label={t('labels.variant')}>{props.strength}</span>
        },
        {
          id: 'dosage',
          name: t('labels.netPrice'),
          selector: () => {},
          maxWidth: '150px',
          sortable: false,
          cell: (props) => <span aria-label={t('labels.netPrice')}>{props.dosage}</span>
        }
      ];
    default:
      return [];
  }
};
