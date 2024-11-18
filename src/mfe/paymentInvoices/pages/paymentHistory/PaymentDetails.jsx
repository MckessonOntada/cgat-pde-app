import React, { useState } from "react";
import { paymentDetails } from "../../mockData/PaymentHistoryData";
import styles from "../../../order-management/pages/create/form-segments/therapy-selection/TherapyDetails.module.scss"
import { ReactComponent as IconClose } from '@src/assets/svg/closeIcon.svg';
import { Button } from '@mckesson/mcp-component-library';

function PaymentDetails() {
    const [data, setData] = useState(paymentDetails)
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h6>Payment Details</h6>
                <button onClick={() => { }}>
                    <IconClose />
                </button>
            </div>
            <div className={styles.body}>
                {data.map((detailItem, index) => {
                    return <div className={styles.detailsPanel}>
                        <p className={styles.panelHeading}>{detailItem.label}</p>
                        {detailItem?.Children?.map((subItem) => (
                            <div className={styles.detailItem}>
                                <p className={styles.fieldName}>{subItem.label}</p>
                                <p className={styles.fieldValue}>{subItem.value}</p>
                            </div>
                        ))}
                    </div>
                })}
            </div>
            <div className={styles.header}>
                <Button
                    variant="secondary"
                    onClick={() => { }}
                    size="md"
                >
                    Print Summary
                </Button>
                <Button
                    variant="primary"
                    onClick={() => { }}
                    size="md"
                >
                    Download Excel
                </Button>
            </div>
        </div>
    )
}
export default PaymentDetails