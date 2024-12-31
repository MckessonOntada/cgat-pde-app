import React from 'react';
import { RadioGroup } from '@mckesson/mcp-component-library';
export const createColumns = (t, navigate, selectedShippingAddress, setSelectedShippingAddress) => [
  {
    id: 'shippingAddressId',
    name: '',
    selector: () => {},
    sortable: false,
    width: '5%',
    cell: (props) => {
      return (
        <span className="MCP-table-cell radio-button-wrapper">
          <RadioGroup
            direction="column"
            id={`radio-button-shipping-address-${props.id}`}
            items={[
              {
                isDisabled: false,
                label: ' ',
                value: props.id
              }
            ]}
            onChangeValue={() => setSelectedShippingAddress(props)}
            onOtherTextChange={() => {}}
            onSubRadioFieldChange={() => {}}
            radioBtnWidth="auto"
            value={selectedShippingAddress && selectedShippingAddress.id === props.id ? props.id : ' '}
          />
        </span>
      );
    }
  },
  {
    id: 'shippingAddress',
    name: t('table.columns.captions.shippingAddress'),
    selector: () => {},
    sortable: false,
    width: '45%',
    minWidth: '240px',
    cell: (props) => <span className={'MCP-table-cell'}> {props.shippingAddress}</span>
  },
  {
    id: 'shippingAccountNumber',
    name: t('table.columns.captions.shippingAccountNumber'),
    selector: () => {},
    sortable: false,
    width: '25%',
    cell: (props) => <span className={'MCP-table-cell'}> {props.shippingAccountNumber}</span>
  },
  {
    id: 'shippingAccountName',
    name: t('table.columns.captions.shippingAccountName'),
    selector: () => {},
    sortable: false,
    width: '25%',
    cell: (props) => <span className={'MCP-table-cell'}> {props.shippingAccountName}</span>
  }
];
