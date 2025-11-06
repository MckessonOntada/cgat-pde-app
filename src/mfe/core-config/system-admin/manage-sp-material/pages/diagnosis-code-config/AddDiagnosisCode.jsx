import { Button, Heading, IconButton } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { ReactComponent as DeleteIcon } from '@src/assets/svg/bin-red.svg';
import CommonFilters from '@src/components/Filters';
import Alert from '@src/components/cgat-alert/Alert';
import { FooterContext } from '@src/components/footer/FooterContext';
import ModuleHeader from '@src/components/module-header';
import TableHeading from '@src/components/tableHeading/TableHeading';
import { TableProvider, useFilters } from '@src/mfe/core-config/admin/manage-providers/context/TableContext';
import { useTranslate } from '@src/translations/useTranslation';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DiagnosisCodeTable from './DiagnosisCodeTable';
import { List, ListItem } from './List';
import SelectedTherapyListControl from './SelectedTherapyListControl';
import style from './style.module.scss';
import MaterialService from '@src/api/commonService/MaterialService';
import CommonUtils from '@src/util/CommonUtils';

function AddDiagnosisCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const { controlRef } = React.useContext(FooterContext);
  const { filters, applyFilters, clearFilters } = useFilters();
  const { t: translateFn } = useTranslate();
  const [alert, setAlert] = React.useState(null);
  const [selectedCodes, setSelectedCodes] = React.useState([]);
  const [selectedTherapy, setSelectedTherapy] = React.useState(null);

  React.useEffect(() => {
    const { selectedTherapy } = location.state || {};

    if (!selectedTherapy) {
      navigate('../../');
    }
    setSelectedTherapy(selectedTherapy);
  }, []);

  const handleOnSubmit = () => {
    if (!selectedCodes || selectedCodes.length === 0) return;

    const codeIds = selectedCodes.map((code) => code.id);

    MaterialService.addDiagnosisCode(selectedTherapy.id, codeIds)
      .then((_response) => {
        navigate('../../', {
          state: {
            alert: {
              type: 'success',
              description: translateFn(`${codeIds.length} Diagnosis codes has been successfully added.`)
            }
          }
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
  const handleOnCancel = () => {};
  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={() => navigate('../', { state: null })} size="md">
          {translateFn('Back to Manage DC Configuration')}
        </Button>
      </div>
      <div className="MCP-module-body">
        <ModuleHeader
          heading={<Heading as="h1">{translateFn('Add Diagnosis Codes')}</Heading>}
          controls={selectedTherapy && <SelectedTherapyListControl onChange={() => navigate('../../')} therapies={[selectedTherapy]} />}
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
            <ModuleHeader heading={<TableHeading heading={translateFn('Select Diagnosis Code')} />} />
          </React.Fragment>
          <div className={style['diagnosis-code-bucket-wrapper']}>
            <DiagnosisCodeTable {...{ selectedCodes, setSelectedCodes }} omitColumns={['last-updated-on', 'action']} />
            <List title={'Selected Codes'}>
              {selectedCodes.map((item = {}, index) => {
                const { code, longDescription } = item;
                return (
                  <ListItem key={index}>
                    <div className={style['dx-code-card-with-action']}>
                      <label>{`${code}(${longDescription})`}</label>
                      <div className="styled-icon-button error-button">
                        <IconButton size="lg" textButton={true} color={'error'} variant={'tertiary'} Icon={DeleteIcon} onClick={() => {}} />
                      </div>
                    </div>
                  </ListItem>
                );
              })}
            </List>
          </div>
        </div>
        <div className="footer-wrapper" ref={controlRef}>
          <div className="controls footer-controls">
            <Button size="md" variant="secondary" onClick={handleOnCancel}>
              {translateFn('Cancel')}
            </Button>
            <Button size="md" variant="primary" type="submit" onClick={handleOnSubmit}>
              {translateFn('Add Codes')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function () {
  const location = useLocation();
  const { selectedTherapy } = location.state || {};
  if (!selectedTherapy) {
    navigate('../');
  }

  return (
    <TableProvider fetchFn={(requestParams) => MaterialService.getUnassignedDiagnosisCodes(selectedTherapy.id, requestParams)}>
      <AddDiagnosisCode />
    </TableProvider>
  );
}
