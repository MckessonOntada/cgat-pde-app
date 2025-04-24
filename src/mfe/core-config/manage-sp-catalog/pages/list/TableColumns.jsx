import React from 'react';
import { Badge, MenuList, CheckboxGroup, Button } from '@mckesson/mcp-component-library';
import { ReactComponent as EllipsisIcon } from '@src/assets/svg/ellipsis.svg';
import { useSelection } from '@src/mfe/core-config/manage-providers/context/TableContext';
import { Link } from 'react-router-dom';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { ReactComponent as LinkIcon } from '@src/assets/svg/link.svg';
import { useTranslate } from '@src/translations/useTranslation';

const PROVIDER_COLUMNS = {
  SP_PRODUCT_ID: 'PROVIDER_NAME',
  PRODUCT_NAME: 'PRODUCT_NAME',
  NDC: 'NDC',
  DIST_CHANNEL: 'DIST_CHANNEL',
  ACCOUNT_NUMBER: 'ACCOUNT_NUMBER',
  ACTION: 'ACTION'
};

export const getColumns = ({ setOpenSPMaterialDetails, setViewSPMaterial }) => {
  const { selectedRows, toggleRowSelection, selectAll, deselectAll } = 
    useSelection();
  const { t } = useTranslate();

  return [
    {
      id: 'checkbox',
      name: '',
      showInMobileHeader: true,
      cell: (props) => (
        <CheckboxGroup
          id={'default'}
          caption=""
          items={[
            {
              onChange: () => toggleRowSelection(props.id),
              value: props.id,
              isChecked: selectedRows.has(props.id)
            }
          ]}
        />
      ),
      wrap: true,
      width: '40px'
    },
    {
      id: 'SP_PRODUCT_ID',
      name: 'SP Product Id',
      selector: (row) => row.sapMaterial,
      minWidth: '160px',
      sortable: true,
      sortKey: 'sap_material',
      cell: (props) => (
        <div className="cellEllipse">
          <Link
            style={{
              color: '#007bff',
              fontWeight: '600',
              textDecoration: 'none'
            }}
            onClick={(e) => {
              e.preventDefault();
              setViewSPMaterial(props);
              setOpenSPMaterialDetails(true);
            }}>
            <EclipsesTextcss str={props?.sapMaterial || '-'} maxWidth={280} />
          </Link>
        </div>
      )
    },
    {
      id: 'PRODUCT_NAME',
      name: 'Product Name',
      selector: (row) => row.materialDescriptionInLanguageEn,
      minWidth: '160px',
      sortable: true,
      sortKey: 'material_description_in_language_en',
      cell: (props) => (
        <div>{props?.materialDescriptionInLanguageEn || '-'}</div>
      )
    },
    {
      id: 'NDC',
      name: 'NDC',
      selector: (row) => row.ndc,
      minWidth: '160px',
      cell: (props) => <div>{props?.ndc || '-'}</div>
    },
    {
      id: 'ACCOUNT_NUMBER',
      name: 'Account Number',
      selector: (row) => row.soldToCustomer,
      minWidth: '160px',
      sortable: true,
      sortKey: 'sold_to_customer',
      cell: (props) => <div>{props?.soldToCustomer || '-'}</div>
    },
    {
      id: PROVIDER_COLUMNS.ACTION,
      name: 'Action',
      selector: () => {},
      minWidth: '160px',
      cell: () => (
        <div className="styled-icon-button">
          <Button
            onClick={() => {}}
            variant="tertiary"
            size="md"
            Icon={LinkIcon}>
            {t('provider.btnUnlink')}
          </Button>
        </div>
      )
    }
  ];
};
