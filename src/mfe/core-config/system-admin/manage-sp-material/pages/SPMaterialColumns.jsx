import React from 'react';
import { renderTableCheckBox } from '@src/components/dataTableComponent/assets/constants/CustomTableConstants';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { Badge } from '@mckesson/mcp-component-library';
import CommonUtils from '@src/util/CommonUtils';
import { Link } from 'react-router-dom';

export const getSPMaterialColumns = ({
  t,
  paginationConfig,
  updatedData,
  selectedSPMaterial,
  setSelectedSPMaterial,
  setViewSPMaterial,
  setOpenSPMaterialDetails,
  isLinkCatalog
}) => [
  {
    id: 'checkbox',
    name: renderTableCheckBox(
      { id: 'ALL_ITEMS_' + paginationConfig.pageNumber },
      updatedData,
      'id',
      paginationConfig,
      selectedSPMaterial,
      setSelectedSPMaterial
    ),
    sortable: false,
    cell: (row) =>
      renderTableCheckBox(
        row.itemStatus === 'A' ? { ...row, active: true } : { ...row, active: false },
        updatedData,
        'id',
        paginationConfig,
        selectedSPMaterial,
        setSelectedSPMaterial
      ),
    width: '50px'
  },
  {
    id: 'tradeName',
    name: t('labels.therapy'),
    selector: () => {},
    minWidth: '150px',
    sortable: true,
    sortKey: 'trade_name',
    wrap: true,
    cell: (props) => <EclipsesTextcss str={props?.tradeName} maxWidth={150} />
  },
  {
    id: 'genericName',
    name: t('manageSPMaterial.table.genericName'),
    selector: () => {},
    minWidth: '160px',
    wrap: true,
    cell: (props) => <EclipsesTextcss str={props?.genericName} maxWidth={150} />
  },
  {
    id: 'materialDescription',
    name: t('labels.therapyDescription'),
    selector: () => {},
    minWidth: '250px',
    sortable: true,
    sortKey: 'material_description',
    wrap: true,
    cell: (props) => <EclipsesTextcss str={props?.materialDescription} maxWidth={250} />
  },
  {
    id: 'strength',
    name: t('manageSPMaterial.table.strength'),
    selector: () => {},
    minWidth: '120px',
    sortable: false,
    wrap: true,
    cell: (props) => <EclipsesTextcss str={`${props?.strength} ${props?.dosage}`} maxWidth={100} />
  },
  {
    id: 'ndcNumber',
    name: t('manageSPMaterial.table.ndc'),
    selector: () => {},
    minWidth: '120px',
    sortable: false,
    wrap: true,
    cell: (props) => (
      <div className="cellEllipse">
        <a
          style={{ color: '#007bff', fontWeight: '600', textDecoration: 'none', cursor: 'pointer' }}
          onClick={() => {
            setViewSPMaterial({ ...props, displayMaterialValue: CommonUtils.removeLeadingZeros(props.materialNumber) });
            setOpenSPMaterialDetails(true);
          }}>
          <EclipsesTextcss str={props?.ndcNumber} maxWidth={100} />
        </a>
      </div>
    )
  },
  {
    id: 'manufacturerName',
    name: t('manageSPMaterial.table.manufacturer'),
    selector: () => {},
    minWidth: '200px',
    sortable: true,
    sortKey: 'manufacturer_name',
    wrap: true,
    cell: (props) => <EclipsesTextcss str={props?.manufacturerName} maxWidth={190} />
  },
  {
    id: 'status',
    name: t('manageSPMaterial.table.status'),
    selector: () => {},
    sortKey: 'status',
    minWidth: '100px',
    center: true,
    cell: (props) =>
      props.itemStatus === 'A' ? (
        <Badge customStyle={{ minWidth: '120px' }} text="Active" type="success" />
      ) : (
        <Badge customStyle={{ minWidth: '120px' }} text="Inactive" type="info-default" />
      ),
    omit: isLinkCatalog ? true : false
  }
];

export const getLinkSPMaterialColumns = ({
  t,
  paginationConfig,
  updatedData,
  selectedSPMaterial,
  setSelectedSPMaterial,
  setViewSPMaterial,
  setOpenSPMaterialDetails,
  isLinkCatalog
}) => [
  {
    id: 'checkbox',
    name: renderTableCheckBox(
      { id: 'ALL_ITEMS_' + paginationConfig.pageNumber },
      updatedData,
      'id',
      paginationConfig,
      selectedSPMaterial,
      setSelectedSPMaterial
    ),
    sortable: false,
    cell: (row, index) =>
      renderTableCheckBox(
        row.itemStatus === 'A' ? { ...row, active: true } : { ...row, active: false },
        updatedData,
        'id',
        paginationConfig,
        selectedSPMaterial,
        setSelectedSPMaterial
      ),
    width: '50px'
  },
  {
    id: 'materialDescription',
    name: t('column.material.crosswalk.spProductName'),
    selector: (row) => {},
    minWidth: '210px',
    sortable: true,
    sortKey: 'material_description',
    wrap: true,
    cell: (props) => <EclipsesTextcss str={props?.materialDescription} maxWidth={200} />
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
    cell: (props) => <EclipsesTextcss str={props?.manufacturerName} maxWidth={190} />
  },
  {
    id: 'dosage',
    name: t('manageSPMaterial.table.dosage'),
    selector: (row) => {},
    minWidth: '120px',
    sortable: false,
    wrap: true,
    cell: (props) => <EclipsesTextcss str={`${props?.strength} ${props?.dosage}`} maxWidth={100} />
  },
  {
    id: 'ndcNumber',
    name: t('column.material.crosswalk.spNDC'),
    selector: (row) => {},
    minWidth: '120px',
    sortable: false,
    wrap: true,
    cell: (props) => {
      if (props?.ndcNumber) {
        return (
          <Link
            className="MCP-table-link"
            onClick={() => {
              setViewSPMaterial({ ...props, displayMaterialValue: CommonUtils.removeLeadingZeros(props.materialNumber) });
              setOpenSPMaterialDetails(true);
            }}>
            <EclipsesTextcss str={props?.ndcNumber || '-'} maxWidth={150} />
          </Link>
        );
      } else {
        return <div>{'-'}</div>;
      }
    }
  },
  {
    id: 'status',
    name: t('manageSPMaterial.table.status'),
    selector: (row) => {},
    sortKey: 'status',
    minWidth: '100px',
    center: true,
    cell: (props) =>
      props.itemStatus === 'A' ? (
        <Badge customStyle={{ minWidth: '120px' }} text="Active" type="success" />
      ) : (
        <Badge customStyle={{ minWidth: '120px' }} text="Inactive" type="info-default" />
      ),
    omit: isLinkCatalog ? true : false
  }
];
