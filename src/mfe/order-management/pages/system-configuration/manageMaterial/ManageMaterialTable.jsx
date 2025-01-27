import React from 'react';
import { Loader, CustomDataTable, Button } from '@mckesson/mcp-component-library';
import EmptyDataTable from '@src/components/EmptyTable';
import { useTranslate } from '@src/translations/useTranslation';
import { useManageMaterial } from '@src/mfe/order-management/context/ManageMaterailContext';

import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { Link } from 'react-router-dom';
import FloatingDrawer from '@src/components/floating-drawer';
import TherapyDetails from '@src/components/therapyDetails/TherapyDetails';

function ManageMaterialTable({ ...props }) {
  const { t } = useTranslate();
  const { data, paginationConfig, setPageNumber, applySort, isFetching, isError, selectedMaterials, setSelectedMaterials } =
    useManageMaterial();
  const [open, setOpen] = React.useState(false);

  const getindeterminate = () => {
    const allDataIncluded = data.every((invoice) =>
      selectedMaterials.some((includedInvoice) => includedInvoice.materialNumber === invoice.materialNumber)
    );
    return allDataIncluded;
  };

  const renderCheckBox = (row, index) => {
    return (
      <input
        data-testid="rowcheckbox"
        type="checkbox"
        id={'checkbox' + row?.id}
        disabled={isCheckboxDisabled(row)}
        onChange={() => handleRowSelected(row)}
        checked={isChecked(row)}
        ref={(el) => {
          if (el) {
            el.indeterminate =
              row.id === 'ALL_PATIENTS_' + paginationConfig.pageNumber && selectedMaterials.length > 0 && !getindeterminate();
          }
        }}
      />
    );
  };

  const isChecked = (row) => {
    if (row.id === 'ALL_PATIENTS_' + paginationConfig.pageNumber) {
      return getindeterminate();
    }
    let availableRow = selectedMaterials.find((item) => item.materialNumber === row?.materialNumber);
    return !!availableRow;
  };

  const isAllChecked = () => {
    return selectedMaterials.length === data.length;
  };

  const isCheckboxDisabled = (row) => {
    let isDisbled = row.id === 'ALL_PATIENTS_' + paginationConfig.pageNumber && !CommonUtils.isNonEmptyArray(data);
    return isDisbled;
  };

  const handleRowSelected = (data) => {
    if (data.id === 'ALL_PATIENTS_' + paginationConfig.pageNumber) {
      handleHeaderCheck(data);
    } else {
      handleIndividualCheck(data);
    }
  };

  const handleIndividualCheck = (data) => {
    if (selectedMaterials.find((item) => item.materialNumber === data?.materialNumber)) {
      setSelectedMaterials(selectedMaterials.filter((item) => item.materialNumber !== data?.materialNumber));
      return;
    }
    setSelectedMaterials([...selectedMaterials, ...[data]]);
  };

  const handleHeaderCheck = () => {
    if (isAllChecked()) {
      setSelectedMaterials([]);
    } else {
      if (paginationConfig.pageNumber === 1) {
        setSelectedMaterials(data);
      } else {
        const allDataIncluded = data.every((invoice) =>
          selectedMaterials.some((includedInvoice) => includedInvoice.materialNumber === invoice.materialNumber)
        );
        if (!allDataIncluded) {
          setSelectedMaterials([...selectedMaterials, ...data]);
        } else {
          setSelectedMaterials(selectedMaterials.filter((item) => !data.some((invoice) => invoice.materialNumber === item.materialNumber)));
        }
      }
    }
  };

  const columns = [
    {
      id: 'checkbox',
      name: renderCheckBox({ id: 'ALL_ITEMS_' + paginationConfig.pageNumber }),
      sortable: false,
      cell: (row, index) => renderCheckBox(row, index),
      selector: (row) => row['Material Number'],
      width: '50px'
    },
    {
      name: t('manageMaterial.table.materialNumber'),
      id: 'materialNumber',
      selector: (row) => row.materialNumber,
      sortable: true,
      wrap: true,
      maxWidth: '175px',
      cell: (props) => (
        <div className="cellEllipse">
          <Link
            style={{ color: '#007bff', fontWeight: '600', textDecoration: 'none' }}
            onClick={() => {
              setOpen(!open);
            }}>
            {props?.materialNumber || '-'}
          </Link>
        </div>
      )
    },
    {
      name: t('manageMaterial.table.materialDescription'),
      id: 'materialDescription',
      selector: (row) => row.materialDescription,
      sortable: true,
      wrap: true,
      cell: (props) => <div>{props?.materialDescription || '-'}</div>
    },
    {
      name: t('manageMaterial.table.nationalDrugCode'),
      id: 'nationalDrugCode',
      selector: (row) => row.nationalDrugCode,
      sortable: true,
      wrap: true,
      maxWidth: '150px',
      cell: (props) => <div>{props?.nationalDrugCode || '-'}</div>
    },
    {
      name: t('manageMaterial.table.strength'),
      id: 'strength',
      selector: (row) => row.strength,
      sortable: false,
      wrap: true,
      maxWidth: '140px',
      cell: (props) => <div>{props?.strength || '-'}</div>
    },
    {
      name: t('manageMaterial.table.dosage'),
      id: 'dosage',
      selector: (row) => row.dosage,
      sortable: false,
      wrap: true,
      maxWidth: '120px',
      cell: (props) => <div>{props?.dosage || '-'}</div>
    }
  ];

  const handleSort = (selectedColumn, sortDirection) => {
    if (selectedColumn.id) applySort({ sortBy: selectedColumn.id, sortOrder: sortDirection });
  };

  const handleChangePage = (e, newPage) => {
    setPageNumber(newPage);
  };

  return (
    <React.Fragment>
      {selectedMaterials.length > 0 && (
        <div className="selected-invoices">
          <div className="label">{`${selectedMaterials.length} ${t('manageMaterial.table.header.text')}`}</div>
          <Button
            variant="secondary"
            onClick={() => {
              setOpen(!open);
            }}
            size="sm">
            {t('manageMaterial.table.header.button.configure')}
          </Button>
        </div>
      )}
      <CustomDataTable
        id="manage-material-table"
        type="normal"
        columns={columns}
        data={data || []}
        onSortIconClick={handleSort}
        currentPage={paginationConfig.pageNumber}
        totalPageCount={paginationConfig.totalPages}
        pagination={true}
        totalRocords={paginationConfig.totalElements}
        handleChangePage={handleChangePage}
        recordsPerPage={paginationConfig.pageSize}
        paginationTotalRecorsMessage={t('manageMaterial.table.pagination.totalRecords')}
        paginationRecordsPerPageMessage={t('manageMaterial.table.pagination.perPage')}
        progressPending={isFetching}
        noDataComponent={
          <EmptyDataTable
            isLoading={isFetching}
            error={isError ? t('manageMaterial.table.error') : null}
            image={EmptyDataImage}
            heading={t('manageMaterial.table.emptyData')}
            description={t('manageMaterial.table.emptyDataDescription')}
          />
        }
        progressComponent={
          <div
            style={{
              alignItems: 'center',
              border: '1px solid #ccc',
              display: 'flex',
              height: '350px',
              justifyContent: 'center'
            }}>
            <Loader variant="circular" />
          </div>
        }
      />
      {open && (
        <FloatingDrawer open={true} anchor="right" onClose={() => setOpen(!open)}>
          <TherapyDetails isMaterialConfiguration={true} therapyId={2} onClose={() => setOpen(!open)} />
        </FloatingDrawer>
      )}
    </React.Fragment>
  );
}

export default ManageMaterialTable;
