import React from 'react';
import styles from './OrderStatus.module.scss';
import { Button, Heading } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { ReactComponent as IconTick } from '@src/assets/svg/tick-circle-filled.svg';
import StatusBreadcrumb from './StatusBreadcrumb';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '@src/components/module-header';
import { useParams } from 'react-router-dom';

const details = {
    orderId: '12345',
    materialDescription: 'VENOFER 20MG/ML 5ML SDV PF NR',
    patientName: 'Adam Jones',
    patientIdentifier: '5682532',
    dateOfBirth: '11/19/1997',
    gender: 'Male',
    orderCost: '45,000'
}
const DetailField = ({ label, value, className }) => (
    <div className={className}>
        <div className={'fieldName'}>{label}</div>
        <div className={'fieldValue'}>{value}</div>
    </div>
);
const OrderStatus = () => {
    const { t } = useTranslate();
    const { orderId } = useParams();
    return (
        <div className={'MCP-module-wrapper'}>
            <div>
                <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={() => {}} size="md">
                    {t('captions.btnBackToManageOrder')}
                </Button>
            </div>
            <ModuleHeader
                className={styles.customModuleHeader}
                heading={
                    <div className={styles.flex}>
                        <div className={styles.emblem}>
                            <IconTick />
                        </div>
                        <div className={styles.content}>
                            <Heading as={'h1'}>{t('headings.orderSubmitted')}</Heading>
                            <Heading as={'h3'}>{t('messages.orderSuccessApprovalPending')}</Heading>
                        </div>
                    </div>
                }
            />
            <div className={'MCP-module-body'}>
                <div className="MCP-panel-container">
                    <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5">
                        <DetailField label={t('labels.orderId')} value={details.orderId} />
                        <DetailField label={t('labels.materialDescription')} value={details.materialDescription} />
                    </div>
                    <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5">
                        <DetailField label={t('labels.patientName')} value={details.patientName} />
                        <DetailField label={t('labels.patientIdentifier')} value={details.patientIdentifier} />
                        <DetailField label={t('labels.dob')} value={details.dateOfBirth} />
                        <DetailField label={t('labels.gender')} value={details.gender} />
                        <DetailField className={styles.orderCost} label={t('labels.orderCost')} value={<p className={styles.price}>{details.orderCost}</p>} />
                    </div>
                </div>
                <div className="MCP-panel-container">
                    <div className={styles.flex}>
                        <h4 className={styles.customSecondaryHeading}>{t('labels.whatToExpect')}</h4>
                        <div className={styles.statusBreadcrumb}>
                            <StatusBreadcrumb />
                        </div>
                    </div>
                </div>
            </div>
            <div className={'controls'}>
                <Button size="md" variant="secondary">{t('captions.btnPrintSummary')}</Button>
                <Button size="md" variant="primary">{t('captions.btnGoToOrders')}</Button>
            </div>
        </div>
    )
}

export default OrderStatus;