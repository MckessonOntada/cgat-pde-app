import { Button, Heading, IconButton } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { ReactComponent as DeleteIcon } from '@src/assets/svg/bin-red.svg';
import CommonFilters from '@src/components/Filters';
import Alert from '@src/components/cgat-alert/Alert';
import { FooterContext } from '@src/components/footer/FooterContext';
import ModuleHeader from '@src/components/module-header';
import TableHeading from '@src/components/tableHeading/TableHeading';
import { useFilters } from '@src/mfe/core-config/admin/manage-providers/context/TableContext';
import { useTranslate } from '@src/translations/useTranslation';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DiagnosisCodeTable from './DiagnosisCodeTable';
import { List, ListItem } from './List';
import SelectedTherapyListControl from './SelectedTherapyListControl';
import style from './style.module.scss';

function AddDiagnosisCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const { controlRef } = React.useContext(FooterContext);
  const { filters, applyFilters, clearFilters } = useFilters();
  const { t: translateFn } = useTranslate();
  const [alert, setAlert] = React.useState(null);
  const [selectedCodes, setSelectedCodes] = React.useState([
    {
      code: 'C91.02',
      description: 'Acute lymphoblasts leukemia in relapse'
    },
    {
      code: 'C91.02',
      description: 'Acute lymphoblasts leukemia in relapse applicable in severe cases'
    }
  ]);
  const [selectedTherapy, setSelectedTherapy] = React.useState(null);

  React.useEffect(() => {
    const { selectedTherapy } = location.state || {};

    if (!selectedTherapy) {
      navigate('../../');
    }
    setSelectedTherapy(selectedTherapy);
  }, []);

  const handleOnSubmit = () => {};
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
            <DiagnosisCodeTable omitColumns={['last-updated-on', 'action']} />
            <div className={style['list']}>
              <List title={'Selected Codes'}>
                {selectedCodes.map((item = {}, index) => {
                  const { code, description } = item;
                  return (
                    <ListItem key={index}>
                      <div className={style['dx-code-card-with-action']}>
                        <label>{`${code}(${description})`}</label>
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

export default AddDiagnosisCode;
