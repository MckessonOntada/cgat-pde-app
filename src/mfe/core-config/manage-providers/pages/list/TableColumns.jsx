import React from 'react';
import {
  Badge,
  Button,
  MenuList,
  Tooltip
} from '@mckesson/mcp-component-library';
import { ReactComponent as EllipsisIcon } from '@src/assets/svg/ellipsis.svg';
import {
  usePagination,
  useSelection,
  useTable
} from '../../context/TableContext';
import { Link, useNavigate } from 'react-router-dom';
import { closeModal, openModal } from '@src/store/reducer/modalReducer';
import { useDispatch } from 'react-redux';
import { useTranslate } from '@src/translations/useTranslation';
import { useMutation } from 'react-query';
import ProviderService from '@src/api/commonService/ProviderService';
import CommonUtils from '@src/util/CommonUtils';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import usePermission from '@src/hooks/usePermissions';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import { ROUTE_PATHS } from '../../routes/constants';
import { renderTableCheckBox } from '@src/components/dataTableComponent/assets/constants/CustomTableConstants';

const PROVIDER_COLUMNS = {
  PROVIDER_NAME: 'PROVIDER_NAME',
  ADDRESS: 'ADDRESS',
  DEA_NUMBER: 'DEA_NUMBER',
  NPI_NUMBER: 'NPI_NUMBER',
  STATUS: 'STATUS',
  ACTION: 'ACTION'
};

