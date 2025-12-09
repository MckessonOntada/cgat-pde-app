import React from 'react';
import style from './style.module.scss';
import ModuleHeader from '@src/components/module-header';
import DetailSegment from '@src/components/DetailSegment';
import { Stepper, Heading, Tooltip } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import FloatingDrawer from '@src/components/floating-drawer';
import { Link } from 'react-router-dom';
import OrderService from '@src/api/commonService/OrderService';
import CommonUtils, { getAddress } from '@src/util/CommonUtils';
import dayjs from 'dayjs';
import { CHANNEL_TYPE } from '../../Constants';

function TrackingDetails(props) {
  const { orderDetails } = props;
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
                  <Tooltip body={orderDetails.trackingNumber}>
                    <Link className="MCP-table-link" onClick={() => setDetailsPanelOpen(true)}>
                      {orderDetails.trackingNumber}
                    </Link>
                  </Tooltip>
                </div>
              }
            />
          </div>
        </div>
      </div>
      {detailsPanelOpen && <DetailsPanel orderDetails={orderDetails} onClose={() => setDetailsPanelOpen(false)} />}
    </React.Fragment>
  );
}

const eventCodes = {
  1: [],
  2: [0, 1],
  3: [10, 40, 27, 26, 39, 4, 19, 16, 15, 22],
  4: [],
  5: [3]
};

function DetailsPanel({ orderDetails, onClose }) {
  const { t: translateFn } = useTranslate();
  const [activeStep, setActiveStep] = React.useState(0);
  React.useEffect(() => {
    if (orderDetails.trackingNumber)
      OrderService.getTrackingDetails(orderDetails.accountDetails.shipToAccount.accountNumber, '7C1E52252A5E1FE0968742EEC9989854')
        .then((response) => {
          console.log(response);
          if (Array.isArray(response.orders) && response.orders[0]) {
            setActiveStep(2);
          }
        })
        .catch((exception) => {
          console.log(exception);
        });
  }, [orderDetails]);

  const orderSummary = React.useMemo(() => {
    if (CommonUtils.isNonEmptyObject(orderDetails) && orderDetails.id) {
      return {
        orderNumber: orderDetails.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA ? id : orderDetails.backendOrderId,
        orderDate: dayjs.utc(orderDetails.submittedOn).tz(dayjs.tz.guess()).format('MM/DD/YYYY'),
        therapy: orderDetails.therapy?.tradeName,
        orderCost: CommonUtils.formatNumberWithoutSymbol(orderDetails.cost)
      };
    }

    return {};
  }, [orderDetails]);
  return (
    <FloatingDrawer open={true} anchor="right" onClose={onClose} heading={translateFn('labels.trackingDetails')}>
      <div className="stack">
        <div className={style.section}>
          <div className="stack">
            <p className={style.heading}>{translateFn('labels.expectedTomorrow')}</p>
            <OrderTrackingStepper activeIndex={2} />
          </div>
        </div>
        <div className={style.section}>
          <div className="stack">
            <p className={style.heading}>{translateFn('labels.shippingAddress')}</p>
            <p>{getAddress(orderDetails?.accountDetails?.shipToAccount?.address)}</p>
          </div>
        </div>
        <div className={style.section}>
          <div className="stack">
            <p className={style.heading}>{translateFn('labels.orderDetails')}</p>
            <div className={style.summary}>
              {Object.entries(orderSummary).map(([key, value]) => {
                return (
                  <div data-direction={'row'} className={style.summaryItem}>
                    <label>{translateFn(`labels.${key}`)}</label>
                    <span>{value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className={style.section}>
          <div className="stack">
            <p className={style.heading}>{translateFn('labels.shippingStatus')}</p>
          </div>
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
