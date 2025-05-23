import React from 'react';
import { IconButton, MenuList } from '@mckesson/mcp-component-library';
import { usePagination, useSelection, useTable } from '@src/mfe/core-config/admin/manage-providers/context/TableContext';
import { ReactComponent as IconEllipsis } from '@src/assets/svg/ellipsis.svg';
import { Link } from 'react-router-dom';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { ReactComponent as LinkIcon } from '@src/assets/svg/link.svg';
import { useTranslate } from '@src/translations/useTranslation';
import { renderTableCheckBox } from '@src/components/dataTableComponent/assets/constants/CustomTableConstants';

const PROVIDER_COLUMNS = {
  SP_PRODUCT_ID: 'PROVIDER_NAME',
  PRODUCT_NAME: 'PRODUCT_NAME',
  NDC: 'NDC',
  DIST_CHANNEL: 'DIST_CHANNEL',
  ACCOUNT_NUMBER: 'ACCOUNT_NUMBER',
  ACTION: 'ACTION'
};

export const getColumns = ({ setOpenSPMaterialDetails, setViewSPMaterial, onDeLinkConfirmation, handleOnOptionSelection, isCustomerCenter }) => {
  const { selectedRows, setSelection, selectedRowObjects } = useSelection();
  const { pagination } = usePagination();
  const { data } = useTable();
  const { t } = useTranslate();

  const handleOnDeLink = (data) => {
    const { sapMaterial, soldToCustomer } = data;
    const payload = [{ sapMaterial, soldToCustomer }];
    onDeLinkConfirmation(payload);
  };

  return [
    {
      id: 'checkbox',
      name: renderTableCheckBox(
        { id: 'ALL_ITEMS_' + pagination.pageNumber },
        data,
        'id',
        pagination,
        [
          ...Array.from(selectedRows).map((val) => ({
            id: val
          }))
        ],
        setSelection
      ),
      sortable: false,
      cell: (row, index) =>
        renderTableCheckBox(
          row,
          data,
          'id',
          pagination,
          [
            ...Array.from(selectedRows).map((val) => ({
              id: val
            }))
          ],

          setSelection
        ),
      width: '50px'
    },
    {
      id: 'SP_PRODUCT_ID',
      name: 'SP Product Id',
      selector: (row) => row.sapMaterial,
      minWidth: '120px',
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
      cell: (props) => <EclipsesTextcss str={props?.materialDescriptionInLanguageEn || '-'} maxWidth={150} />
    },
    {
      id: 'NDC',
      name: 'NDC',
      selector: (row) => row.ndc,
      minWidth: '120px',
      cell: (props) => <EclipsesTextcss str={props?.ndc || '-'} maxWidth={110} />
    },
    {
      id: 'ACCOUNT_NUMBER',
      name: 'Account Number',
      selector: (row) => row.soldToCustomer,
      minWidth: '120px',
      sortable: true,
      sortKey: 'sold_to_customer',
      cell: (props) => <EclipsesTextcss str={props?.soldToCustomer || '-'} maxWidth={110} />
    },
    {
      id: 'action',
      center: true,
      name: t('manageSPAccount.table.action'),
      cell: (row) => {
        return (
          <MenuList
            menuIcon={<IconEllipsis key={'menu-list-shippinglocation-table'} />}
            handleSelect={(value) => handleOnOptionSelection(value, row)}
            options={[
              {
                label: t('SPCatalog.Configuration'),
                value: 'configure'
              },
              {
                label: t('provider.btnUnlink'),
                value: 'unlink'
              }
            ]}
          />
        );
      },
      omit: isCustomerCenter,
      isAction: true
    }
  ];
};
