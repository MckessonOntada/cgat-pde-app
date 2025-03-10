import EclipsesTextCss from '@src/components/EclipsesText/EclipsesTextcss';
import { COLUMNS, TABLE_COLUMNS } from './config';
import CommonUtils from '@src/util/CommonUtils';
import { Link } from 'react-router-dom';
import { Badge, Tooltip, MenuList } from '@mckesson/mcp-component-library';
import React from 'react';

const jsxColumns = [
  {
    id: COLUMNS.SAP_ID,
    name: 'labels.sapId',
    selector: () => {},
    sortable: true,
    sortKey: 'backendOrderId',
    minWidth: '130px',
    cell: (props) => (
      <Link
        className="MCP-table-link"
        // to={getPathByOrderStage(props)}
        // state={getState(props)}
      >
        <EclipsesTextCss str={props.backendOrderId} maxWidth={120} />
      </Link>
    )
  },
  {
    id: COLUMNS.PDE_ID,
    name: 'labels.pdeId',
    selector: () => {},
    sortable: true,
    sortKey: 'id',
    showInMobileHeader: true,
    showColumnNameInHeader: true,
    minWidth: '140px',
    cell: (props) => <EclipsesTextCss str={props.id} maxWidth={130} />
  },
  {
    id: COLUMNS.PATIENT_NAME,
    name: 'labels.patientName',
    selector: () => {},
    sortable: true,
    sortKey: 'patient.patientInfo',
    cell: (props) => {
      const patientInfo = props.patient && props.patient.patientInfo;
      if (!patientInfo) return 'N/A';
      else return <EclipsesTextCss str={CommonUtils.getFullName(patientInfo)} maxWidth={130} />;
    }
  },
  {
    id: COLUMNS.THERAPY,
    name: 'labels.therapy',
    selector: () => {},
    sortable: true,
    sortKey: 'therapy.materialDescription',
    maxWidth: '115px',
    showInMobileHeader: true,
    cardHeader: true,
    cell: (props) => <EclipsesTextCss str={props.therapy?.materialDescription} maxWidth={120} className={'MCP-table-cell'} />
  },
  {
    id: COLUMNS.AUTHOR,
    name: 'table.columns.captions.author',
    selector: () => {},
    sortable: true,
    sortKey: 'author?.name',
    maxWidth: '130px',
    cell: (props) => (
      <EclipsesTextCss tooltip={props.createdBy?.userName} str={props.createdBy?.name} maxWidth={120} className={'MCP-table-cell'} />
    )
  },
  {
    id: COLUMNS.CREATED_ON,
    name: 'table.columns.captions.createdOn',
    selector: () => {},
    sortable: true,
    sortKey: 'createdAt',
    minWidth: '80px',
    maxWidth: '135px',
    cell: (props) => <span>{CommonUtils.convertDateStringFormat(props.updatedAt || props.createdAt, 'MM-DD-YYYY')}</span>
  },

  {
    id: COLUMNS.SUBMITTED_BY,
    name: 'table.columns.captions.submittedBy',
    selector: () => {},
    sortable: true,
    sortKey: 'submittedBy.name',
    maxWidth: '140px',
    cell: (props) => (
      <EclipsesTextCss tooltip={props.submittedBy?.userName} str={props.submittedBy?.name} maxWidth={130} className={'MCP-table-cell'} />
    )
  },
  {
    id: COLUMNS.SUBMITTED_ON,
    name: 'table.columns.captions.submittedOn',
    selector: () => {},
    sortable: true,
    sortKey: 'submittedOn',
    width: '100px',
    cell: (props) => <span>{props.submittedOn ? CommonUtils.convertDateStringFormat(props.submittedOn, 'MM-DD-YYYY') : '-'}</span>
  },

  {
    id: COLUMNS.STATUS,
    name: 'table.columns.captions.status',
    selector: () => {},
    sortable: false,
    minWidth: '160px',
    center: true,
    showInMobileHeader: true,
    cardStatus: true,
    cell: (props) => (
      <Tooltip body={props.status}>
        <span>
          <Badge text={`labels.status.${props.status.toLowerCase()}`} type={'success'} />
          {/* getColorByStatus(props.status) */}
        </span>
      </Tooltip>
    )
  },
  {
    id: COLUMNS.PRICE,
    name: 'table.columns.captions.price',
    selector: () => {},
    sortable: false,
    right: true,
    selector: 'orderCost',
    cell: (props) => (
      <div className="cellEllipse align-items-right ">
        {props.orderCost || '00'}
        {/* {props.orderCost ? <FormattedNumber value={props.orderCost} style="currency" currency="USD" /> : ''} */}
      </div>
    )
  },
  {
    id: COLUMNS.ACTION,
    name: 'table.columns.captions.actions',
    selector: () => {},
    sortable: false,
    showInMobileHeader: true,
    width: '100px',
    isAction: true,
    isContextMenu: true,
    cell: (props) => 'action' //getOptionsByStatus(props, props.status, t, activeTab, props.id, alertContainerId)
  }
];

export const getTableColumns = (table, translate) => {
  if (!table) throw new Error('table type is missing');

  if (!Object.keys(TABLE_COLUMNS).includes(table)) throw new Error('no matching columns found');

  const columns = TABLE_COLUMNS[table];

  const tableColumns = jsxColumns.filter((column) => {
    return columns.includes(column.id);
  });

  //format
  tableColumns.forEach((column) => {
    column.name = translate(column.name);
  });

  return tableColumns;
};
