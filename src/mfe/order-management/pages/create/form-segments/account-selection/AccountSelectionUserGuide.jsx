import React, { useState } from 'react';
import styles from './AccountSelectionUserGuide.module.scss';
import { RadioGroup, Button, Loader, Heading, Alert } from '@mckesson/mcp-component-library';
import { ReactComponent as IconClose } from '@src/assets/svg/cross.svg';
import AccountCard from './AccountCard';
import { useTranslate } from '@src/translations/useTranslation';
import { useQuery } from 'react-query';
import OrderService from '@src/api/commonService/OrderService';
import { serializeParams } from '@src/util/ApiUtils';
import FloatingDrawer from '@src/components/floating-drawer';

const AccountSelectionUserGuide = ({ therapyId, onClose, onSubmit, openDrawer }) => {
  const { t } = useTranslate();
  const [selectedProgram, setProgram] = useState('');
  const [selectedChannel, setChannel] = useState('');
  const [account, setAccount] = useState(null);
  const [alertMsg, setAlertMsg] = useState(false);

  const {
    isFetching: isFetchingConfig,
    data: programChannelConfig,
    isError,
    error
  } = useQuery({
    queryKey: ['order', 'therapy', therapyId, 'program-channel-config'],
    queryFn: async () => OrderService.getProgramAndChannelConfig(therapyId),
    enabled: !!therapyId,
    refetchOnWindowFocus: false
  });

  const {
    isFetching: isFetchingAccount,
    data: accountList = {},
    refetch: fetchAccountsByProgramAndChannel
  } = useQuery({
    queryKey: ['order', 'therapy', therapyId, 'program-channel-config-accounts', selectedChannel, selectedProgram],
    queryFn: async () => OrderService.getSoldToAccounts(therapyId, serializeParams({ program: selectedProgram, channel: selectedChannel })),
    enabled: !!(selectedChannel || selectedProgram),
    refetchOnWindowFocus: false
  });

  React.useEffect(() => {
    fetchAccountsByProgramAndChannel();
  }, [selectedChannel, selectedProgram]);

  const handleAccountChange = (selectedAccount) => {
    setAlertMsg(false);
    setAccount(selectedAccount);
  };

  const handleOnSubmit = () => {
    if (!account || !selectedProgram || !selectedChannel) {
      setAlertMsg(true);
      return;
    }
    onSubmit(account);
  };

  if (!therapyId) {
    return (
      <div className={styles.wrapper}>
        <div>Error: therapy id is not available</div>
      </div>
    );
  }

  if (isError) {
    setAlertMsg(true);
    return (
      <div className={styles.wrapper}>
        <div>Error: {error.message}</div>
      </div>
    );
  }

  if (isFetchingConfig) {
    return (
      <div className={styles.wrapper}>
        <Loader variant="circular" />
      </div>
    );
  }

  const handleAlertClose = () => {
    setAlertMsg(false);
  };

  const { programs = [], channels = [] } = programChannelConfig;
  const testChannels = ["Buy & Bill", "Specialty Pharmacy"]
  
  const programList = [
      {
          "label": "Buy & Bill",
          "value": "Buy & Bill",
          "isDisabled" : !testChannels.includes("Buy & Bill")
      },
      {
          "label": "Specialty Pharmacy",
          "value": "Specialty Pharmacy",
          "isDisabled" : !testChannels.includes("Specialty Pharmacy")
      }
    ]
  return (
    <FloatingDrawer 
      open={openDrawer} 
      anchor="right" 
      onClose={onClose} 
      heading={t('labels.needAssistanceSelectingAccount')} 
      width={'520px'}
      controls={
        <div className='controls'>
          <Button label={t('captions.btnCancel')} onClick={onClose} variant="secondary" size="md" aria-label={t('captions.btnCancel')} />
          <Button
            label={t('captions.btnApply')}
            onClick={() => handleOnSubmit(account)}
            variant="primary"
            size="md"
            aria-label={t('captions.btnSelect')}
          />
        </div>
      }
    >
      <div className={styles.wrapper}>
        {alertMsg && (
          <div className={styles.errorMessage}>
            <Alert onClose={handleAlertClose} showTitle title={t('messages.required_Details')} type="error" />
          </div>
        )}

        <div className={styles.drawerContent}>
          <div className={styles.topSect}>
            <div className="MCP-CardContainer">
              <div className={styles.selectionBlock}>
                <p className={styles.caption}>{t('labels.orderAssistance.selectChannel')}</p>
                <RadioGroup
                  direction="row"
                  id="order-channel-options"
                  items={programList}
                  onChangeValue={(value) => {
                    setAlertMsg(false);
                    setChannel(value);
                  }}
                  value={selectedChannel}
                  radioBtnWidth="auto"
                />
              </div>
            </div>

            <div className="MCP-CardContainer">
              <div className={styles.selectionBlock}>
                <p>{t('labels.orderAssistance.selectProgram')}</p>
                <RadioGroup
                  direction="row"
                  id="order-program-options"
                  items={programs.map((v) => ({ 
                    label: v, 
                    value: v, 
                    isDisabled: selectedChannel.includes("Specialty Pharmacy")
                  }))}
                  onChangeValue={(value) => {
                    setAlertMsg(false);
                    setProgram(value);
                  }}
                  value={selectedProgram}
                  radioBtnWidth="auto"
                />
              </div>
            </div>

            <AccountCard options={accountList.content} onChange={handleAccountChange} isFetching={isFetchingAccount} />
          </div>
        </div>
      </div>
    </FloatingDrawer>
  );
};

export default AccountSelectionUserGuide;
