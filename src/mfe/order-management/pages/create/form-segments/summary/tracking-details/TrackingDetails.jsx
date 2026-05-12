import React from 'react';
import style from './style.module.scss';
import ModuleHeader from '@src/components/module-header';
import DetailSegment from '@src/components/DetailSegment';
import { Alert, Stepper, Heading, Tooltip, Loader } from '@mckesson/mcp-component-library';
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
  const [detailsPanelOpen, setDetailsPanelOpen] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  React.useEffect(() => {
    if (!orderDetails.requestId || !orderDetails.wayBillNumber) {
      setHasError(true);
    }
  }, []);
  if (hasError) {
    return null;
  }
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
                  <Tooltip body={orderDetails.wayBillNumber}>
                    <Link className="MCP-table-link" onClick={() => setDetailsPanelOpen(true)}>
                      {orderDetails.wayBillNumber}
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
  const [deliveryTitle, setDeliveryTitle] = React.useState(null);
  React.useEffect(() => {
    if (orderDetails.requestId)
      OrderService.getTrackingDetails(orderDetails?.accountDetails?.shipToAccount?.accountNumber, orderDetails?.requestId)
        .then((response) => {
          const updates = response.updates || [];
          if (!updates.length) {
            setRecentEvent(null);
            setActiveStep(null);
            setDeliveryTitle(translateFn('labels.orderIsInProgress'));
            setTrackingEvents({});
            return;
          }

          const sorted = [...updates].sort((a, b) => new Date(b.messageDate) - new Date(a.messageDate));

          const recentEvent = sorted[0];
          setRecentEvent(recentEvent);

          const eventCode = recentEvent.eventCode;
          const stepIndex = Number(Object.entries(eventCodes).find(([_, codes]) => codes.includes(eventCode))?.[0]) || null;

          setActiveStep(stepIndex);

          const deliveryEvent = updates.filter((ev) => ev.deliveryDate).sort((a, b) => new Date(b.deliveryDate) - new Date(a.deliveryDate))[0];

          const deliveryDate = deliveryEvent?.deliveryDate || null;

          let caption = translateFn('labels.orderIsInProgress');

          if (eventCode === 21) caption = translateFn('labels.shipmentCancelled');
          else if (eventCode === 3) caption = translateFn('labels.orderDelivered');
          else if (deliveryDate) {
            const today = dayjs().startOf('day');
            const expected = dayjs(deliveryDate).startOf('day');

            if (expected.isSame(today)) caption = translateFn('labels.expectedToday');
            else if (expected.diff(today, 'day') === 1) caption = translateFn('expectedTomorrow');
            else caption = translateFn('labels.expectedDeliveryDate', { deliveryDate: dayjs(deliveryDate).format('ddd, MMM DD') });
          }

          setDeliveryTitle(caption);

          const groupedEvents = sorted.reduce((acc, ev) => {
            const dateKey = ev.messageDate.split('T')[0];
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(ev);
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

  const orderSummary = React.useMemo(() => {
    if (CommonUtils.isNonEmptyObject(orderDetails) && orderDetails.id) {
      return {
        orderNumber: orderDetails.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA ? orderDetails.id : orderDetails.backendOrderId,
        orderDate: dayjs.utc(orderDetails.submittedOn).tz(dayjs.tz.guess()).format('MM/DD/YYYY'),
        therapy: orderDetails.therapy?.tradeName
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
              {recentEvent?.eventCode === 21 ? (
                <p className={`${style.heading} ${style.error}`}>{translateFn('labels.orderCancelled')}</p>
              ) : (
                <React.Fragment>
                  <p className={style.heading}>{deliveryTitle}</p>
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
                    <div key={key} data-direction={'row'} className={style.summaryItem}>
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
                    <div key={day} className={style.events}>
                      <p className={style.eventTitle}>{dayjs(day).format('ddd, MMM DD')}</p>
                      <div className={style.summary}>
                        {eventGroup.map((event, index) => {
                          return (
                            <div key={index} data-direction={'row'} className={style.summaryItem}>
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
