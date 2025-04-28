import React, { useEffect, useState } from 'react';
import styles from './assets/TherapyDetails.module.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { useQuery } from 'react-query';
import { Loader, Heading, Button, TabList, IconButton } from '@mckesson/mcp-component-library';
import { ReactComponent as arrow_right } from '@src/assets/image/arrow_right_small.svg';
import { ReactComponent as arrow_down } from '@src/assets/image/arrow_down_small.svg';
import OrderService from '@src/api/commonService/OrderService';
import FloatingDrawer from '@src/components/floating-drawer';

export const THERAPY_TABS = {
  BUY_AND_BILL: 'BUY & BILL',
  SP: 'SPECIALITY_PHARMA'
};

function TherapyDetailsWithTabs({
  therapyId,
  onClose,
  onSelect,
  buyAndBillTherapyConstants,
  spTherapyConstants,
  showFooter = true,
  heading
}) {
  const { t } = useTranslate();
  const [selectedTab, setSelectedTab] = useState(THERAPY_TABS.BUY_AND_BILL);
  const [isCardExpanded, setIsCardExpanded] = useState(true);
  const {
    isLoading,
    data: therapyDetails = {},
    error
  } = useQuery({
    queryKey: ['therapy', therapyId],
    queryFn: async () => {
      return await OrderService.getTherapyDetailsByCrossWalkId(therapyId);
    },
    enabled: Boolean(therapyId),
    refetchOnWindowFocus: false
  });

  const showBuyAndBillTab = therapyDetails?.primaryTherapyChannelType === THERAPY_TABS.BUY_AND_BILL;
  const showSPTab =
    therapyDetails?.primaryTherapyChannelType === THERAPY_TABS.SP ||
    (therapyDetails?.primaryTherapyChannelType === THERAPY_TABS.BUY_AND_BILL &&
      therapyDetails?.isCrosswalked &&
      therapyDetails?.crosswalkedTherapies?.length > 0);

  useEffect(() => {
    if (therapyDetails?.primaryTherapyChannelType) {
      if (therapyDetails.primaryTherapyChannelType === THERAPY_TABS.SP) {
        setSelectedTab(THERAPY_TABS.SP);
      } else if (therapyDetails.primaryTherapyChannelType === THERAPY_TABS.BUY_AND_BILL) {
        setSelectedTab(THERAPY_TABS.BUY_AND_BILL);
      }
    }
  }, [therapyDetails]);

  const getTabs = () => {
    const tabs = [];

    if (showBuyAndBillTab) {
      tabs.push({
        id: THERAPY_TABS.BUY_AND_BILL,
        configName: t('labels.BuyNBill'),
        isActiveTab: selectedTab === THERAPY_TABS.BUY_AND_BILL,
        sequence: 1,
        labelForMobile: t('labels.BuyNBill')
      });
    }

    if (showSPTab) {
      tabs.push({
        id: THERAPY_TABS.SP,
        configName: t('labels.SP'),
        isActiveTab: selectedTab === THERAPY_TABS.SP,
        sequence: 2,
        labelForMobile: t('labels.SP')
      });
    }

    return tabs;
  };

  const handleExpandCard = (id) => {
    setIsCardExpanded((prevId) => (prevId === id ? null : id));
  };

  const handleSelect = () => {
    if (onSelect && therapyDetails) {
      onSelect(therapyDetails);
      onClose();
    }
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
            <Button
              label={t('captions.btnSelecttherapy')}
              onClick={handleSelect}
              variant="primary"
              size="md"
              aria-label={t('captions.selectAccount')}
            />
          </div>
        )
      }>
      <div className={styles.wrapper}>
        <div className="customTab" style={{ padding: '0px 16px' }}>
          <TabList
            options={getTabs()}
            alignment="left"
            onTabClick={(tab) => setSelectedTab(tab.id)}
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
                  <DetailsPanel
                    details={therapyDetails}
                    handleSelect={handleSelect}
                    onClose={onClose}
                    therapyData={buyAndBillTherapyConstants}
                  />
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
  const renderDetails = (fields, details) =>
    fields.map(({ label, value }) => <DetailItem key={label} label={t(label)} value={details[value] || '-'} />);
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
