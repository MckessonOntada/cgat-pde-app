import React from 'react';
import { Button } from '@mckesson/mcp-component-library';
import { ReactComponent as LinkIcon } from '@src/assets/svg/link.svg';
import { useTranslate } from '@src/translations/useTranslation';

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
  return [
    {
      id: MATERIAL_CROSSWALK_COLUMNS.BUY_AND_BILL_MATERIAL_ID,
      name: 'Buy & Bill Material ID',
      selector: (row) => row.providerName,
      minWidth: '160px',
      sortable: true,
      sortKey: 'materialId',
      cell: (props) => <div>{props?.materialId || '-'}</div>
    },
    {
      id: MATERIAL_CROSSWALK_COLUMNS.BUY_AND_BILL_MATERIAL_DESCRIPTION,
      name: 'Buy & Bill Material Description',
      selector: (row) => row.address,
      minWidth: '160px',
      sortable: true,
      sortKey: 'materialDescription',
      cell: (props) => <div>{props?.materialDescription || '-'}</div>
    },

    {
      id: MATERIAL_CROSSWALK_COLUMNS.BUY_AND_BILL_NDC,
      name: 'Buy & Bill Material NDC',
      selector: (row) => row.deaNumber,
      minWidth: '160px',
      sortable: true,
      sortKey: 'materialNdc',
      cell: (props) => <div>{props?.materialNdc || '-'}</div>
    },
    {
      id: MATERIAL_CROSSWALK_COLUMNS.SP_PRODUCT_ID,
      name: 'SP Product ID',
      selector: (row) => row.npiNumber,
      minWidth: '160px',
      sortable: true,
      sortKey: 'spProductId',
      cell: (props) => <div>{props?.spProductId || '-'}</div>
    },
    {
      id: MATERIAL_CROSSWALK_COLUMNS.SP_PRODUCT_NAME,
      name: 'SP Product Name',
      selector: (row) => row.npiNumber,
      minWidth: '160px',
      sortable: true,
      sortKey: 'spProductName',
      cell: (props) => <div>{props?.spProductName || '-'}</div>
    },
    {
      id: MATERIAL_CROSSWALK_COLUMNS.SP_PRODUCT_NDC,
      name: 'SP Product NDC',
      selector: (row) => row.npiNumber,
      minWidth: '160px',
      sortable: true,
      sortKey: 'spProductNdc',
      cell: (props) => <div>{props?.spProductNdc || '-'}</div>
    },

    {
      id: MATERIAL_CROSSWALK_COLUMNS.ACTION,
      name: 'Action',
      selector: () => {},
      minWidth: '160px',
      cell: () => (
        <div className="styled-icon-button">
          <Button
            size="md"
            Icon={LinkIcon}
            variant="tertiary"
            onClick={() => {}}>
            {t('button.caption.unlink')}
          </Button>
        </div>
      )
    }
  ];
};
