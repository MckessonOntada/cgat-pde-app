import React from 'react';
import styles from './OrderPlacementStatus.module.scss';
import { Button } from '@mckesson/mcp-component-library';
import { ReactComponent as IconTick } from '@src/assets/svg/tick-circle-filled.svg';
import Breadcrumb from './Breadcrumb';
const OrderPlacementStatus = () => {
    return(
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div className={styles.status}>
                    <div className={styles.emblem}>
                        <IconTick />
                    </div>
                    <div className={styles.content}>
                        <p className={styles.title}>Order Submitted!</p>
                        <p className={styles.subtitle}>Your order has been submitted successfully and is now pending for approval.</p>
                    </div>
                </div>
            </div>
            <div className={styles.body}>
                <div className="MCP-panel-container">
                    <div className="grid grid-gap-16 grid-cols-6 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6">
                        <div>1</div>
                        <div style={{flexGrow: 1}}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Mollitia, exercitationem laborum repudiandae quam ullam quod eos temporibus sed perspiciatis quis non eveniet quae maiores nisi sint eum officia? Dolor, facilis?</div>
                    </div>
                    <div className="grid grid-gap-16 grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                        <div>1</div>
                        <div>2</div>
                        <div>3</div>
                        <div>4</div>
                        <div>5</div>
                    </div>
                </div>
                <div className="MCP-panel-container">
                    <div className="grid grid-gap-16 grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                        <div>What to expect next?</div>
                        <div>
                            <Breadcrumb />
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.controls}>
                <Button variant="secondary">Print Summary</Button>
                <Button variant="primary">Go to orders</Button>
            </div>
        </div>
    )
}

export default OrderPlacementStatus;