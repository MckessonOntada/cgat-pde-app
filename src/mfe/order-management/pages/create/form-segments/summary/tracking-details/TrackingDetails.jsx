import React from 'react';
import style from './style.module.scss';
import ModuleHeader from '@src/components/module-header';
import DetailSegment from '@src/components/DetailSegment';
import { Stepper, Heading, Tooltip, Loader } from '@mckesson/mcp-component-library';
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
  const [trackingEvents, setTrackingEvents] = React.useState([]);
  const [recentEvent, setRecentEvent] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    if (orderDetails.trackingNumber)
      OrderService.getTrackingDetails(orderDetails.accountDetails.shipToAccount.accountNumber, '7C1E52252A5E1FE0968742EEC9989854')
        .then((response) => {
          const updates = response.updates || [];
          const sorted = [...updates].sort((a, b) => new Date(b.messageDate) - new Date(a.messageDate));
          const recentEvent = sorted[0];
          setRecentEvent(recentEvent);
          function getStepIndex(recentEventCode) {
            for (const [step, codes] of Object.entries(eventCodes)) {
              if (codes.includes(recentEventCode)) return Number(step);
            }
            return null;
          }

          const stepIndex = getStepIndex(recentEvent.eventCode);
          setActiveStep(stepIndex);
          const groupedEvents = updates.reduce((acc, ev) => {
            const d = ev.messageDate.split('T')[0];
            if (!acc[d]) acc[d] = [];
            acc[d].push(ev);
            return acc;
          }, {});

          setTrackingEvents(groupedEvents);
        })

        .catch((exception) => {
          console.log(exception);
        })
        .finally(() => {
          setLoading(false);
        });
  }, [orderDetails]);

  const caption = React.useMemo(() => {
    if (!recentEvent) return 'Order is in process';

    const { eventCode, messageDate } = recentEvent;

    if (eventCode === 21) return 'The shipment has been cancelled.';
    if (eventCode === 3) return 'Order Delivered.';

    if (activeStep === 3 && messageDate) {
      const today = dayjs().startOf('day');
      const expected = dayjs(messageDate).startOf('day');

      if (expected.isSame(today)) return 'Expected today';
      if (expected.diff(today, 'day') === 1) return 'Expected tomorrow';
      return 'On the way';
    }
    if (activeStep === 1) {
      return 'Order Placed';
    }
    if (activeStep === 2) {
      return 'Order Processing';
    }

    return 'Order is in process';
  }, [recentEvent]);

  const orderSummary = React.useMemo(() => {
    if (CommonUtils.isNonEmptyObject(orderDetails) && orderDetails.id) {
      return {
        orderNumber: orderDetails.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA ? id : orderDetails.backendOrderId,
        orderDate: dayjs.utc(orderDetails.submittedOn).tz(dayjs.tz.guess()).format('MM/DD/YYYY'),
        therapy: orderDetails.therapy?.tradeName,
        orderCost: orderDetails.cost ? <span className="dollarSign">CommonUtils.formatNumberWithoutSymbol(orderDetails.cost)</span> : '-'
      };
    }

    return {};
  }, [orderDetails]);
  return (
    <FloatingDrawer open={true} anchor="right" onClose={onClose} heading={translateFn('labels.trackingDetails')}>
      {loading ? (
        <Loader variant="circular" />
      ) : (
        <div className="stack">
          <div className={style.section}>
            <div className="stack">
              {recentEvent.eventCode === 21 ? (
                <p className={`${style.heading} ${style.error}`}>{translateFn('labels.orderCancelled')}</p>
              ) : (
                <React.Fragment>
                  <p className={style.heading}>{caption}</p>
                  <OrderTrackingStepper activeIndex={activeStep} />
                </React.Fragment>
              )}
            </div>
          </div>
          <div className={style.section}>
            <div className="stack">
              <p className={style.heading}>{translateFn('labels.shippingAddress')}</p>
              <div className={style.summary}>
                <div data-direction={'row'} className={style.summaryItem}>
                  <p className={style.value}>{getAddress(orderDetails?.accountDetails?.shipToAccount?.address)}</p>
                </div>
              </div>
            </div>
          </div>
          <div className={style.section}>
            <div className="stack">
              <p className={style.heading}>{translateFn('labels.orderDetails')}</p>
              <div className={style.summary}>
                {Object.entries(orderSummary).map(([key, value]) => {
                  return (
                    <div data-direction={'row'} className={style.summaryItem}>
                      <p className={style.label}>{translateFn(`labels.${key}`)}</p>
                      <p className={style.value}>{value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className={style.section}>
            <div className="stack">
              <p className={style.heading}>{translateFn('labels.shippingStatus')}</p>
              <div className="stack">
                {Object.entries(trackingEvents).map(([day, eventGroup]) => {
                  return (
                    <div className={style.events}>
                      <p className={style.eventTitle}>{dayjs(day).format('ddd, MMM DD')}</p>
                      <div className={style.summary}>
                        {eventGroup.map((event, index) => {
                          return (
                            <div data-direction={'row'} className={style.summaryItem}>
                              <p className={style.label}>{dayjs(event.messageDate).format('hh:mm a')}</p>
                              <p className={style.value}>{event.message}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
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
