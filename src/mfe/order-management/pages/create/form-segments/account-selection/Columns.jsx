import React from 'react';
import { RadioGroup } from '@mckesson/mcp-component-library';
export const createColumns = (t) => [
    {
        id: 'accountId',
        name: '',
        selector: () => { },
        sortable: false,
        width: '5%',
        cell: props => <span className={'MCP-table-cell'}>
            {
                <RadioGroup
                    caption=""
                    direction="column"
                    id={`radio-button-order-account`}
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
    }, {
        id: 'accountName',
        name: t('table.columns.captions.accountName'),
        selector: () => { },
        sortable: false,
        width: '35%',
        cell: props => <span className={'MCP-table-cell'}> {props.accountName}</span>,
    }, {
        id: 'accountNumber',
        name: t('table.columns.captions.accountNumber'),
        selector: () => { },
        sortable: false,
        width: '15%',
        cell: props => <span className={'MCP-table-cell'}> {props.accountNumber}</span>,
    }, {
        id: 'address',
        name: t('table.columns.captions.address'),
        selector: () => { },
        sortable: false,
        width: '45%',
        cell: props => <span className={'MCP-table-cell'}> {props.address}</span>,
    },
]