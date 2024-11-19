import React from 'react';
import styles from './PatientDetails.module.scss';
import { Button } from '@mckesson/mcp-component-library';
import ModuleHeader from '@src/components/module-header';
import { useTranslate } from '@src/translations/useTranslation';

const PatientDetails = () => {
    const { t } = useTranslate();
    const accountDetails = {
        accountNumber: "11699387",
        shipToAccountNumber: "1122332",
        therapyDescription: "MPB HEMLIBRA 105MG/0.7ML SDV"
    }
    return (
        <div className={styles.wrapper}>
            <div className="MCP-panel-container">
                <div className={styles.sect}>
                    <div className={`${styles.row}`}>
                        <div className={`${styles.col} ${styles.detailSegment}`}>
                            <div className={'fieldName'}>{t('labels.orderByAccountNumber')}</div>
                            <div className={'fieldValue'}>{accountDetails.accountNumber}</div>
                        </div>
                        <div className={`${styles.col} ${styles.detailSegment}`}>
                            <div className={'fieldName'}>{t('labels.shipToAccountNumber')}</div>
                            <div className={`${'fieldValue'} ${styles.price}`}>{accountDetails.shipToAccountNumber}</div>
                        </div>
                        <div className={`${styles.col} ${styles.detailSegment}`}>
                            <div className={'fieldName'}>{t('labels.therapyDescription')}</div>
                            <div className={`${'fieldValue'} ${styles.price}`}>{accountDetails.therapyDescription}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="MCP-panel-container">
                
            </div>
            <ModuleHeader
                controls={
                    <div className="controls">
                        <Button size="md" variant="secondary">{t('captions.cancel')}</Button>
                        <Button size="md" variant="primary">{t('captions.btnSaveAndContinue')}</Button>
                    </div>
                }
            />
        </div>
    )
}
export default PatientDetails;