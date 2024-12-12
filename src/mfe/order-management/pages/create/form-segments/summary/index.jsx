import React from 'react';
import styles from './Summary.module.scss';
import { ReactComponent as IconEditField } from '@src/assets/svg/edit-field.svg';
import ModuleHeader from '@src/components/module-header';
import { summaryData } from './__mock__';
import { Button, CheckboxGroup, Stepper, Heading } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import PageHeader from '@src/components/pageHeader';
import { FormList } from '../Constants';
import { useNavigate, useParams } from 'react-router-dom';

const DetailField = ({ label, value, className }) => (
  <div className={className}>
    <div className={'fieldName'}>{label}</div>
    <div className={'fieldValue'}>{value}</div>
  </div>
);

const Summary = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [checkboxOptions, setCheckboxOptions] = React.useState([
    {
      isDisabled: false,
      isChecked: false,
      label: t('messages.orderPlacementAcknowledgement'),
      value: false
    }
  ]);
  const handleChange = (value) => {
    const updatedOptions = checkboxOptions.map((item) =>
      item.value === value
        ? {
            ...item,
            isChecked: !item.isChecked
          }
        : item
    );
    setCheckboxOptions(updatedOptions);
  };

  const handleOnBackButtonClick = () => {
    //compare data change, display modal for confirmation
    navigate(`../${orderId}/additional-details`);
  };

  const handleOnSubmit = () => {
    navigate('/orders');
  };

  const handleOnCancel = () => {
    //compare data change, display modal for confirmation
    navigate('/orders');
  };

  const forms = FormList(t);
  const { materialDescription, price, accountDetails, patientDetails, additionalDetails, therapyDetails } = summaryData;
  const isAgreed = checkboxOptions[0].isChecked;
  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackButtonClick} size="md">
          {t('captions.btnBackToManageOrder')}
        </Button>
      </div>

      <PageHeader heading={<Heading as="h1">{t('headings.createNewOrder')}</Heading>} />

      <div className="MCP-module-body">
        <Stepper activeIndex={4} dividerText="of" mobileLabel={t('labels.steps')} stepHeaders={forms.map((f) => ({ label: f.label }))} />
        <div className={'MCP-module-wrapper'}>
          <ModuleHeader heading={<Heading as="h2">{t('labels.summary')}</Heading>} />
          <div className={'MCP-module-body'}>
            <div className="MCP-panel-container">
              <ModuleHeader className={styles.panelHeader} heading={<Heading as="h3">{t('labels.price')}</Heading>} />
              <div class={styles.flexPanel}>
                <DetailField label={t('labels.materialDescription')} value={materialDescription} />
                <DetailField label={t('labels.orderCost')} value={<p className={styles.price}>{price}</p>} />
              </div>
            </div>

            <div className={'grid grid-gap-16 grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2'}>
              <div className="MCP-panel-container">
                <ModuleHeader
                  className={styles.panelHeader}
                  heading={<Heading as="h3">{t('labels.therapy')}</Heading>}
                  controls={
                    <Button size="md" variant="tertiary" onClick={() => navigate(`../edit-order/${orderId}`)} Icon={() => <IconEditField />}>
                      {t('captions.btnEdit')}
                    </Button>
                  }
                />
                <div className={`grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3`}>
                  <DetailField label={t('labels.nationalDrugCode')} value={therapyDetails.nationalDrugCode} />
                  <DetailField label={t('labels.UDI')} value={therapyDetails.uDI} />
                  <DetailField label={t('labels.distributionChannel')} value={therapyDetails.distributionsChannel} />
                  <DetailField label={t('labels.salesOrganization')} value={therapyDetails.salesOrganization} />
                  <DetailField label={t('labels.netPrice')} value={therapyDetails.netPrice} />
                  <DetailField label={t('labels.contractPrice')} value={therapyDetails.contractPrice} />
                  <DetailField label={t('labels.wacPrice')} value={therapyDetails.wACPrice} />
                  <DetailField label={t('labels.regularPrice')} value={therapyDetails.regularPrice} />
                  <DetailField label={t('labels.340bPrice')} value={therapyDetails['340bPrice']} />
                  <DetailField label={t('labels.priceUnit')} value={therapyDetails.priceUnit} />
                </div>
              </div>
              <div className="MCP-module-body">
                <div className="MCP-panel-container">
                  <ModuleHeader
                    className={styles.panelHeader}
                    heading={<Heading as="h3">{t('labels.accountDetails')}</Heading>}
                    controls={
                      <Button size="md" variant="tertiary" onClick={() => navigate(`../${orderId}/accounts`)} Icon={() => <IconEditField />}>
                        {t('captions.btnEdit')}
                      </Button>
                    }
                  />
                  <div className={`grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2`}>
                    <DetailField label={t('labels.accountName')} value={accountDetails.accountName} />
                    <DetailField label={t('labels.accountNo')} value={accountDetails.accountNumber} />
                    <DetailField label={t('labels.shippingAccountName')} value={accountDetails.shippingAccountName} />
                    <DetailField label={t('labels.shippingAccountNo')} value={accountDetails.shippingAccountNumber} />
                  </div>
                </div>
                <div className="MCP-panel-container">
                  <ModuleHeader
                    className={styles.panelHeader}
                    heading={<Heading as="h3">{patientDetails.name}</Heading>}
                    controls={
                      <Button size="md" variant="tertiary" onClick={() => navigate(`../${orderId}/patient`)} Icon={() => <IconEditField />}>
                        {t('captions.btnEdit')}
                      </Button>
                    }
                  />
                  <div className={`grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3`}>
                    <DetailField label={t('labels.patientIdentifier')} value={patientDetails.patientIdentifier} />
                    <DetailField label={t('labels.gender')} value={patientDetails.gender} />
                    <DetailField label={t('labels.dob')} value={patientDetails.dob} />
                  </div>
                </div>
              </div>
            </div>

            <div className="MCP-panel-container">
              <ModuleHeader
                className={styles.panelHeader}
                heading={<Heading as="h3">{t('labels.additionalDetails')}</Heading>}
                controls={
                  <Button size="md" variant="tertiary" onClick={() => navigate(`../${orderId}/additional-details`)} Icon={() => <IconEditField />}>
                    {t('captions.btnEdit')}
                  </Button>
                }
              />
              <div className={'grid grid-gap-16 grid-cols-1 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6'}>
                <DetailField label={t('labels.slotNo')} value={additionalDetails.slotNo} />
                <DetailField label={t('labels.poNo')} value={additionalDetails.poNo} />
                <DetailField label={t('labels.dateOfAdministration')} value={additionalDetails.dateOfAdministration} />
                <DetailField label={t('labels.selectVariant')} value={additionalDetails.selectVariant} />
                <DetailField label={t('labels.variantDescription')} value={additionalDetails.variantDescription} />
                <DetailField label={t('labels.patientConsent')} value={additionalDetails.patientConsent} />
              </div>
            </div>
          </div>
          <div className="agreement-checkbox-control">
            <CheckboxGroup
              id={'default'}
              name="order-agreement"
              items={checkboxOptions.map((item) => ({
                ...item,
                onChange: () => handleChange(item.value)
              }))}
              size="md"
            />
          </div>
          <div className="controls">
            <Button size={'md'} variant="secondary">
              {t('captions.btnPrintSummary')}
            </Button>
            <Button size={'md'} variant="secondary" onClick={handleOnCancel}>
              {t('captions.btnBack')}
            </Button>
            <Button size={'md'} variant="primary" type="submit" disabled={!isAgreed} onClick={handleOnSubmit}>
              {t('captions.btnSubmitOrder')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
