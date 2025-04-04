import React from 'react';
import {
  Badge,
  Button,
  MenuList,
  CheckboxGroup
} from '@mckesson/mcp-component-library';
import { ReactComponent as EllipsisIcon } from '@src/assets/svg/ellipsis.svg';
import { useSelection } from '../../context/TableContext';
import { useNavigate } from 'react-router-dom';
import { closeModal, openModal } from '@src/store/reducer/modalReducer';
import { useDispatch } from 'react-redux';
import { useTranslate } from '@src/translations/useTranslation';

const PROVIDER_COLUMNS = {
  PROVIDER_NAME: 'PROVIDER_NAME',
  ADDRESS: 'ADDRESS',
  DEA_NUMBER: 'DEA_NUMBER',
  NPI_NUMBER: 'NPI_NUMBER',
  STATUS: 'STATUS',
  ACTION: 'ACTION'
};

export const getColumns = () => {
  const { selectedRows, toggleRowSelection, selectAll, deselectAll } =
    useSelection();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslate();

  const confirmDeactivation = (id) => {
    const state = {};
    state.title = `${t('label.deactivateRecord')}?`;
    state.body = (
      <div className="MCP-modal-body">
        <p>{t('label.deactivateRecordDescription')}</p>
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
          onClick={() => console.log('Changes confirmed')}>
          {t('button.caption.yes')}
        </Button>
      </div>
    );
    dispatch(openModal(state));
  };

  const handleOnMenuClick = (id) => (value) => {
    if (value === 'edit') {
      navigate(`edit/${id}`);
    } else if (value === 'linkSPAccount') {
      navigate(`link-sp-account/${id}`);
    } else if (value === 'deactivate') {
      confirmDeactivation(id);
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
      name: 'Provider Name',
      selector: (row) => row.providerName,
      minWidth: '160px',
      sortable: true,
      sortKey: 'providerName',
      cell: (props) => <div>{props?.providerName || '-'}</div>
    },
    {
      id: PROVIDER_COLUMNS.ADDRESS,
      name: 'Address',
      selector: (row) => row.address,
      minWidth: '160px',
      cell: (props) => <div>{props?.address || '-'}</div>
    },
    {
      id: PROVIDER_COLUMNS.DEA_NUMBER,
      name: 'DEA Number',
      selector: (row) => row.deaNumber,
      minWidth: '160px',
      cell: (props) => <div>{props?.deaNumber || '-'}</div>
    },
    {
      id: PROVIDER_COLUMNS.NPI_NUMBER,
      name: 'NPI Number',
      selector: (row) => row.npiNumber,
      minWidth: '160px',
      cell: (props) => <div>{props?.npiNumber || '-'}</div>
    },
    {
      id: PROVIDER_COLUMNS.STATUS,
      name: 'Status',
      selector: (row) => row.status,
      minWidth: '160px',
      cell: (props) => (
        <Badge
          text={`label.status.${props.isActive ? 'active' : 'inactive'}`}
          type={'success'}
        />
      )
    },
    {
      id: PROVIDER_COLUMNS.ACTION,
      name: 'Action',
      selector: () => {},
      minWidth: '160px',
      cell: (props) => (
        <MenuList
          menuIcon={<EllipsisIcon />}
          handleSelect={handleOnMenuClick(props.id)}
          options={[
            { label: 'Edit', value: 'edit' },
            {
              label: 'Deactivate',
              value: 'deactivate',
              disabled: !props.isActive
            },
            { label: 'Link SP Account', value: 'linkSPAccount' }
          ]}
        />
      )
    }
  ];
};
