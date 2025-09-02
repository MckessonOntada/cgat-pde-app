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
  const updatedData = data.map(({ catalog_id, ...rest }) => ({
    ...rest,
    id: catalog_id
  }));

  return [
    {
      id: 'checkbox',
      name: renderTableCheckBox({ id: 'ALL_ITEMS_' + pagination.pageNumber }, updatedData, 'id', pagination, [...selectedRowObjects], setSelection),
      sortable: false,
      cell: (row, index) => renderTableCheckBox(row, updatedData, 'id', pagination, [...selectedRowObjects], setSelection),
      width: '50px'
    },
    {
      id: 'PRODUCT_NAME',
      name: t('column.material.crosswalk.spProductName'),
      selector: (row) => row.catalogPrice.materialDescriptionInLanguageEn,
      minWidth: '180px',
      sortable: true,
      sortKey: 'material_description_in_language_en',
      cell: (props) => <EclipsesTextcss str={props?.catalogPrice?.materialDescriptionInLanguageEn || '-'} maxWidth={170} />
    },
    {
      id: 'genericName',
      name: t('manageSPMaterial.table.genericName'),
      selector: (row) => {},
      minWidth: '160px',
      wrap: true,
      cell: (props) => <EclipsesTextcss str={props?.genericName} maxWidth={150} />
    },
    {
      id: 'manufacturerName',
      name: t('manageSPMaterial.table.manufacturer'),
      selector: (row) => {},
      minWidth: '200px',
      sortable: true,
      sortKey: 'manufacturer_name',
      wrap: true,
      cell: (props) => <EclipsesTextcss str={props?.manufacturer} maxWidth={190} />
    },
    {
      id: 'dosage',
      name: t('manageSPMaterial.table.dosage'),
      selector: (row) => {},
      minWidth: '120px',
      sortable: false,
      wrap: true,
      cell: (props) => <EclipsesTextcss str={props?.dosage} maxWidth={100} />
    },
    {
      id: 'NDC',
      name: t('column.material.crosswalk.spNDC'),
      selector: (row) => row.ndc,
      minWidth: '120px',
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
              setViewSPMaterial(props?.catalogPrice);
              setOpenSPMaterialDetails(true);
            }}>
            <EclipsesTextcss str={props?.catalogPrice?.ndc || '-'} maxWidth={110} />
          </Link>
        </div>
      )
    },
    {
      id: 'ACCOUNT_NUMBER',
      name: 'Account Number',
      selector: (row) => row.soldToCustomer,
      minWidth: '120px',
      sortable: true,
      sortKey: 'sold_to_customer',
      cell: (props) => <EclipsesTextcss str={props?.catalogPrice?.soldToCustomer || '-'} maxWidth={110} />
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
            size="md"
          />
        );
      },
      omit: isCustomerCenter,
      isAction: true
    }
  ];
};
