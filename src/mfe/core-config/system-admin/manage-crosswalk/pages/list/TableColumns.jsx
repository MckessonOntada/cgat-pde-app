import React from 'react';
import { Button, IconButton, Tooltip } from '@mckesson/mcp-component-library';
import { ReactComponent as LinkIcon } from '@src/assets/svg/link.svg';
import { useTranslate } from '@src/translations/useTranslation';
import { closeModal, openModal } from '@src/store/reducer/modalReducer';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';

const MATERIAL_CROSSWALK_COLUMNS = {
  BUY_AND_BILL_NDC: 'BUY_AND_BILL_NDC',
  THERAPY: 'THERAPY',
  SP_PRODUCT_NDC: 'SP_PRODUCT_NDC',
  SP_PRODUCT_NAME: 'SP_PRODUCT_NAME',
  FORMULATION: 'FORMULATION',
  DOSAGE: 'DOSAGE',
  ACTION: 'ACTION'
};
export const getColumns = ({ setOpenDetails, setMaterialNumber, setOpenSPMaterialDetails, setViewSPMaterial, confirmationUnlink }) => {
  const { t } = useTranslate();
  const dispatch = useDispatch();

  return [
    {
      id: MATERIAL_CROSSWALK_COLUMNS.BUY_AND_BILL_NDC,
      name: t('column.material.crosswalk.buyBillNDC'),
      minWidth: '160px',
      sortable: false,
      cell: (props) => (
        <div>
          {
            <Link
              className="MCP-table-link"
              onClick={(e) => {
                e.preventDefault();
                setOpenDetails(true);
                setMaterialNumber(props?.bnbNdc);
              }}>
              <EclipsesTextcss str={props?.bnbNdc} maxWidth={180} />
            </Link>
          }
        </div>
      )
    },
    {
      id: MATERIAL_CROSSWALK_COLUMNS.THERAPY,
      name: t('column.material.crosswalk.Therapy'),
      minWidth: '80px',
      sortable: true,
      sortKey: 'trade_name',
      cell: (props) => <EclipsesTextcss str={props?.tradeName || '-'} />
    },
    {
      id: MATERIAL_CROSSWALK_COLUMNS.SP_PRODUCT_NDC,
      name: t('column.material.crosswalk.spNDC'),
      minWidth: '160px',
      cell: (props) => {
        if (props?.spProductId) {
          return (
            <Link
              className="MCP-table-link"
              onClick={(e) => {
                e.preventDefault();
                setViewSPMaterial(props);
                setOpenSPMaterialDetails(true);
              }}>
              <EclipsesTextcss str={props?.spNdc || '-'} maxWidth={150} />
            </Link>
          );
        } else {
          return <div>{'-'}</div>;
        }
      }
    },
    {
      id: MATERIAL_CROSSWALK_COLUMNS.SP_PRODUCT_NAME,
      name: t('column.material.crosswalk.spProductName'),
      minWidth: '280px',
      sortable: true,
      sortKey: 'spProductName',
      cell: (props) => <EclipsesTextcss str={props?.spProductName} maxWidth={280} />
    },
    {
      id: MATERIAL_CROSSWALK_COLUMNS.FORMULATION,
      name: t('labels.formulation'),
      minWidth: '130px',
      cell: (props) => <EclipsesTextcss str={props?.formulation?.trim() || '-'} />
    },

    {
      id: MATERIAL_CROSSWALK_COLUMNS.DOSAGE,
      name: t('labels.therapy.strength'),
      minWidth: '90px',
      cell: (props) => <EclipsesTextcss str={props?.dosage?.trim() || '-'} />
    },

    {
      id: MATERIAL_CROSSWALK_COLUMNS.ACTION,
      name: t('column.material.crosswalk.action'),
      maxWidth: '130px',
      cell: (props) => (
        <IconButton label={t('button.caption.unlink')} size="lg" iconButton={false} textButton={true} Icon={LinkIcon} onClick={confirmationUnlink(props.id)} />
      )
    }
  ];
};
