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
            <Button variant="tertiary" onClick={onClose} aria-label={t('captions.close')}>
              <IconClose />
            </Button>
          </div>

          <div className="MCP-CardContainer">
            <div className={styles.selectionBlock}>
              <p className={styles.caption}>{t('labels.orderAssistance.selectChannel')}</p>
              <RadioGroup
                direction="row"
                id="order-channel-options"
                items={channels.map((v) => ({ label: v, value: v }))}
                onChangeValue={setChannel}
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
                items={programs.map((v) => ({ label: v, value: v }))}
                onChangeValue={setProgram}
                value={selectedProgram}
                radioBtnWidth="auto"
              />
            </div>
          </div>

          <AccountCard options={accountList.content} onChange={handleAccountChange} />
        </div>

        <div className={styles.controls}>
          <Button label={t('captions.btnCancel')} onClick={onClose} variant="secondary" size="md" aria-label={t('captions.btnCancel')} />
          <Button
            label={t('headings.seletAccount')}
            onClick={() => onSubmit(account)}
            variant="primary"
            size="md"
            disabled={!account}
            aria-label={t('captions.btnSelect')}
          />
        </div>
      </div>
    </div>
  );
};

export default AccountSelectionUserGuide;
