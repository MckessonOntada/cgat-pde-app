import React from 'react';
import { RadioGroup } from '@mckesson/mcp-component-library';
export const createColumns = (t) => [
    {
        id: 'shippingAddressId',
        name: '',
        selector: () => { },
        sortable: false,
        width: '5%',
        cell: props => <span className={'MCP-table-cell'}>
            {
                <RadioGroup
                    caption=""
                    direction="column"
                    id={`radio-button-order-shippingAddress`}
                    items={[
                        {
                            isDisabled: false,
                            label: ' ',
                            value: props.id
                        }]}
                    onChangeValue={() => { }}
                    onOtherTextChange={() => { }}
                    onSubRadioFieldChange={() => { }}
                    radioBtnWidth="auto"
                    value="option1"
                />
            }
        </span>,
    }, 
    {
        id: 'shippingAddress',
        name: t('table.columns.captions.shippingAddress'),
        selector: () => { },
        sortable: false,
        width: '50%',
        cell: props => <span className={'MCP-table-cell'}> {props.shippingAddress}</span>,
    }, 
    {
        id: 'shippingAccountNumber',
        name: t('table.columns.captions.shippingAccountNumber'),
        selector: () => { },
        sortable: false,
        width: '25%',
        cell: props => <span className={'MCP-table-cell'}> {props.shippingAccountNumber}</span>,
    }, 
    {
        id: 'shippingAccountName',
        name: t('table.columns.captions.shippingAccountName'),
        selector: () => { },
        sortable: false,
        width: '25%',
        cell: props => <span className={'MCP-table-cell'}> {props.shippingAccountName}</span>,
    },
]