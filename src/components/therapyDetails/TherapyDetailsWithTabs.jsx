import React, { useEffect, useState } from 'react';
import styles from './assets/TherapyDetails.module.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { useQuery } from 'react-query';
import {
  Loader,
  Heading,
  Button,
  TabList,
  IconButton
} from '@mckesson/mcp-component-library';
import { ReactComponent as arrow_right } from '@src/assets/image/arrow_right_small.svg';
import { ReactComponent as arrow_down } from '@src/assets/image/arrow_down_small.svg';
import OrderService from '@src/api/commonService/OrderService';
import FloatingDrawer from '@src/components/floating-drawer';

export const THERAPY_TABS = {
  BUY_AND_BILL: 'BUY & BILL',
  SP: 'SP'
};

function TherapyDetailsWithTabs({
  therapyId,
  onClose,
  onSelect,
  buyAndBillTherapyData,
  spTherapyData,
  showFooter = true,
  heading
}) {
  const { t } = useTranslate();
  const [selectedTab, setSelectedTab] = useState(THERAPY_TABS.BUY_AND_BILL);
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const getTabs = () => {
    const tabs = [];

    if (buyAndBillTherapyData) {
      tabs.push({
        id: THERAPY_TABS.BUY_AND_BILL,
        configName: 'BUY & BILL',
        isActiveTab: selectedTab === THERAPY_TABS.BUY_AND_BILL,
        sequence: 1,
        labelForMobile: 'BUY AND BILL'
      });
    }

    if (spTherapyData) {
      tabs.push({
        id: THERAPY_TABS.SP,
        configName: 'SP',
        isActiveTab: selectedTab === THERAPY_TABS.SP,
        sequence: 2,
        labelForMobile: 'SP'
      });
    }

    return tabs;
  };

  const handleExpandCard = () => {
    setIsCardExpanded(!isCardExpanded);
  };

  const {
    isLoading,
    data: therapyDetails = {},
    error,
    refetch
  } = useQuery({
    queryKey: ['therapy', therapyId, selectedTab],
    queryFn: async () => {
      if (selectedTab === THERAPY_TABS.SP) {
        return await OrderService.getTherapyDetailsById(therapyId);
      }
      return await OrderService.getTherapyDetailsById(therapyId);
    },
    enabled: Boolean(therapyId),
    refetchOnWindowFocus: false
  });

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
      controls={
        showFooter && (
          <div className="controls">
            <Button
              label={t('captions.btnCancel')}
              onClick={onClose}
              variant="secondary"
              size="md"
              aria-label={t('captions.cancel')}
            />
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
        <div className="customTab">
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
          <div className={styles.body}>
            {therapyDetails && (
              <>
                {selectedTab === THERAPY_TABS.SP ? (
                  <div className={styles.cardToggleWrapper}>
                    <div className={styles.cardHeader}>
                      <IconButton
                        label={
                          therapyDetails?.productName || 'SP Therapy Details'
                        }
                        size="lg"
                        iconButton={false}
                        textButton={true}
                        Icon={isCardExpanded ? arrow_down : arrow_right}
                        onClick={handleExpandCard}></IconButton>

                      {/* <Button
                        variant="tertiary"
                        type="button"
                        onClick={handleExpandCard}
                        className={styles.toggleBtn}>
                        <img
                          src={isCardExpanded ? arrow_down : arrow_right}
                          alt="toggle-icon"
                        />
                        {therapyDetails?.productName || 'SP Therapy Details'}
                      </Button> */}
                      {/* <Button
                        variant="tertiary"
                        type="button"
                        onClick={handleExpandCard}
                        size="lg">
                        {therapyDetails?.productName || 'SP Therapy Details'}
                      </Button> */}
                    </div>

                    {isCardExpanded && (
                      <DetailsPanel
                        details={therapyDetails}
                        handleSelect={handleSelect}
                        onClose={onClose}
                        therapyData={spTherapyData}
                        refetch={refetch}
                      />
                    )}
                  </div>
                ) : (
                  <DetailsPanel
                    details={therapyDetails}
                    handleSelect={handleSelect}
                    onClose={onClose}
                    therapyData={buyAndBillTherapyData}
                    refetch={refetch}
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
    fields.map(({ label, value }) => (
      <DetailItem key={label} label={t(label)} value={details[value] || '-'} />
    ));
  return (
    <div className={styles.detailsPanel}>
      <div className={styles.drawerBodyContent}>
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
