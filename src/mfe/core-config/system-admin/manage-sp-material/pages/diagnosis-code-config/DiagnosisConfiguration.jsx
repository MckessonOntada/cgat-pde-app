import { Button, Heading } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import CommonFilters from '@src/components/Filters';
import Alert from '@src/components/cgat-alert/Alert';
import ModuleHeader from '@src/components/module-header';
import TableHeading from '@src/components/tableHeading/TableHeading';
import { useFilters } from '@src/mfe/core-config/admin/manage-providers/context/TableContext';
import { useTranslate } from '@src/translations/useTranslation';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { routeConstants } from '../../routes/constants';
import DiagnosisCodeTable from './DiagnosisCodeTable';
import SelectedTherapyListControl from './SelectedTherapyListControl';

function DiagnosisConfiguration() {
  const navigate = useNavigate();
  const location = useLocation();
  const { filters, applyFilters, clearFilters } = useFilters();
  const { t: translateFn } = useTranslate();
  const [alert, setAlert] = React.useState(null);
  const [selectedCodes, setSelectedCodes] = React.useState([]);
  const [selectedTherapy, setSelectedTherapy] = React.useState(null);

  React.useEffect(() => {
    const { selectedTherapy } = location.state || {};

    if (!selectedTherapy) {
      navigate('../');
    }
    setSelectedTherapy(selectedTherapy);
  }, []);

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button
          className="back-button-control"
          variant="tertiary"
          Icon={() => <IconArrowLeft />}
          onClick={() => navigate('../', { state: { selectedTherapies: selectedTherapy } })}
          size="md">
          {translateFn('Back to sp material master')}
        </Button>
      </div>
      <div className="MCP-module-body">
        <ModuleHeader
          heading={<Heading as="h1">{translateFn('Dx Configuration')}</Heading>}
          controls={selectedTherapy && <SelectedTherapyListControl onChange={() => navigate('../')} therapies={[selectedTherapy]} />}
        />
        <div className="MCP-panel-container">
          <div className="MCP-panel-container">
            <CommonFilters
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
              additionalFilters={[]}
              searchPlaceholder={translateFn('Search by ICD-10 code, description')}
            />
          </div>
          {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
          <React.Fragment>
            {selectedCodes.length > 0 ? (
              <div>Ribbon Options</div>
            ) : (
              <ModuleHeader
                heading={<TableHeading heading={translateFn('Diagnosis Code Listing')} />}
                controls={
                  <Button onClick={() => navigate(routeConstants.ADD_DIAGNOSIS_CODES, { state: location.state })}>{translateFn('Add Diagnosis Codes')}</Button>
                }
              />
            )}
          </React.Fragment>
          <DiagnosisCodeTable />
        </div>
      </div>
    </div>
  );
}

export default DiagnosisConfiguration;
