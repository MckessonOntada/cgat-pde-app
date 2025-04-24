import React from 'react';
import { CheckboxGroup, IconButton } from '@mckesson/mcp-component-library';
import { useSelection } from '@src/mfe/core-config/manage-providers/context/TableContext';
import { ReactComponent as LinkIcon } from '@src/assets/svg/link.svg';
import { useTranslate } from '@src/translations/useTranslation';
import { Link } from 'react-router-dom';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';

const PROVIDER_COLUMNS = {
  SP_PRODUCT_ID: 'PROVIDER_NAME',
  PRODUCT_NAME: 'PRODUCT_NAME',
  NDC: 'NDC',
  DIST_CHANNEL: 'DIST_CHANNEL',
  ACCOUNT_NUMBER: 'ACCOUNT_NUMBER',
  ACTION: 'ACTION'
};

export const getColumns = () => {
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
      minWidth: '120px',
      sortable: true,
      sortKey: 'sap_material',
      cell: (props) => (
        <Link to={`link-sp-account/${props.id}`} className="MCP-table-link">
          <EclipsesTextcss str={props?.sapMaterial || '-'} maxWidth={110} />
        </Link>
      ) //Link
    },
    {
      id: 'PRODUCT_NAME',
      name: 'Product Name',
      selector: (row) => row.materialDescriptionInLanguageEn,
      minWidth: '160px',
      sortable: true,
      sortKey: 'material_description_in_language_en',
      cell: (props) => (
        <EclipsesTextcss
          str={props?.materialDescriptionInLanguageEn || '-'}
          maxWidth={150}
        />
      )
    },
    {
      id: 'NDC',
      name: 'NDC',
      selector: (row) => row.ndc,
      minWidth: '120px',
      cell: (props) => (
        <EclipsesTextcss str={props?.ndc || '-'} maxWidth={110} />
      )
    },
    {
      id: 'ACCOUNT_NUMBER',
      name: 'Account Number',
      selector: (row) => row.soldToCustomer,
      minWidth: '120px',
      sortable: true,
      sortKey: 'sold_to_customer',
      cell: (props) => (
        <EclipsesTextcss str={props?.soldToCustomer || '-'} maxWidth={110} />
      )
    },
    {
      id: PROVIDER_COLUMNS.ACTION,
      name: 'Action',
      selector: () => {},
      minWidth: '160px',
      cell: () => (
        <IconButton
          variant="tertiary"
          label={t('provider.btnUnlink')}
          size="lg"
          iconButton={false}
          textButton={true}
          Icon={LinkIcon}
          onClick={() => {}}
        />
      )
    }
  ];
};
