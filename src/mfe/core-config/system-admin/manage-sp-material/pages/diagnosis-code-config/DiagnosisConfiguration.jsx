import { Button, Heading } from '@mckesson/mcp-component-library';
import MaterialService from '@src/api/commonService/MaterialService';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import CommonFilters from '@src/components/Filters';
import Alert from '@src/components/cgat-alert/Alert';
import ModuleHeader from '@src/components/module-header';
import TableHeading from '@src/components/tableHeading/TableHeading';
import { TableProvider, useFilters, useTable, usePagination } from '@src/context/TableContext';
import { useTranslate } from '@src/translations/useTranslation';
import CommonUtils from '@src/util/CommonUtils';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { routeConstants } from '../../routes/constants';
import DiagnosisCodeTable from './DiagnosisCodeTable';
import SelectedTherapyListControl from './SelectedTherapyListControl';

function DiagnosisConfiguration() {
  const navigate = useNavigate();
  const location = useLocation();
  const { filters, applyFilters, clearFilters } = useFilters();
  const { refreshTable } = useTable();
  const { changePage, pagination } = usePagination();
  const { t: translateFn } = useTranslate();
  const [alert, setAlert] = React.useState(null);
  const [selectedCodes, setSelectedCodes] = React.useState([]);
  const [selectedTherapy, setSelectedTherapy] = React.useState(null);

  React.useEffect(() => {
    const { therapy } = location.state || {};
    setSelectedTherapy({
      id: therapy.materialNumber,
      name: therapy.tradeName,
      description: therapy.materialDescription
    });
  }, []);

  React.useEffect(() => {
    const { alert, ...rest } = location.state || {};
    if (alert) {
      setAlert(location.state.alert);
      navigate(location.pathname, { state: rest });
    }
  }, [location]);

  const handleOnDelete = (ids) => {
    if (!ids || !Array.isArray(ids)) return;

    MaterialService.removeAssignedDiagnosisCode(selectedTherapy.id, ids)
      .then((_response) => {
        const newTotalElements = pagination.totalElements - selectedCodes.length;
        const newTotalPages = Math.ceil(newTotalElements / pagination.pageSize);

        if (pagination.pageNo > newTotalPages && pagination.pageNo > 1) {
          setSelectedCodes([]);
          changePage(newTotalPages);
        } else {
          setSelectedCodes([]);
          refreshTable();
        }
        setAlert({
          description: translateFn('successMessage.nCodesRemoved', { n: ids.length }),
          type: 'success'
        });
      })
      .catch((error) => {
        const statusCode = error?.response?.status;
        let description = translateFn('error.default');
        if (!(statusCode >= 400 && statusCode < 600)) description = CommonUtils.getAxiosErrorMessage(error);

        setAlert({
          description,
          type: 'error'
        });
      });
  };

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button
          className="back-button-control"
          variant="tertiary"
          Icon={() => <IconArrowLeft />}
          onClick={() => navigate('../', { state: { selectedTherapies: selectedTherapy } })}
          size="md">
          {translateFn('button.caption.backToSpMaterial')}
        </Button>
      </div>
      <div className="MCP-module-body">
        <ModuleHeader
          heading={<Heading as="h1">{translateFn('module.title.dxConfiguration')}</Heading>}
          controls={selectedTherapy && <SelectedTherapyListControl onChange={() => navigate('../')} therapies={[selectedTherapy]} />}
        />
        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
        <div className="MCP-panel-container">
          <div className="MCP-panel-container">
            <CommonFilters
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
              additionalFilters={[]}
              searchPlaceholder={translateFn('placeholder.diagnosisCodesTable')}
            />
          </div>
          <TableHeading
            heading={translateFn('table.title.diagnosisCodeListing')}
            controls={
              <Button size="md" onClick={() => navigate(routeConstants.ADD_DIAGNOSIS_CODES, { state: location.state })}>
                {translateFn('button.caption.addDiagnosisCodes')}
              </Button>
            }
            secondaryView={selectedCodes && selectedCodes.length > 0}
            secondaryViewHeading={translateFn('table.ribbon.nItemsSelected', { n: selectedCodes.length })}
            secondaryViewControls={
              <div className="controls">
                <Button onClick={() => handleOnDelete(selectedCodes.map((code) => code.id))} size="sm" variant="secondary">
                  {translateFn('button.caption.remove')}
                </Button>
              </div>
            }
          />

          <DiagnosisCodeTable {...{ selectedCodes, setSelectedCodes, onDelete: handleOnDelete }} />
        </div>
      </div>
    </div>
  );
}

export default function () {
  const location = useLocation();
  const navigate = useNavigate();
  const { therapy } = location.state || {};
  if (!therapy || !therapy.id) {
    navigate('../');
  }

  return (
    <TableProvider
      defaultFilters={{ showLinkedCodes: true }}
      fetchFn={(requestParams) => MaterialService.getAssignedDiagnosisCodes(therapy.materialNumber, requestParams)}>
      <DiagnosisConfiguration />
    </TableProvider>
  );
}
