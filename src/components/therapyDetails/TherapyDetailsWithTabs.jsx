import React, { useEffect, useState } from 'react';
import styles from './assets/TherapyDetails.module.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { useQuery } from 'react-query';
import { Loader, Heading, Button, TabList, IconButton } from '@mckesson/mcp-component-library';
import { ReactComponent as arrow_right } from '@src/assets/image/arrow_right_small.svg';
import { ReactComponent as arrow_down } from '@src/assets/image/arrow_down_small.svg';
import OrderService from '@src/api/commonService/OrderService';
import FloatingDrawer from '@src/components/floating-drawer';
import CommonUtils from '@src/util/CommonUtils';
import { current } from '@reduxjs/toolkit';
import { CHANNEL_TYPE } from '@src/mfe/order-management/pages/create/form-segments/Constants';
import Alert from '../cgat-alert/Alert';

export const THERAPY_TABS = {
  BUY_AND_BILL: 'BUY_AND_BILL',
  SP: 'SPECIALITY_PHARMA'
};

function TherapyDetailsWithTabs({
  trade,
  channelType = 'ALL',
  therapyId,
  onClose,
  onSelect,
  buyAndBillTherapyConstants,
  spTherapyConstants,
  showFooter = true,
  heading
}) {
  const { t } = useTranslate();
  const [therapyTabs, setTherapyTabs] = useState(() => {
    if (!therapyId) return [];

    const therapyTabs = therapyId.split(',').map((id, index) => {
      return {
        id: `details-by-therapy-id-${id}`,
        configName: id,
        isActiveTab: index === 0,
        sequence: index,
        labelForMobile: 'labels.tabs.submittedBuyAndBill'
      };
    });

    return therapyTabs;
  });
  const [selectedTab, setSelectedTab] = useState(null);
  const [isCardExpanded, setIsCardExpanded] = useState(true);
  const [therapyDetails, setTherapyDetails] = useState(null);
  const [alert, setAlert] = React.useState(null);

  const {
    data: details,
    isLoading,
    error
  } = useQuery({
    queryKey: ['therapyDetailsByTrade', trade],
    queryFn: async () => OrderService.getTherapyDetailsByTradeName(trade, channelType),
    select: (data) => data.map(({ ndcNumber, ...rest }) => ({ ndc: ndcNumber, ...rest })),
    onSuccess: (data) => {
      if (data && CommonUtils.isNonEmptyArray(data)) {
        const therapyTabs = data.map((item, index) => ({
          id: `details-by-therapy-id-${item.id}`,
          therapyId: item.id,
          configName: item.materialDescription,
          isActiveTab: index === 0,
          sequence: index,
          labelForMobile: 'labels.tabs.submittedBuyAndBill'
        }));
        setTherapyTabs(therapyTabs);
        setSelectedTab(therapyTabs[0]);
      } else {
        setAlert({
          kind: 'info',
          description: 'No therapy details found for the selected trade.',
          showTitle: false,
          showCloseIcon: false
        });
      }
    },
    onError: (err) => {
      const message = CommonUtils.getAxiosErrorMessage(err);
      setAlert({
        type: 'error',
        description: message,
        showTitle: false
      });
    },
    enabled: Boolean(trade),
    refetchOnWindowFocus: false
  });

  React.useEffect(() => {
    if (selectedTab && selectedTab.therapyId) {
      const currentTherapyDetails = details?.find((item) => item.id === selectedTab.therapyId);
      setTherapyDetails(currentTherapyDetails);
    }
  }, [selectedTab]);

  const handleExpandCard = (id) => {
    setIsCardExpanded((prevId) => (prevId === id ? null : id));
  };

  const handleSelect = () => {
    if (onSelect && therapyDetails) {
      onSelect(therapyDetails);
      onClose();
    }
  };

  const handleOnTabChange = (selectedTab) => {
    const newTabs = therapyTabs.map((tab) => ({
      ...tab,
      isActiveTab: tab.id === selectedTab.id
    }));
    setTherapyTabs(newTabs);
    setSelectedTab(selectedTab);
  };

  return (
    <FloatingDrawer
      open={true}
      anchor="right"
      onClose={onClose}
      heading={heading}
      bodyPadding="var(--spacing-03) 0px var(--spacing-16)"
      controls={
        showFooter && (
          <div className="controls">
            <Button label={t('captions.btnCancel')} onClick={onClose} variant="secondary" size="md" aria-label={t('captions.cancel')} />
            <Button label={t('captions.btnSelecttherapy')} onClick={handleSelect} variant="primary" size="md" aria-label={t('captions.selectAccount')} />
          </div>
        )
      }>
      <div className={styles.wrapper}>
        <div className="customTab" style={{ padding: '0px 16px' }}>
          {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
        </div>
      </div>
      <div className={styles.wrapper}>
        <div className="customTab" style={{ padding: '0px 16px' }}>
          <TabList
            options={therapyTabs}
            alignment="left"
            onTabClick={handleOnTabChange}
            showShadow={false}
            variant={'text'}
            useAsButton={true}
            aria-label={t('controls.ariaLabels.orderTabList')}
          />
        </div>
        {isLoading ? (
          <Loader variant="circular" />
        ) : (
          <div className={`${styles.body}`}>
            {therapyDetails && (
              <>
                {selectedTab === THERAPY_TABS.SP ? (
                  <div className={styles.cardToggleWrapper}>
                    {therapyDetails?.primaryTherapyChannelType === THERAPY_TABS.BUY_AND_BILL &&
                    therapyDetails?.isCrosswalked &&
                    therapyDetails?.crosswalkedTherapies?.length > 0 ? (
                      therapyDetails.crosswalkedTherapies.map((therapy, index) => (
                        <div key={therapy.id || index} className={styles.therapyCard}>
                          <div className={`${styles.cardHeader} ${index === 0 ? styles.cardHeaderWithTopBorder : ''}`}>
                            <IconButton
                              label={therapy?.materialDescription}
                              size="lg"
                              iconButton={false}
                              textButton={true}
                              Icon={isCardExpanded === therapy.id ? arrow_down : arrow_right}
                              onClick={() => handleExpandCard(therapy.id)}
                            />
                          </div>

                          {isCardExpanded === therapy.id && <DetailsPanel details={therapy} therapyData={spTherapyConstants} />}
                        </div>
                      ))
                    ) : (
                      <>
                        <div className={`${styles.cardHeader} ${styles.cardHeaderWithTopBorder}`}>
                          <IconButton
                            label={therapyDetails?.materialDescription}
                            size="lg"
                            iconButton={false}
                            textButton={true}
                            Icon={isCardExpanded === therapyDetails.id ? arrow_down : arrow_right}
                            onClick={() => handleExpandCard(therapyDetails.id)}
                          />
                        </div>

                        {isCardExpanded === therapyDetails.id && <DetailsPanel details={therapyDetails} therapyData={spTherapyConstants} />}
                      </>
                    )}
                  </div>
                ) : (
                  <DetailsPanel details={therapyDetails} handleSelect={handleSelect} onClose={onClose} therapyData={buyAndBillTherapyConstants} />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </FloatingDrawer>
  );
}

function DetailsPanel({ details, therapyData }) {
  const { t } = useTranslate();
  const renderDetails = (fields, details) => fields.map(({ label, value }) => <DetailItem key={label} label={t(label)} value={details[value] || '-'} />);
  return (
    <div className={styles.detailsPanel}>
      <div className={`${styles.drawerBodyContent} ${styles.bodyPadding}`}>
        {therapyData?.map((section, index) => (
          <div key={index}>
            <Heading as="h3" className={styles.details}>
              {t(section.sectionHeading)}
            </Heading>
            <div>{renderDetails(section.sectionData, details)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  const { t } = useTranslate();
  return (
    <>
      <div className={styles.detailItem}>
        <p className={styles.leftContent}>{label}</p>
        <p className={styles.rightContent}>{value || '-'}</p>
      </div>
    </>
  );
}

export default TherapyDetailsWithTabs;
