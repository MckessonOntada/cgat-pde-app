import React, { useEffect, useState } from 'react';
import { RadioGroup } from '@mckesson/mcp-component-library';
import { useLocation, useNavigate } from 'react-router-dom'; 
import CommonFilters from '@src/components/Filters';
import { useTranslate } from '@src/translations/useTranslation';
import { useManagerQuestionnaire } from '../../context/ManageQuestionnaireContext';
import { Alert, Button, Heading } from '@mckesson/mcp-component-library';
import ModuleHeader from '@src/components/module-header';

export default function index() { 
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { applyFilters, clearFilters,refetchCatalogData,refetchMaterialData ,refetchAccountData,setEntity,entity} = useManagerQuestionnaire();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const location = useLocation();
  const [alertDescription, setAlertDescription] = useState('');
  const [alert, setAlert] = useState(null);
  const [masterEntity, setMasterEntity] = useState('');
 const  {isMaterial =false, isCatalog= false, isAccount= false } = location.state || {};  
  
  const handleNavigation = () => { navigate("map-questionnaire", { state: { value: entity } });};
  useEffect(() => {
      if (isMaterial) {
        refetchMaterialData();
        setIsAlertVisible(true);
        setAlertDescription(t('messages.confirmation.success_config_material')); 
        setAlert({ type: 'success' });
      }
    }, [location.state, navigate]);

    const handleAlertClose = () => {
      setIsAlertVisible(false); 
      navigate(location.pathname, { replace: true, state: { ...location.state, isMaterial: false, isCatalog: false, isAccount: false } });
    };

    
  return (
    <><div className="MCP-module-wrapper"> 
      <ModuleHeader
        heading={<Heading as="h1">
          {t('headings.manageQuestionnaire')}
        </Heading>} />
      {isAlertVisible && <Alert description={alertDescription} onClose={handleAlertClose} type={alert.type} duration={10000} />}
      <div className="MCP-panel-container">
        <div className="MCP-panel-container">
          <CommonFilters
            onApplyFilters={applyFilters}
            onClearFilters={clearFilters}
            additionalFilters={[]}
            searchPlaceholder={t(
             'controls.placeholder.material.search'
            )} />
        </div>
         
      </div> 
    </div><div>
        <h1>Manage Questionnaire</h1>
        <RadioGroup
          caption="Select an option"
          direction="column"
          id="radioGroup"
          items={[
            {
              isDisabled: false,
              label: 'Material',
              value: 'Material'
            },
            {
              isDisabled: false,
              label: 'Catalog',
              value: 'Catalog'
            },
            {
              isDisabled: false,
              label: 'Account',
              value: 'Account'
            }
          ]}
          onChangeValue={(value) => {
            console.log('Selected value:', value);
            setEntity(value);
            setMasterEntity(value);
          } }
          onOtherTextChange={() => { } }
          onSubRadioFieldChange={() => { } }
          radioBtnWidth="auto"
          value={masterEntity} />

        <br />
        <button onClick={handleNavigation}>Go to Another Page</button>
      </div></>
  );
}
