import React from 'react';
import {
  Badge,
  Button,
  MenuList,
  CheckboxGroup
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

const PROVIDER_COLUMNS = {
  PROVIDER_NAME: 'PROVIDER_NAME',
  ADDRESS: 'ADDRESS',
  DEA_NUMBER: 'DEA_NUMBER',
  NPI_NUMBER: 'NPI_NUMBER',
  STATUS: 'STATUS',
  ACTION: 'ACTION'
};

export const getColumns = (add) => {
  const { selectedRows, toggleRowSelection, selectAll, deselectAll } =
    useSelection();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslate();
  const { refreshTable } = useTable();
  const { pagination, changePage } = usePagination();

  const { mutate: activateProvider } = useMutation(
    async (id) => ProviderService.activateProvider(id),
    {
      onSuccess: () => {
        add({
          description: 'Provider activated successfully',
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
          description: 'Failed to activate provider. Please try again.',
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
          description: 'Provider deactivated successfully',
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
          description: 'Failed to deactivate provider. Please try again.',
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
    state.title = provider.isActive
      ? `${t('providers.label.deactivateProvider')}`
      : `${t('providers.label.activateProvider')}`;
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
          {t('button.caption.no')}
        </Button>
        <Button
          size="md"
          variant="primary"
          onClick={() => {
            dispatch(closeModal());
            handleOnConfirmation(provider.id, ops);
          }}>
          {t('button.caption.yes')}
        </Button>
      </div>
    );
    dispatch(openModal(state));
  };
  const { hasPermission, hasAnyPermission } = usePermission();

  const getMenuOption = (props) => {
    const options = [];

    if (hasPermission(PERMISSIONS_ENUM.MANAGE_PROVIDERS.EDIT_PROVIDER)) {
      options.push({ label: 'Edit', value: 'edit' });
      options.push({
        label: props.isActive ? 'Deactivate' : 'Activate',
        value: props.isActive ? 'deactivate' : 'activate'
      });
      options.push({ label: 'Link SP Account', value: 'linkSPAccount' });
    }

    return options;
  };

  const handleOnMenuClick = (props) => (value) => {
    if (value === 'edit') {
      navigate(`edit/${props.id}`);
    } else if (value === 'linkSPAccount') {
      navigate(`link-sp-account/${props.id}`);
    } else if (value === 'activate' || value === 'deactivate') {
      confirmDeactivation(props, value);
    }
  };

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
              isChecked: selectedRows.has(props.id),
              isDisabled: !props.isActive
            }
          ]}
        />
      ),
      wrap: true,
      width: '40px'
    },
    {
      id: PROVIDER_COLUMNS.PROVIDER_NAME,
      name: t('providers.columnCaption.providerName'),
      selector: (row) => row.providerName,
      minWidth: '130px',
      sortable: true,
      sortKey: 'providerName',
      cell: (props) => {
        const isAllowed = hasPermission(
          PERMISSIONS_ENUM.MANAGE_PROVIDERS.VIEW_PROVIDER
        );
        return props?.name ? (
          <Link className="MCP-table-link" to={`${isAllowed ? props.id : ''}`}>
            {CommonUtils.getFullName(props?.name)}
          </Link>
        ) : (
          '-'
        );
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
          maxWidth={110}
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
          type={'success'}
        />
      )
    },
    {
      id: PROVIDER_COLUMNS.ACTION,
      name: t('providers.columnCaption.action'),
      selector: () => {},
      minWidth: '160px',
      cell: (props) => {
        const anyOperationPermission = hasAnyPermission([
          PERMISSIONS_ENUM.MANAGE_PROVIDERS.EDIT_PROVIDER
        ]);

        if (anyOperationPermission) {
          return (
            <MenuList
              menuIcon={<EllipsisIcon />}
              handleSelect={handleOnMenuClick(props)}
              options={getMenuOption(props)}
            />
          );
        } else {
          return '-';
        }
      }
    }
  ];
};
