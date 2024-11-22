import React from 'react';
import styles from './OrderPlacementStatus.module.scss';
import { Button } from '@mckesson/mcp-component-library';
import { ReactComponent as IconTick } from '@src/assets/svg/tick-circle-filled.svg';
import Breadcrumb from './Breadcrumb';
import { useTranslate } from '@src/translations/useTranslation';

const OrderPlacementStatus = () => {
    const { t } = useTranslate();
    return(
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div className={styles.status}>
                    <div className={styles.emblem}>
                        <IconTick />
                    </div>
                    <div className={styles.content}>
                        <p className={styles.title}>{t('headings.orderSubmitted')}</p>
                        <p className={styles.subtitle}>{t('messages.orderSuccessApprovalPending')}</p>
                    </div>
                </div>
            </div>
            <div className={styles.body}>
                <div className="MCP-panel-container">
                    <div className="grid grid-gap-16 grid-cols-6 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6">
                        <div style={{flexGrow: 1}}></div>
                    </div>
                    <div className="grid grid-gap-16 grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                    </div>
                </div>
                <div className="MCP-panel-container">
                    <div className="grid grid-gap-16 grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                        <div>{t('labels.whatToExpect')}</div>
                        <div>
                            <Breadcrumb />
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.controls}>
                <Button variant="secondary">{t('captions.btnPrintSummary')}</Button>
                <Button variant="primary">{t('captions.btnGoToOrders')}</Button>
            </div>
        </div>
    )
}

export default OrderPlacementStatus;