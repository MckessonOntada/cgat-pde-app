import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAddress, MasterEntityType } from '../util';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { useManagerQuestionnaire } from '../../context/ManageQuestionnaireContext';
import { useMultiCheckBox } from '../useMultiCheckBox';

export const getColumnsByEntityType = (t, navigate, masterEntityType, entityData, setSelectedRows, setOpenDetails, setSelectedDetails) => {
  const { paginationConfig } = useManagerQuestionnaire();
  const { renderCheckBox, selectedData } = useMultiCheckBox(entityData, paginationConfig);
  useEffect(() => {
    setSelectedRows(selectedData);
  }, [selectedData]);

  const handleRowClick = (e, row) => {
    setSelectedDetails(row);
    setOpenDetails(true);
  };

  switch (masterEntityType) {
    case MasterEntityType.Material:
      return [
        {
          id: 'checkbox',
          name: entityData?.length > 0 ? renderCheckBox({ id: 'ALL_ROWS' + paginationConfig.pageNumber }) : null,
          sortable: false,
          cell: (row, index) => renderCheckBox(row, index),
          selector: (row) => row.MRN,
          width: '50px'
        },
        {
          id: 'materialNumber',
          name: t('labels.therapy.materialNumber'),
          selector: () => {},
          maxWidth: '250px',
          cell: (props) => (
            <div className="cellEllipse">
              <Link
                className="MCP-table-link"
                aria-label={t('table.columns.captions.accountNumber')}
                onClick={(e) => {
                  e.preventDefault();
                  setOpenDetails(true);
                  setSelectedDetails(props);
                }}>
                <EclipsesTextcss str={props.materialNumber} maxWidth={240} />
              </Link>
            </div>
          )
        },
        {
          id: 'materialDescription',
          name: t('labels.therapy.materialDescription'),
          selector: (row) => row.materialDescription || '',
          maxWidth: '230px',
          cell: (props) => (
            <span aria-label={t('labels.therapy.materialDescription')}>
              <EclipsesTextcss str={props.materialDescription} maxWidth={220} />
            </span>
          )
        },
        {
          id: 'ndc',
          name: t('table.columns.captions.nationalDrugCode'),
          selector: (row) => row.ndcNumber || '',
          maxWidth: '200px',
          cell: (props) => (
            <span aria-label={t('table.columns.captions.nationalDrugCode')}>
              <EclipsesTextcss str={props.ndcNumber} maxWidth={180} />
            </span>
          )
        },
        {
          id: 'strength',
          name: t('table.columns.captions.strength'),
          selector: (row) => row.strength || '',
          maxWidth: '200px',
          sortable: false,
          cell: (props) => <span aria-label={t('table.columns.captions.strength')}>{props.strength}</span>
        },
        {
          id: 'dosage',
          name: t('table.columns.captions.dosage'),
          selector: (row) => row.dosage || '',
          maxWidth: '120px',
          sortable: false,
          cell: (props) => <span aria-label={t('table.columns.captions.dosage')}>{props.dosage}</span>
        }
      ];
    case MasterEntityType.Account:
      return [
        {
          id: 'checkbox',
          name: entityData?.length > 0 ? renderCheckBox({ id: 'ALL_ROWS' + paginationConfig.pageNumber }) : null,
          sortable: false,
          cell: (row, index) => renderCheckBox(row, index),
          selector: (row) => row.MRN,
          width: '50px'
        },
        {
          id: 'accountNumber',
          name: t('table.columns.captions.accountNumber'),
          selector: (row) => row.accountNumber || '',
          maxWidth: '350px',
          cell: (props) => (
            <Link
              className="MCP-table-link"
              aria-label={t('table.columns.captions.accountNumber')}
              onClick={(e) => {
                e.preventDefault();
                setOpenDetails(true);
                setSelectedDetails(props);
              }}>
              <EclipsesTextcss str={props.accountNumber} maxWidth={240} />
            </Link>
          )
        },
        {
          id: 'accountName',
          name: t('table.columns.captions.accountName'),
          selector: (row) => row.accountName || '',
          maxWidth: '350px',
          cell: (props) => <span aria-label={t('table.columns.captions.accountName')}>{props.accountName}</span>
        },
        {
          id: 'address',
          name: t('table.columns.captions.address'),
          selector: (row) => row.accountNumber || '',
          maxWidth: '290px',
          cell: (props) => (
            <span aria-label={t('table.columns.captions.address')}>
              <EclipsesTextcss str={getAddress(props.address)} maxWidth={180} />
            </span>
          )
        },
        {
          id: 'salesOrg',
          name: t('labels.salesOrg'),
          selector: (row) => row.salesOrg || '',
          maxWidth: '250px',
          sortable: false,
          cell: (props) => <span aria-label={t('labels.salesOrg')}>{props.salesOrg}</span>
        },
        {
          id: 'distributionChannel',
          name: t('labels.distributionChannel'),
          selector: (row) => row.distributionChannel || '',
          maxWidth: '200px',
          sortable: false,
          cell: (props) => <span aria-label={t('labels.distributionChannel')}>{props.distributionChannel}</span>
        }
      ];
    case MasterEntityType.Catalog:
      return [
        {
          id: 'checkbox',
          name: entityData?.length > 0 ? renderCheckBox({ id: 'ALL_ROWS' + paginationConfig.pageNumber }) : null,
          sortable: false,
          cell: (row, index) => renderCheckBox(row, index),
          selector: (row) => row.MRN,
          width: '50px'
        },
        {
          id: 'sapMaterial',
          name: t('labels.SapmaterialID'),
          selector: (row) => row.sapMaterial || '',
          maxWidth: '350px',
          cell: (props) => (
            <Link
              className="MCP-table-link"
              aria-label={t('labels.SapmaterialID')}
              onClick={(e) => {
                e.preventDefault();
                setOpenDetails(true);
                setSelectedDetails(props);
              }}>
              <EclipsesTextcss str={props.sapMaterial} maxWidth={240} />
            </Link>
          )
        },
        {
          id: 'materialDescription',
          name: t('labels.therapy.materialDescription'),
          selector: (row) => row.materialDescriptionInLanguageEn || '',
          maxWidth: '350px',
          cell: (props) => <span aria-label={t('labels.therapy.materialDescription')}>{props.materialDescriptionInLanguageEn}</span>
        },
        {
          id: 'ndc',
          name: t('labels.therapy.ndc'),
          selector: (row) => row.ndc || '',
          maxWidth: '290px',
          cell: (props) => (
            <span aria-label={t('labels.therapy.ndc')}>
              <EclipsesTextcss str={props.ndc} maxWidth={180} />
            </span>
          )
        },
        {
          id: 'distChannel',
          name: t('labels.distChannel'),
          selector: (row) => row.distChannel || '',
          maxWidth: '290px',
          cell: (props) => (
            <span aria-label={t('labels.distChannel')}>
              <EclipsesTextcss str={props.distChannel} maxWidth={180} />
            </span>
          )
        },
        {
          id: 'variant',
          name: t('labels.variant'),
          selector: (row) => row.variant || '',
          maxWidth: '150px',
          sortable: false,
          cell: (props) => <span aria-label={t('labels.variant')}>{props.variant}</span>
        },
        {
          id: 'soldToCustomer',
          name: t('labels.soldTo'),
          selector: (row) => row.soldToCustomer || '',
          maxWidth: '150px',
          sortable: false,
          cell: (props) => <span aria-label={t('labels.soldTo')}>{props.soldToCustomer}</span>
        },
        {
          id: 'shipToCustomer',
          name: t('labels.shipTo'),
          selector: (row) => row.shipToCustomer || '',
          maxWidth: '150px',
          sortable: false,
          cell: (props) => <span aria-label={t('labels.shipTo')}>{props.shipToCustomer}</span>
        }
      ];
    default:
      return [];
  }
};
