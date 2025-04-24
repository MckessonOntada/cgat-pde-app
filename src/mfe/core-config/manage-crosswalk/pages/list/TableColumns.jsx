import React from 'react';
import { Button, IconButton, Tooltip } from '@mckesson/mcp-component-library';
import { ReactComponent as LinkIcon } from '@src/assets/svg/link.svg';
import { useTranslate } from '@src/translations/useTranslation';
import { closeModal, openModal } from '@src/store/reducer/modalReducer';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';

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
    state.title = `${t('label.unlinkCrosswalk')}?`;
    state.body = (
      <div className="MCP-modal-body">
        <p>{t('label.unlinkCrosswalkDescription')}</p>
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
      minWidth: '120px',
      sortable: true,
      sortKey: 'bnbMaterialNumber',
      cell: (props) => (
        <EclipsesTextcss str={props?.bnbMaterialNumber || '-'} maxWidth={110} />
      )
    },
    {
      id: MATERIAL_CROSSWALK_COLUMNS.BUY_AND_BILL_MATERIAL_DESCRIPTION,
      name: 'Buy & Bill Material Description',
      minWidth: '160px',
      sortable: true,
      sortKey: 'bnbMaterialDescription',
      cell: (props) => (
        <Link className="MCP-table-link" to={`?material=${props.id}`}>
          <EclipsesTextcss
            str={props?.bnbMaterialDescription || '-'}
            maxWidth={150}
          />
        </Link>
      )
    },
    {
      id: MATERIAL_CROSSWALK_COLUMNS.BUY_AND_BILL_NDC,
      name: 'Buy & Bill Material NDC',
      minWidth: '80px',
      cell: (props) => (
        <EclipsesTextcss str={props?.bnbNdc || '-'} maxWidth={90} />
      )
    },
    {
      id: MATERIAL_CROSSWALK_COLUMNS.SP_PRODUCT_ID,
      name: 'SP Product ID',
      minWidth: '160px',
      sortable: true,
      sortKey: 'spProductId',
      cell: (props) => {
        if (props?.spProductId) {
          return <EclipsesTextcss maxWidth={150} str={props?.spProductId} />;
        } else {
          return <div>{'-'}</div>;
        }
      }
    },
    {
      id: MATERIAL_CROSSWALK_COLUMNS.SP_PRODUCT_NAME,
      name: 'SP Product Name',
      minWidth: '130px',
      sortable: true,
      sortKey: 'spProductName',
      cell: (props) => (
        <Link className="MCP-table-link" to={`?product=${props.id}`}>
          <EclipsesTextcss str={props?.spProductName || '-'} maxWidth={150} />
        </Link>
      )
    },
    {
      id: MATERIAL_CROSSWALK_COLUMNS.SP_PRODUCT_NDC,
      name: 'SP Product NDC',
      minWidth: '90px',
      cell: (props) => (
        <EclipsesTextcss str={props?.spNdc || '-'} maxWidth={80} />
      )
    },

    {
      id: MATERIAL_CROSSWALK_COLUMNS.ACTION,
      name: 'Action',
      minWidth: '130px',
      cell: (props) => (
        <IconButton
          label={t('button.caption.unlink')}
          size="lg"
          iconButton={false}
          textButton={true}
          Icon={LinkIcon}
          onClick={confirmationUnlink(props.id)}
        />
      )
    }
  ];
};
