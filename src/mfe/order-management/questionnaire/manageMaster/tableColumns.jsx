import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAddress, MasterEntityType } from '../util';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { useManagerQuestionnaire } from '../../context/ManageQuestionnaireContext'; 
import { useMultiCheckBox } from '../MultiSelectDatatable';

export const getColumnsByEntityType = (t, navigate, masterEntityType, entityData, setSelectedRows) => {
  const { paginationConfig } = useManagerQuestionnaire();
  const { renderCheckBox, selectedData } = useMultiCheckBox(entityData, paginationConfig);
  useEffect(() => {
    setSelectedRows(selectedData);
  }, [selectedData]);

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
          name: entityData?.length > 0 ? renderCheckBox({ id: 'ALL_ROWS' + paginationConfig.pageNumber }) : null,
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
          name: entityData?.length > 0 ? renderCheckBox({ id: 'ALL_ROWS' + paginationConfig.pageNumber }) : null,
          sortable: false,
          cell: (row, index) => renderCheckBox(row, index),
          selector: (row) => row.MRN,
          width: '50px'
        },
        {
          id: 'sapMaterial',
          name: t('labels.SapmaterialID'),
          selector: () => {},
          maxWidth: '350px',
          sortable: true,
          sortKey: 'sapMaterial',
          cell: (props) => (
            <Link className="MCP-table-link" aria-label={t('labels.SapmaterialID')}>
              <EclipsesTextcss str={props.sapMaterial} maxWidth={240} />
            </Link>
          )
        },
        {
          id: 'materialDescription',
          name: t('labels.therapy.materialDescription'),
          selector: () => {},
          maxWidth: '350px',
          sortable: true,
          sortKey: 'materialDescriptionInLanguageEn',
          cell: (props) => <span aria-label={t('labels.therapy.Description')}>{props.materialDescriptionInLanguageEn}</span>
        },
        {
          id: 'ndc',
          name: t('labels.therapy.ndc'),
          selector: () => {},
          maxWidth: '290px',
          sortable: true,
          sortKey: 'ndcNumber',
          cell: (props) => (
            <span aria-label={t('labels.therapy.ndc')}>
              <EclipsesTextcss str={props.ndc} maxWidth={180} />
            </span>
          )
        },
        {
          id: 'distChannel',
          name: t('labels.distChannel'),
          selector: () => {},
          maxWidth: '290px',
          sortable: true,
          sortKey: 'distChannel',
          cell: (props) => (
            <span aria-label={t('labels.distChannel')}>
              <EclipsesTextcss str={props.distChannel} maxWidth={180} />
            </span>
          )
        },
        {
          id: 'variant',
          name: t('labels.variant'),
          selector: () => {},
          maxWidth: '150px',
          sortable: false,
          cell: (props) => <span aria-label={t('labels.variant')}>{props.variant}</span>
        },
        {
          id: 'soldToCustomer',
          name: t('labels.soldTo'),
          selector: () => {},
          maxWidth: '150px',
          sortable: false,
          cell: (props) => <span aria-label={t('labels.soldTo')}>{props.soldToCustomer}</span>
        },
        {
          id: 'shipToCustomer',
          name: t('labels.shipTo'),
          selector: () => {},
          maxWidth: '150px',
          sortable: false,
          cell: (props) => <span aria-label={t('labels.shipTo')}>{props.shipToCustomer}</span>
        }
      ];
    default:
      return [];
  }
};
