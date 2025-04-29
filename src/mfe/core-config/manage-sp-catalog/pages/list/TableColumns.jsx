import React from 'react';
import {
  Badge,
  MenuList,
  CheckboxGroup,
  Button,
  IconButton
} from '@mckesson/mcp-component-library';
import {
  usePagination,
  useSelection,
  useTable
} from '@src/mfe/core-config/manage-providers/context/TableContext';
import { Link } from 'react-router-dom';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { ReactComponent as LinkIcon } from '@src/assets/svg/link.svg';
import { useTranslate } from '@src/translations/useTranslation';
import { useDispatch } from 'react-redux';
import { closeModal, openModal } from '@src/store/reducer/modalReducer';
import SPCatalogService from '@src/api/commonService/SPCatalogService';
import { useMutation } from 'react-query';
import { renderTableCheckBox } from '@src/components/dataTableComponent/assets/constants/CustomTableConstants';

const PROVIDER_COLUMNS = {
  SP_PRODUCT_ID: 'PROVIDER_NAME',
  PRODUCT_NAME: 'PRODUCT_NAME',
  NDC: 'NDC',
  DIST_CHANNEL: 'DIST_CHANNEL',
  ACCOUNT_NUMBER: 'ACCOUNT_NUMBER',
  ACTION: 'ACTION'
};

export const getColumns = ({
  setOpenSPMaterialDetails,
  setViewSPMaterial,
  add,
  refresh
}) => {
  const { selectedRows, setSelection } = useSelection();
  const { pagination } = usePagination();
  const { data } = useTable();
  const dispatch = useDispatch();
  const { t } = useTranslate();
  const { mutate } = useMutation({
    mutationFn: (payload) => SPCatalogService.deLinkCatalogs(payload),
    onSuccess: (response, variables) => {},
    onError: (error, variables) => {}
  });
  const handleOnDeLink = (data) => {
    const state = {};
    state.title = t('SPCatalog.deLinkConfirmationTitle');
    state.body = (
      <div className="MCP-modal-body">
        {t('SPCatalog.deLinkConfirmationDescription')}
      </div>
    );
    state.footer = (
      <div className="controls">
        <Button
          onClick={() => dispatch(closeModal())}
          variant="secondary"
          size="md">
          {t('provider.btnCancel')}
        </Button>
        <Button
          onClick={() => {
            const { sapMaterial, soldToCustomer } = data;
            dispatch(closeModal());
            mutate([
              {
                sapMaterial,
                soldToCustomer
              }
            ]);
          }}
          size="md">
          {t('provider.btnDeLink')}
        </Button>
      </div>
    );
    dispatch(openModal(state));
  };
  return [
    // {
    //   id: 'checkbox',
    //   name: '',
    //   showInMobileHeader: true,
    //   cell: (props) => (
    //     <CheckboxGroup
    //       id={'default'}
    //       caption=""
    //       items={[
    //         {
    //           onChange: () => toggleRowSelection(props.id),
    //           value: props.id,
    //           isChecked: selectedRows.has(props.id)
    //         }
    //       ]}
    //     />
    //   ),
    //   wrap: true,
    //   width: '40px'
    // },
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
      cell: (props) => (
        <IconButton
          variant="tertiary"
          label={t('button.caption.unlink')}
          size="lg"
          iconButton={false}
          textButton={true}
          Icon={LinkIcon}
          onClick={() => handleOnDeLink(props)}
        />
      )
    }
  ];
};
