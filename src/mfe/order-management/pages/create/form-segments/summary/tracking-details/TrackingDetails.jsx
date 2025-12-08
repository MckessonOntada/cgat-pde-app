import React from 'react';
import style from './style.module.scss';
import ModuleHeader from '@src/components/module-header';
import DetailSegment from '@src/components/DetailSegment';
import { Stepper, Heading, Tooltip } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import FloatingDrawer from '@src/components/floating-drawer';
import { Link } from 'react-router-dom';

function TrackingDetails(props) {
  const { trackingNumber = '-', orderId } = props;
  const { t: translateFn } = useTranslate();
  const [detailsPanelOpen, setDetailsPanelOpen] = React.useState(true);

  return (
    <React.Fragment>
      <div className={style.wrapper}>
        <div className="MCP-CardContainer">
          <ModuleHeader heading={<Heading as="h3">{translateFn('labels.trackingDetails')}</Heading>} />
          <div className={`grid grid-gap-16 grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2`}>
            <DetailSegment
              label={translateFn('labels.trackingNumber')}
              noTooltip={true}
              value={
                <div className="overflowing">
                  <Tooltip body={trackingNumber}>
                    <Link className="MCP-table-link" onClick={() => setDetailsPanelOpen(true)}>
                      {trackingNumber}
                    </Link>
                  </Tooltip>
                </div>
              }
            />
          </div>
        </div>
      </div>
      {detailsPanelOpen && <DetailsPanel trackingNumber={trackingNumber} onClose={() => setDetailsPanelOpen(false)} />}
    </React.Fragment>
  );
}

function DetailsPanel({ trackingNumber, onClose }) {
  const { t: translateFn } = useTranslate();
  return (
    <FloatingDrawer open={true} anchor="right" onClose={onClose} heading={translateFn('labels.trackingDetails')}>
      <div className={style.section}>
        <div className="stack">
          <p className={style.heading}>{translateFn('labels.expectedTomorrow')}</p>
          <OrderTrackingStepper />
        </div>
      </div>
      <div className={style.section}>
        <div className="stack">
          <p className={style.heading}>{translateFn('labels.shippingAddress')}</p>
        </div>
      </div>
      <div className={style.section}>
        <div className="stack">
          <p className={style.heading}>{translateFn('labels.orderDetails')}</p>
        </div>
      </div>
      <div className={style.section}>
        <div className="stack">
          <p className={style.heading}>{translateFn('labels.shippingStatus')}</p>
        </div>
      </div>
    </FloatingDrawer>
  );
}

const stepHeaders = [
  'orderTracking.stepper.orderPlaced',
  'orderTracking.stepper.orderProcessing',
  'orderTracking.stepper.onTheWay',
  'orderTracking.stepper.delivered'
];

function OrderTrackingStepper({ activeIndex = 0 }) {
  const { t: translateFn } = useTranslate();
  const translatedHeaders = React.useMemo(() => stepHeaders.map((h) => ({ label: translateFn(h) })), []);
  return <Stepper size="small" activeIndex={activeIndex} dividerText="of" stepHeaders={translatedHeaders} />;
}

export default TrackingDetails;
