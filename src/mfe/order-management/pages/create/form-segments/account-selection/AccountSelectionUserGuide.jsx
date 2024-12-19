import React, { useState } from 'react';
import styles from './AccountSelectionUserGuide.module.scss';
import { RadioGroup, Button, Loader } from '@mckesson/mcp-component-library';
import { ReactComponent as IconClose } from '@src/assets/svg/closeIcon.svg';
import AccountCard from './AccountCard';
import { useTranslate } from '@src/translations/useTranslation';
import { useQuery } from 'react-query';
import OrderService from '@src/api/commonService/OrderService';

const AccountSelectionUserGuide = ({ therapyId, onClose }) => {
  const { t } = useTranslate();
  const [program1, setProgram1] = useState(null);
  const [program2, setProgram2] = useState(null);
  const [account, setAccount] = useState(null);

  const options = [];

  const {
    isFetching: isFetchingConfig,
    data: programChannelConfig,
    isError,
    error
  } = useQuery({
    queryKey: ['order', 'therapy', therapyId, 'program-channel-config'],
    queryFn: async () => OrderService.getProgramAndChannelConfig(therapyId, {}),
    enabled: !!therapyId,
    refetchOnWindowFocus: false
  });

  const program1Options = ['3PL', 'SD', 'All'];
  const program2Options = ['WAC', 'GOV', '340B'];

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

  return (
    <div className={styles.wrapper}>
      <div className={styles.drawerContent}>
        <div className={styles.topSect}>
          <div className={styles.header}>
            <h6>{t('labels.needAssistanceSelectingAccount')}</h6>
            <button onClick={onClose} aria-label={t('captions.close')}>
              <IconClose />
            </button>
          </div>

          <div className="MCP-panel-container">
            <div className={styles.selectionBlock}>
              <p>{t('labels.orderThroughBelowPrograms')}</p>
              <RadioGroup
                direction="row"
                id="orderProgramOption1"
                items={program1Options.map((v) => ({ label: v, value: v }))}
                onChangeValue={setProgram1}
                value={program1}
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
                items={program2Options.map((v) => ({ label: v, value: v }))}
                onChangeValue={setProgram2}
                value={program2}
                radioBtnWidth="auto"
              />
            </div>
          </div>

          <AccountCard options={options} onChange={handleAccountChange} />
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
