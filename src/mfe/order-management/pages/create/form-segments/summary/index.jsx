import React from 'react';
import styles from './Summary.module.scss';
import { ReactComponent as IconEditField } from '@src/assets/svg/edit-field.svg';
import ModuleHeader from '@src/components/module-header';
import { summaryData } from './__mock__';
import { useTranslate } from '@src/translations/useTranslation';

const DetailField = ({ label, value, className }) => (
    <div className={className}>
        <div className={'fieldName'}>{label}</div>
        <div className={'fieldValue'}>{value}</div>
    </div>
);

const Summary = () => {
    const { t } = useTranslate();
    const { materialDescription, price, accountDetails, adamJones, additionalDetails, therapyDetails } = summaryData;
    return (
        <div className={styles.wrapper}>
            <div className={styles.layout}>
                {/* Pricing Section */}
                <div className="MCP-panel-container">
                    <ModuleHeader
                        heading={<p className='tertiaryHeading'>{t('labels.price')}</p>}
                    />
                    <div className={`flex justify-between`}>
                        <DetailField className={"justify-start"} label={t('labels.materialDescription')} value={materialDescription} />
                        <DetailField className={`${styles.price} justify-end`} label={t('labels.orderCost')} value={price} />
                    </div>
                </div>

                {/* Account Details Section */}
                <div className="MCP-panel-container">
                    <ModuleHeader
                        heading={<p className='tertiaryHeading'>{t('labels.accountDetails')}</p>}
                        controls={
                            <button className={styles.actionLink}>
                                <IconEditField />
                                <span>{t('captions.btnEdit')}</span>
                            </button>
                        }
                    />
                    <div className={`grid grid-gap-16 grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4`}>
                        <DetailField label={t('labels.accountName')} value={accountDetails.accountName} />
                        <DetailField label={t('labels.accountNo')} value={accountDetails.accountNumber} />
                        <DetailField label={t('labels.shippingAccountName')} value={accountDetails.shippingAccountName} />
                        <DetailField label={t('labels.shippingAccountNo')} value={accountDetails.shippingAccountNumber} />
                    </div>
                </div>

                {/* Therapy Details Section */}
                <div className={styles.row}>
                    <div className={styles.col}>
                        <div className="MCP-panel-container">
                            <ModuleHeader
                                heading={<p className="tertiaryHeading">Therapy</p>}
                                controls={
                                    <button className={styles.actionLink}>
                                        <IconEditField />
                                        <span>{t('captions.btnEdit')}</span>
                                    </button>
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
                                <DetailField label={t('labels.340bPrice')} value={therapyDetails["340bPrice"]} />
                                <DetailField label={t('labels.priceUnit')} value={therapyDetails.priceUnit} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.col}>
                        <div className={styles.row}>
                            <div className={styles.col}>
                                <div className="MCP-panel-container">
                                    <ModuleHeader
                                        heading={<p className="tertiaryHeading">Adam Jones</p>}
                                        controls={
                                            <button className={styles.actionLink}>
                                                <IconEditField />
                                                <span>{t('captions.btnEdit')}</span>
                                            </button>
                                        }
                                    />
                                    <div className={`grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3`}>
                                        <DetailField label={t("labels.patientIdentifier")} value={adamJones.patientIdentifier} />
                                        <DetailField label={t("labels.gender")} value={adamJones.gender} />
                                        <DetailField label={t("labels.dob")} value={adamJones.dob} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.col}>
                                <div className="MCP-panel-container">
                                    <ModuleHeader
                                        heading={<p className='tertiaryHeading'>Additional Details</p>}
                                        controls={
                                            <button className={styles.actionLink}>
                                                <IconEditField />
                                                <span>{t('captions.btnEdit')}</span>
                                            </button>
                                        }
                                    />
                                    <div className={'grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3'}>
                                        <DetailField label={t('labels.slotNo')} value={additionalDetails.slotNo} />
                                        <DetailField label={t('labels.poNo')} value={additionalDetails.poNo} />
                                        <DetailField label={t('labels.dateOfAdministration')} value={additionalDetails.dateOfAdministration} />
                                        <DetailField label={t('labels.patientConsent')} value={additionalDetails.patientConsent} />
                                        <DetailField label={t('labels.selectVariant')} value={additionalDetails.selectVariant} />
                                        <DetailField label={t('labels.variantDescription')} value={additionalDetails.variantDescription} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Summary;
