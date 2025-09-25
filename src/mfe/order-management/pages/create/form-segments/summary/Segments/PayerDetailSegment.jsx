import React from 'react';
import styles from '../Summary.module.scss';
import { Heading, Button, Tooltip } from '@mckesson/mcp-component-library';
import ModuleHeader from '@src/components/module-header';
import DetailSegment from '@src/components/DetailSegment';
import AttachmentCard from '../AttachmentCard';
import { ReactComponent as IconEditField } from '@src/assets/svg/edit-field.svg';
import { useTranslate } from '@src/translations/useTranslation';
import CommonUtils from '@src/util/CommonUtils';
import { ORDER_STAGES } from '../../Constants';

function PayerDetailsSegment({ payerDetails, showControls, onEdit }) {
  const { t } = useTranslate();
  const renderMedicalInsurance = (ins, labelKey) => {
    if (!ins) return null;

    const policyHolderName = CommonUtils.getUSFullName({
      firstName: ins?.policyHolderFirstName,
      lastName: ins?.policyHolderLastName
    });

    return (
      <div className="MCP-CardContainer">
        <ModuleHeader
          className=""
          heading={<Heading as="h3">{t(labelKey)}</Heading>}
          controls={
            showControls && (
              <Button size="md" variant="tertiary" onClick={() => onEdit(ORDER_STAGES.PAYER_DETAILS)} Icon={() => <IconEditField />}>
                {t('captions.btnEdit')}
              </Button>
            )
          }
        />
        <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-6">
          <DetailSegment
            label={t('form.label.insuranceCarrier')}
            value={
              <Tooltip body={ins?.insuranceCompanyName || '-'}>
                <span className="overflowing">{ins?.insuranceCompanyName || '-'}</span>
              </Tooltip>
            }
          />
          <DetailSegment label={t('form.label.phoneNumber')} value={ins?.insuranceCompanyPhone || '-'} />
          <DetailSegment label={t('form.label.memberNumber')} value={ins?.memberNumber || '-'} />
          <DetailSegment label={t('label.policyHolderName')} value={policyHolderName || '-'} />
          <DetailSegment label={t('labels.dob')} value={ins?.dateOfBirth || '-'} />
          <DetailSegment label={t('label.relationToPatient')} value={ins?.relationshipToPatient || '-'} />
        </div>
        {(ins?.medicalCardFront || ins?.medicalCardBack) && (
          <div className={`grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 ${styles['detail-segment-attachments-line']}`}>
            {ins?.medicalCardFront && (
              <AttachmentCard
                url={ins.medicalCardFront.url}
                fileName={ins.medicalCardFront.name}
                {...(ins.medicalCardFront.size !== undefined ? { fileSize: ins.medicalCardFront.size } : {})}
              />
            )}
            {ins?.medicalCardBack && (
              <AttachmentCard
                url={ins.medicalCardBack.url}
                fileName={ins.medicalCardBack.name}
                {...(ins.medicalCardBack.size !== undefined ? { fileSize: ins.medicalCardBack.size } : {})}
              />
            )}
          </div>
        )}
      </div>
    );
  };

  const renderPharmacyInsurance = (ins, labelKey) => {
    if (!ins) return null;

    return (
      <div className="MCP-CardContainer">
        <ModuleHeader
          className=""
          heading={<Heading as="h3">{t(labelKey)}</Heading>}
          controls={
            showControls && (
              <Button size="md" variant="tertiary" onClick={() => onEdit(ORDER_STAGES.PAYER_DETAILS)} Icon={() => <IconEditField />}>
                {t('captions.btnEdit')}
              </Button>
            )
          }
        />
        <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          <DetailSegment
            label={t('form.label.pharmacyBenefitManagerName')}
            value={
              <Tooltip body={ins?.pharmacyBenefitManagerName || '-'}>
                <span className="overflowing">{ins?.pharmacyBenefitManagerName || '-'}</span>
              </Tooltip>
            }
          />
          <DetailSegment label={t('form.label.rxMemberId')} value={ins?.rxMemberId || '-'} />
          <DetailSegment label={t('form.label.rxPcn')} value={ins?.rxPcn || '-'} />
          <DetailSegment label={t('form.label.rxBin')} value={ins?.rxBin || '-'} />
        </div>
        {(ins?.pharmacyCardFront || ins?.pharmacyCardBack) && (
          <div className={`grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2  ${styles['detail-segment-attachments-line']}`}>
            {ins?.pharmacyCardFront && (
              <AttachmentCard
                url={ins.pharmacyCardFront.url}
                fileName={ins.pharmacyCardFront.name}
                {...(ins.pharmacyCardFront.size !== undefined ? { fileSize: ins.pharmacyCardFront.size } : {})}
              />
            )}
            {ins?.pharmacyCardBack && (
              <AttachmentCard
                url={ins.pharmacyCardBack.url}
                fileName={ins.pharmacyCardBack.name}
                {...(ins.pharmacyCardBack.size !== undefined ? { fileSize: ins.pharmacyCardBack.size } : {})}
              />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {renderMedicalInsurance(payerDetails?.primaryMedicalInsurance, 'label.primarymedicalinsurance')}
      {renderMedicalInsurance(payerDetails?.secondaryMedicalInsurance, 'label.secondarymedicalinsurance')}
      {renderPharmacyInsurance(payerDetails?.primaryPharmacyInsurance, 'label.primarypharmacyinsurance')}
      {renderPharmacyInsurance(payerDetails?.secondaryPharmacyInsurance, 'label.secondarypharmacyinsurance')}
    </>
  );
}

export default PayerDetailsSegment;
