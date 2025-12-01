import { Button, Heading, IconButton } from '@mckesson/mcp-component-library';
import MaterialService from '@src/api/commonService/MaterialService';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { ReactComponent as DeleteIcon } from '@src/assets/svg/bin-red.svg';
import CommonFilters from '@src/components/Filters';
import Alert from '@src/components/cgat-alert/Alert';
import { FooterContext } from '@src/components/footer/FooterContext';
import { List, ListItem } from '@src/components/list';
import ModuleHeader from '@src/components/module-header';
import TableHeading from '@src/components/tableHeading/TableHeading';
import { TableProvider, useFilters } from '@src/mfe/core-config/admin/manage-providers/context/TableContext';
import { useTranslate } from '@src/translations/useTranslation';
import CommonUtils from '@src/util/CommonUtils';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DiagnosisCodeTable from './DiagnosisCodeTable';
import SelectedTherapyListControl from './SelectedTherapyListControl';
import style from './style.module.scss';

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
    const { therapy } = location.state || {};

    setSelectedTherapy({
      id: therapy.materialNumber,
      name: therapy.tradeName,
      description: therapy.materialDescription
    });
  }, []);

  const handleOnSubmit = () => {
    if (!selectedCodes || selectedCodes.length === 0) {
      setAlert({
        type: 'error',
        description: translateFn('errorMessages.selectDiagnosisCodesToSave')
      });
      return;
    }

    const codeIds = selectedCodes.map((code) => code.id);

    MaterialService.addDiagnosisCode(selectedTherapy.id, codeIds)
      .then((_response) => {
        navigate('./../../', {
          state: {
            alert: {
              type: 'success',
              description: translateFn('successMessage.nCodesAdded', { n: codeIds.length })
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
  const removeFromBucket = (id) => {
    const newList = selectedCodes.filter((item) => item.id != id);
    setSelectedCodes(newList);
  };
  const handleOnCancel = () => {
    navigate('./../..');
  };
  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button
          className="back-button-control"
          variant="tertiary"
          Icon={() => <IconArrowLeft />}
          onClick={() => navigate('./..', { state: location.state })}
          size="md">
          {translateFn('button.caption.backToDcConfiguration')}
        </Button>
      </div>
      <div className="MCP-module-body">
        <ModuleHeader
          heading={<Heading as="h1">{translateFn('module.title.addDiagnosisCodes')}</Heading>}
          controls={selectedTherapy && <SelectedTherapyListControl onChange={() => navigate('./../..')} therapies={[selectedTherapy]} />}
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
          <React.Fragment>
            <ModuleHeader heading={<TableHeading heading={translateFn('table.title.selectDiagnosisCodes')} />} />
          </React.Fragment>
          <div className={'table-selection-wrapper'}>
            <div className="table">
              <DiagnosisCodeTable {...{ selectedCodes, setSelectedCodes }} omitColumns={['last-updated-on', 'action']} />
            </div>
            <div className="list">
              <List title={translateFn('list.title.selectedCodes')}>
                {selectedCodes.map((item = {}, index) => {
                  const { code, longDescription } = item;
                  return (
                    <ListItem key={index}>
                      <div className={style['dx-code-card-with-action']}>
                        <label>{`${code}(${longDescription})`}</label>
                        <div className="styled-icon-button error-button">
                          <IconButton
                            size="lg"
                            textButton={true}
                            color={'error'}
                            variant={'tertiary'}
                            Icon={DeleteIcon}
                            onClick={() => removeFromBucket(item.id)}
                          />
                        </div>
                      </div>
                    </ListItem>
                  );
                })}
              </List>
            </div>
          </div>
        </div>
        <div className="footer-wrapper" ref={controlRef}>
          <div className="controls footer-controls">
            <Button size="md" variant="secondary" onClick={handleOnCancel}>
              {translateFn('Cancel')}
            </Button>
            <Button size="md" variant="primary" type="submit" onClick={handleOnSubmit}>
              {translateFn('button.caption.addCodes')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function () {
  const location = useLocation();
  const navigate = useNavigate();
  const { therapy } = location.state || {};
  if (!therapy || therapy.id) {
    navigate('./../../');
  }

  return (
    <TableProvider fetchFn={(requestParams) => MaterialService.getUnassignedDiagnosisCodes(therapy.materialNumber, requestParams)}>
      <AddDiagnosisCode />
    </TableProvider>
  );
}
