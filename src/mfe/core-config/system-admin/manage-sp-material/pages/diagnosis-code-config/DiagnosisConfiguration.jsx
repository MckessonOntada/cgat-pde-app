import React from 'react';
import { Heading, Button, Loader } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useNavigate } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import CommonFilters from '@src/components/Filters';
import Alert from '@src/components/cgat-alert/Alert';
import ModuleHeader from '@src/components/module-header';
import style from './style.module.scss';
import TableHeading from '@src/components/tableHeading/TableHeading';
import DiagnosisCodeTable from './DiagnosisCodeTable';
import { routeConstants } from '../../routes/constants';

function DiagnosisConfiguration() {
  const navigate = useNavigate();
  const { t: translateFn } = useTranslate();
  const [alert, setAlert] = React.useState(null);
  const [selectedCodes, setSelectedCodes] = React.useState([]);

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button
          className="back-button-control"
          variant="tertiary"
          Icon={() => <IconArrowLeft />}
          onClick={() => navigate('/system-admin/config/manage-sp-material', { state: { isAssociatedAccount: true } })}
          size="md">
          {translateFn('Back to sp material master')}
        </Button>
      </div>
      <div className="MCP-module-body">
        <ModuleHeader
          heading={<Heading as="h1">{translateFn('Dx Configuration')}</Heading>}
          controls={<SelectedTherapyListControl onChange={() => {}} therapies={[{ name: 'Custom selected therapy name' }]} />}
        />
        <div className="MCP-panel-container">
          <div className="MCP-panel-container">
            <CommonFilters
              onApplyFilters={() => {}}
              onClearFilters={() => {}}
              additionalFilters={[]}
              searchPlaceholder={translateFn('manageSPAccount.filters.searchPlaceholder')}
            />
          </div>
          {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
          <React.Fragment>
            {selectedCodes.length > 0 ? (
              <div>Ribbon Options</div>
            ) : (
              <ModuleHeader
                heading={<TableHeading heading={translateFn('Diagnosis Code Listing')} />}
                controls={<Button onClick={() => navigate(routeConstants.ADD_DIAGNOSIS_CODES)}>{translateFn('Add Diagnosis Codes')}</Button>}
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

const SelectedTherapyListControl = ({ therapies = [], onChange }) => {
  if (!therapies || !Array.isArray(therapies) || therapies.length === 0) return null;

  return (
    <div className={style['therapy-selection-panel']}>
      <label className={style['therapies']}>
        Therapies:&nbsp;
        <span>{therapies.map((therapy) => therapy.name).join(', ')}</span>
      </label>
      <Button variant="tertiary" onClick={onChange}>
        Change
      </Button>
    </div>
  );
};