export const getColumns = (add) => {
  const { selectedRows, toggleRowSelection, setSelection } = useSelection();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslate();
  const { refreshTable } = useTable();
  const { pagination, changePage } = usePagination();
  const { data } = useTable();

  const { mutate: activateProvider } = useMutation(
    async (id) => ProviderService.activateProvider(id),
    {
      onSuccess: () => {
        add({
          description: t('provider.activationSuccess'),
          type: 'success'
        });
        const { pageNo, totalElements, totalPages, pageSize } = pagination;
        const isLastPage = pageNo === Math.ceil(totalElements / pageSize);
        const isLastRecordFromPage = totalElements % totalPages === 1;

        if (isLastPage && isLastRecordFromPage) {
          changePage(pageNo - 1);
        } else {
          refreshTable();
        }
      },
      onError: () => {
        add({
          description: t('provider.activationFailure'),
          type: 'error'
        });
      }
    }
  );

  const { mutate: deactivateProvider } = useMutation(
    async (id) => ProviderService.deactivateProvider(id),
    {
      onSuccess: () => {
        add({
          description: t('provider.deactivationSuccess'),
          type: 'success'
        });
        const { pageNo, totalElements, totalPages, pageSize } = pagination;
        const isLastPage = pageNo === Math.ceil(totalElements / pageSize);
        const isLastRecordFromPage = totalElements % totalPages === 1;

        if (isLastPage && isLastRecordFromPage) {
          changePage(pageNo - 1);
        } else {
          refreshTable();
        }
      },
      onError: () => {
        add({
          description: t('provider.deactivationFailure'),
          type: 'error'
        });
      }
    }
  );

  const handleOnConfirmation = (id, ops) => {
    if (ops === 'activate') {
      activateProvider(id);
    } else if (ops === 'deactivate') {
      deactivateProvider(id);
    }
  };

  const confirmDeactivation = (provider, ops) => {
    const state = {};
    state.title = `${t(t('messages.header.confirmation'))}`;
    state.body = (
      <div className="MCP-modal-body">
        <p>
          {provider.isActive
            ? t('providers.label.deactivateRecordDescription')
            : t('providers.label.activateRecordDescription')}
        </p>
      </div>
    );
    state.footer = (
      <div className="controls">
        <Button
          size="md"
          variant="secondary"
          onClick={() => dispatch(closeModal())}>
          {t('button.caption.cancel')}
        </Button>
        <Button
          size="md"
          variant="primary"
          onClick={() => {
            dispatch(closeModal());
            handleOnConfirmation(provider.id, ops);
          }}>
          {t('button.caption.confirm')}
        </Button>
      </div>
    );
    dispatch(openModal(state));
  };
  const { hasPermission, hasAnyPermission } = usePermission();

  const getMenuOption = (props) => {
    const options = [];
    const { selectedRows } = useSelection();
    if (hasPermission(PERMISSIONS_ENUM.MANAGE_PROVIDERS.EDIT_PROVIDER)) {
      options.push({
        label: (
          <Tooltip
            body={
              selectedRows.size > 1
                ? t('provider.disabledEditOnMultiSelect')
                : ''
            }>
            <div>{t('provider.contextMenu.optionEdit')}</div>
          </Tooltip>
        ),
        value: 'edit',
        disabled: selectedRows.size > 1 || props.isActive === false
      });
    }

    if (
      hasPermission(PERMISSIONS_ENUM.MANAGE_PROVIDERS.MANAGE_PROVIDERS_SCREEN)
    ) {
      options.push({
        label: t(
          !props.isActive
            ? 'provider.contextMenu.optionActivate'
            : 'provider.contextMenu.optionDeactivate'
        ),
        value: props.isActive ? 'deactivate' : 'activate'
      });
      options.push({
        label: t('provider.contextMenu.optionLinkSPAccount'),
        value: 'linkSPAccount',
        disabled: props.isActive === false
      });
    }

    return options;
  };

  const handleOnMenuClick = (props) => (value) => {
    if (value === 'edit') {
      navigate(`${props.id}/edit`);
    } else if (value === 'linkSPAccount') {
      navigate(`link-sp-account?accounts=${props.id}`);
    } else if (value === 'activate' || value === 'deactivate') {
      confirmDeactivation(props, value);
    }
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
      id: PROVIDER_COLUMNS.PROVIDER_NAME,
      name: t('providers.columnCaption.providerName'),
      minWidth: '140px',
      sortable: true,
      sortKey: 'first name',
      cell: (props) => {
        const isAllowed = hasPermission(
          PERMISSIONS_ENUM.MANAGE_PROVIDERS.VIEW_PROVIDER
        );
        const linkText = props?.name
          ? CommonUtils.getFullName(props.name)
          : '-';
        if (isAllowed) {
          return (
            <Link
              className="MCP-table-link"
              to={`${ROUTE_PATHS.VIEW}/${props.id}`}>
              <EclipsesTextcss str={linkText} maxWidth={130} />
            </Link>
          );
        }

        return linkText;
      }
    },
    {
      id: PROVIDER_COLUMNS.ADDRESS,
      name: t('providers.columnCaption.address'),
      selector: (row) => row.address,
      minWidth: '160px',
      cell: (props) => (
        <EclipsesTextcss
          str={CommonUtils.getAddress(props?.address) || '-'}
          maxWidth={160}
        />
      )
    },
    {
      id: PROVIDER_COLUMNS.DEA_NUMBER,
      name: t('providers.columnCaption.deaNumber'),
      selector: (row) => row.dea,
      minWidth: '160px',
      cell: (props) => <div>{props?.dea || '-'}</div>
    },
    {
      id: PROVIDER_COLUMNS.NPI_NUMBER,
      name: t('providers.columnCaption.npiNumber'),
      selector: (row) => row.npi,
      minWidth: '160px',
      cell: (props) => <div>{props?.npi || '-'}</div>
    },
    {
      id: PROVIDER_COLUMNS.STATUS,
      name: t('providers.columnCaption.status'),
      selector: (row) => row.status,
      minWidth: '160px',
      center: true,
      cell: (props) => (
        <Badge
          text={t(`label.status.${props.isActive ? 'active' : 'inactive'}`)}
          type={props.isActive ? 'success' : 'error'}
        />
      )
    },
    {
      id: PROVIDER_COLUMNS.ACTION,
      name: t('providers.columnCaption.action'),
      selector: () => {},
      minWidth: '160px',
      cell: (props) => {
        const contextMenuOptions = getMenuOption(props);
        if (!contextMenuOptions || contextMenuOptions.length === 0) return;
        return (
          <MenuList
            menuIcon={<EllipsisIcon />}
            handleSelect={handleOnMenuClick(props)}
            options={contextMenuOptions}
          />
        );
      }
    }
  ];
};
