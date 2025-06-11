import React from 'react';
import { Button, IconButton, Tooltip } from '@mckesson/mcp-component-library';
import { ReactComponent as LinkIcon } from '@src/assets/svg/link.svg';
import { useTranslate } from '@src/translations/useTranslation';
import { closeModal, openModal } from '@src/store/reducer/modalReducer';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import SPCrosswalkService from '@src/api/commonService/SPCrosswalkService';

const MATERIAL_CROSSWALK_COLUMNS = {
  BUY_AND_BILL_NDC: 'BUY_AND_BILL_NDC',
  THERAPY: 'THERAPY',
  SP_PRODUCT_ID: 'SP_PRODUCT_ID',
  SP_PRODUCT_NAME: 'SP_PRODUCT_NAME',
  SP_PRODUCT_NDC: 'SP_PRODUCT_NDC',
  ACTION: 'ACTION'
};
export const getColumns = ({ setOpenDetails, setMaterialNumber, setOpenSPMaterialDetails, setViewSPMaterial, confirmationUnlink }) => {
  const { t } = useTranslate();
  const dispatch = useDispatch();

  return [
    {
      id: MATERIAL_CROSSWALK_COLUMNS.BUY_AND_BILL_NDC,
      name: 'Buy & Bill NDC',
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
      name: 'Therapy',
      minWidth: '80px',
      sortable: true,
      sortKey: 'tradeName',
      cell: (props) => <EclipsesTextcss str={props?.tradeName || '-'} />
    },
    {
      id: MATERIAL_CROSSWALK_COLUMNS.SP_PRODUCT_ID,
      name: 'SP Product ID',
      minWidth: '160px',
      sortable: true,
      sortKey: 'spProductId',
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
              <EclipsesTextcss str={props?.spProductId} maxWidth={150} />
            </Link>
          );
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
      cell: (props) => <EclipsesTextcss str={props?.spProductName} maxWidth={280} />
    },
    {
      id: MATERIAL_CROSSWALK_COLUMNS.SP_PRODUCT_NDC,
      name: 'SP Product NDC',
      minWidth: '90px',
      cell: (props) => <EclipsesTextcss str={props?.spNdc || '-'} />
    },

    {
      id: MATERIAL_CROSSWALK_COLUMNS.ACTION,
      name: 'Action',
      minWidth: '130px',
      cell: (props) => (
        <IconButton label={t('button.caption.unlink')} size="lg" iconButton={false} textButton={true} Icon={LinkIcon} onClick={confirmationUnlink(props.id)} />
      )
    }
  ];
};
