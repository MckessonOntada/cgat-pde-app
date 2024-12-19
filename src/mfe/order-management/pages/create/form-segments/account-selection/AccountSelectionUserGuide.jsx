import React, { useState } from 'react';
import styles from './AccountSelectionUserGuide.module.scss';
import { RadioGroup, Button, Loader, Heading } from '@mckesson/mcp-component-library';
import { ReactComponent as IconClose } from '@src/assets/svg/closeIcon.svg';
import AccountCard from './AccountCard';
import { useTranslate } from '@src/translations/useTranslation';
import { useQuery } from 'react-query';
import OrderService from '@src/api/commonService/OrderService';
import { serializeParams } from '@src/util/ApiUtils';

const AccountSelectionUserGuide = ({ therapyId, onClose, onSubmit }) => {
  const { t } = useTranslate();
  const [selectedProgram, setProgram] = useState('');
  const [selectedChannel, setChannel] = useState('');
  const [account, setAccount] = useState(null);

  const options = [];

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
    setAccount(selectedAccount);
  };

  if (!therapyId) {
    return (
      <div className={styles.wrapper}>
        <div>Error: therapy id is not available</div>
      </div>
    );
  }

  if (isError) {
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

  const { programs = [], channels = [] } = programChannelConfig;
  return (
    <div className={styles.wrapper}>
      <div className={styles.drawerContent}>
        <div className={styles.topSect}>
          <div className={styles.header}>
            <Heading as="h3">{t('labels.needAssistanceSelectingAccount')}</Heading>
            <button onClick={onClose} aria-label={t('captions.close')}>
              <IconClose />
            </button>
          </div>

          <div className="MCP-panel-container">
            <div className={styles.selectionBlock}>
              <p className={styles.caption}>{t('labels.orderThroughBelowPrograms')}</p>
              <RadioGroup
                direction="row"
                id="orderProgramOption1"
                items={programs.map((v) => ({ label: v, value: v }))}
                onChangeValue={setProgram}
                value={selectedProgram}
                radioBtnWidth="auto"
              />
            </div>
          </div>

          <div className="MCP-panel-container">
            <div className={styles.selectionBlock}>
              <p>{t('labels.orderThroughBelowPrograms')}</p>
              <RadioGroup
                direction="row"
                id="orderProgramOption2"
                items={channels.map((v) => ({ label: v, value: v }))}
                onChangeValue={setChannel}
                value={selectedChannel}
                radioBtnWidth="auto"
              />
            </div>
          </div>

          <AccountCard options={accountList.content} onChange={handleAccountChange} />
        </div>

        <div className={styles.controls}>
          <Button label={t('captions.btnCancel')} onClick={onClose} variant="secondary" size="md" aria-label={t('captions.cancel')} />
          <Button
            label={t('captions.btnSelect')}
            onClick={() => onSubmit(account)}
            variant="primary"
            size="md"
            disabled={!account}
            aria-label={t('captions.selectAccount')}
          />
        </div>
      </div>
    </div>
  );
};

export default AccountSelectionUserGuide;
