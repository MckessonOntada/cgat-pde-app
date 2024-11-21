import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, DropdownMenu } from '@mckesson/mcp-component-library';
import { StatusEnum } from './constants';
import { routesConfig } from '../../routes/constants';
import { ReactComponent as IconEllipsis } from '@src/assets/svg/ellipsis.svg';

const getColorByStatus = (status) => {
    const statusColors = {
        [StatusEnum.IN_DRAFT]: 'info',
        [StatusEnum.APPROVAL_PENDING]: 'info',
        [StatusEnum.SUBMITTED]: 'success',
        [StatusEnum.CANCELLED]: 'error',
    };
    return statusColors[status] || 'info';
};

const getLinkByStatus = ({ status, id }, t) => {
    const routes = {
        [StatusEnum.IN_DRAFT]: { path: `${routesConfig.createNew}/${id}`, label: t('table.actions.resumeOrder') },
        [StatusEnum.APPROVAL_PENDING]: { path: `${routesConfig.reviewOrder}/${id}`, label: t('table.actions.reviewOrder') },
        [StatusEnum.SUBMITTED]: { path: `${routesConfig.summary}/${id}`, label: t('table.actions.viewDetail') },
        [StatusEnum.CANCELLED]: { path: `${routesConfig.summary}/${id}`, label: t('table.actions.viewDetail') },
    };
    const { path = '#', label } = routes[status.toLowerCase()] || {};
    return <Link to={path}>{label}</Link>;
};

export const createColumns = (t, navigate) => [
    {
        id: 'id',
        name: t('table.columns.captions.orderId'),
        selector: () => { },
        sortable: true,
        width: '10%',
        cell: (props) => (
            <span className={'MCP-table-cell'} aria-label={t('table.columns.captions.orderId')}>
                {props.id}
            </span>
        ),
    },
    {
        id: 'patient',
        name: t('table.columns.captions.patientName'),
        selector: () => { },
        sortable: true,
        cell: (props) => (
            <span className={'MCP-table-cell'} aria-label={t('table.columns.captions.patientName')}>
                {props.patient}
            </span>
        ),
    },
    {
        id: 'therapy',
        name: t('table.columns.captions.therapy'),
        selector: () => { },
        sortable: true,
        cell: (props) => (
            <span className={'MCP-table-cell'} aria-label={t('table.columns.captions.therapy')}>
                {props.therapy}
            </span>
        ),
    },
    {
        id: 'author',
        name: t('table.columns.captions.author'),
        selector: () => { },
        sortable: true,
        cell: (props) => (
            <span className={'MCP-table-cell'} aria-label={t('table.columns.captions.author')}>
                {props.author}
            </span>
        ),
    },
    {
        id: 'createdOn',
        name: t('table.columns.captions.createdOn'),
        selector: () => { },
        sortable: false,
        cell: (props) => (
            <span className={'MCP-table-cell'} aria-label={t('table.columns.captions.createdOn')}>
                {new Date(props.createdOn).toLocaleDateString()}
            </span>
        ),
    },
    {
        id: 'status',
        name: t('table.columns.captions.status'),
        selector: () => { },
        sortable: false,
        center: true,
        cell: (props) => (
            <Badge
                text={props.status}
                type={getColorByStatus(props.status)}
            />
        ),
    },
    {
        id: 'price',
        name: t('table.columns.captions.price'),
        selector: () => { },
        sortable: false,
        cell: (props) => (
            <span className={'MCP-table-cell'} aria-label={t('table.columns.captions.price')}>
                {props.price}
            </span>
        ),
    },
    {
        id: 'actions',
        name: t('table.columns.captions.actions'),
        selector: () => { },
        sortable: false,
        cell: (props) =>
        {
            return (<DropdownMenu
                anchorEl={<button>
                    <IconEllipsis />
                </button>}
                handleSelect={({value}) => {
                    alert(value)
                    if(value === "view"){
                        navigate(`view-order/${props.id}`);
                    }if(value === "edit"){
                        navigate(`edit-order/${props.id}`);
                    }
                }}
                options={props.actions.split('/').map(action => ({
                    label: action,
                    value: action.toLowerCase()
                }))}
                aria-label="Profile options"
            />)
        }
        ,
    },
];
