import { useTranslate } from '@src/translations/useTranslation';
import React from 'react';
import { Link } from 'react-router-dom';
import { CustomDataTable } from '@mckesson/mcp-component-library';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';

function CatalogDataTable(props) {
  const { t } = useTranslate();

  const columns = [
    {
      name: 'SAP Material ID',
      //   id: 'billNumber',
      selector: (row) => {},
      wrap: true,
      minWidth: '112px',
      cell: (props) => (
        <div className="cellEllipse">
          <Link style={{ color: 'var(--brand-color-primary)', fontWeight: '600', textDecoration: 'none' }}>{`${
            props?.sapMaterialId || ''
          }`}</Link>
        </div>
      )
    },
    {
      id: '',
      name: 'Material Description',
      selector: (row) => {},
      minWidth: '100px',
      wrap: true,
      cell: (props) => <div className="cellEllipse">{props?.description || '-'}</div>
    },
    {
      id: '',
      name: 'NDC',
      selector: (row) => {},
      minWidth: '120px',
      wrap: true,
      cell: (props) => <div>{props?.ndc || '-'}</div>
    },
    {
      id: '',
      name: 'Dist Channel',
      selector: (row) => {},
      minWidth: '120px',
      wrap: true,
      cell: (props) => <div>{props?.distChannel || '-'}</div>
    },
    {
      id: '',
      name: 'Variant',
      selector: (row) => {},
      minWidth: '120px',
      wrap: true,
      cell: (props) => <div>{props?.variant || '-'}</div>
    },
    {
      id: '',
      name: 'Sold to',
      selector: (row) => {},
      minWidth: '120px',
      wrap: true,
      cell: (props) => <div>{props?.soldToAccount || '-'}</div>
    },
    {
      id: '',
      name: 'Ship to',
      selector: (row) => {},
      minWidth: '120px',
      wrap: true,
      cell: (props) => <div>{props?.shipToAccount || '-'}</div>
    }
  ];
  return (
    <div>
      <CustomDataTable
        id="my-data-table"
        type="normal"
        columns={columns}
        data={[
          {
            sapMaterialId: '324352',
            description: 'MPB HC UDRSFC GTCSTS',
            ndc: 'N5012638701',
            distChannel: 'MPB',
            variant: 'Type A',
            soldToAccount: '116322',
            shipToAccount: '936236'
          }
        ]}
        noDataComponent={
          <EmptyDataTable image={EmptyDataImage} heading={'No Catalogs Found'} description={'Please try changing organization '} />
        }
      />
    </div>
  );
}
export default CatalogDataTable;
