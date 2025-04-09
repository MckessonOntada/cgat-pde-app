import React from 'react';
import { Button } from '@mckesson/mcp-component-library';
import { ReactComponent as LinkIcon } from '@src/assets/svg/link.svg';
import { useTranslate } from '@src/translations/useTranslation';
import { closeModal, openModal } from '@src/store/reducer/modalReducer';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

const MATERIAL_CROSSWALK_COLUMNS = {
  BUY_AND_BILL_MATERIAL_ID: 'BUY_AND_BILL_MATERIAL_ID',
  BUY_AND_BILL_MATERIAL_DESCRIPTION: 'BUY_AND_BILL_MATERIAL_DESCRIPTION',
  BUY_AND_BILL_NDC: 'BUY_AND_BILL_NDC',
  SP_PRODUCT_ID: 'SP_PRODUCT_ID',
  SP_PRODUCT_NAME: 'SP_PRODUCT_NAME',
  SP_PRODUCT_NDC: 'SP_PRODUCT_NDC',
  ACTION: 'ACTION'
};

export const getColumns = () => {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const confirmationUnlink = (id) => () => {
    const state = {};
    state.title = `${t('label.unlinkRecord')}?`;
    state.body = (
      <div className="MCP-modal-body">
        <p>{t('label.unlinkRecordDescription')}</p>
      </div>
    );
    state.footer = (
      <div className="controls">
        <Button
          size="md"
          variant="secondary"
          onClick={() => dispatch(closeModal())}>
          {t('button.caption.no')}
        </Button>
        <Button
          size="md"
          variant="primary"
          onClick={() => console.log('Changes confirmed')}>
          {t('button.caption.yes')}
        </Button>
      </div>
    );
    dispatch(openModal(state));
  };
  return [
    {
      id: MATERIAL_CROSSWALK_COLUMNS.BUY_AND_BILL_MATERIAL_ID,
      name: 'Buy & Bill Material ID',
      minWidth: '160px',
      sortable: true,
      sortKey: 'materialId',
      cell: (props) => <div>{props?.id || '-'}</div>
    },
    {
      id: MATERIAL_CROSSWALK_COLUMNS.BUY_AND_BILL_MATERIAL_DESCRIPTION,
      name: 'Buy & Bill Material Description',
      minWidth: '160px',
      sortable: true,
      sortKey: 'materialDescription',
      cell: (props) => (
        <div>
          {(
            <Link className="MCP-table-link" to={`?material=${props.id}`}>
              {props?.materialDescription}
            </Link>
          ) || '-'}
        </div>
      )
    },

    {
      id: MATERIAL_CROSSWALK_COLUMNS.BUY_AND_BILL_NDC,
      name: 'Buy & Bill Material NDC',
      minWidth: '160px',
      sortable: true,
      sortKey: 'materialNdc',
      cell: (props) => <div>{props?.materialNdc || '-'}</div>
    },
    {
      id: MATERIAL_CROSSWALK_COLUMNS.SP_PRODUCT_ID,
      name: 'SP Product ID',
      minWidth: '160px',
      sortable: true,
      sortKey: 'spProductId',
      cell: (props) => <div>{props?.spProductId || '-'}</div>
    },
    {
      id: MATERIAL_CROSSWALK_COLUMNS.SP_PRODUCT_NAME,
      name: 'SP Product Name',
      minWidth: '160px',
      sortable: true,
      sortKey: 'spProductName',
      cell: (props) => (
        <div>
          <Link className="MCP-table-link" to={`?product=${props.id}`}>
            {props?.spProductName}
          </Link>
        </div>
      )
    },
    {
      id: MATERIAL_CROSSWALK_COLUMNS.SP_PRODUCT_NDC,
      name: 'SP Product NDC',
      minWidth: '160px',
      sortable: true,
      sortKey: 'spProductNdc',
      cell: (props) => <div>{props?.spProductNdc || '-'}</div>
    },

    {
      id: MATERIAL_CROSSWALK_COLUMNS.ACTION,
      name: 'Action',
      minWidth: '160px',
      cell: (props) => (
        <div className="styled-icon-button">
          <Button
            size="md"
            Icon={LinkIcon}
            variant="tertiary"
            onClick={confirmationUnlink(props.id)}>
            {t('button.caption.unlink')}
          </Button>
        </div>
      )
    }
  ];
};
