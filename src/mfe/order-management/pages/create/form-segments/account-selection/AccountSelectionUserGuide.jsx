import React, { useState } from 'react';
import styles from './AccountSelectionUserGuide.module.scss';
import {
  RadioGroup,
  Button,
  Loader,
  Heading,
  Alert,
  CheckboxGroup
} from '@mckesson/mcp-component-library';
import { ReactComponent as IconClose } from '@src/assets/svg/cross.svg';
import AccountCard from './AccountCard';
import { useTranslate } from '@src/translations/useTranslation';
import { useQuery } from 'react-query';
import OrderService from '@src/api/commonService/OrderService';
import { serializeParams } from '@src/util/ApiUtils';
import FloatingDrawer from '@src/components/floating-drawer';
import { CHANNEL_TYPE, PROGRAM_LIST } from '../Constants';

const AccountSelectionUserGuide = ({
  therapyId,
  onClose,
  onSubmit,
  openDrawer,
  therapChannelType
}) => {
  const { t } = useTranslate();
  const [selectedProgram, setProgram] = useState('');
  const [selectedChannel, setChannel] = useState('');
  const [account, setAccount] = useState(null);
  const [alertMsg, setAlertMsg] = useState(false);
  const [checkboxOptions, setCheckboxOptions] = useState([
    {
      isDisabled: false,
      isChecked: false,
      label: t('labels.select-account.coveredEntity'),
      value: 'covered_entity'
    }
  ]);
  const captionStyle = {
    fontSize: '16px'
  };

  const handleSelectChange = (value) => {
    const updatedOptions = checkboxOptions.map((item) =>
      item.value === value
        ? {
            ...item,
            isChecked: !item.isChecked
          }
        : item
    );
    setCheckboxOptions(updatedOptions);
  };
  const handleCheckboxChange = () => {
    const updatedOptions = [...checkboxOptions];
    updatedOptions[0].isChecked = false;
    setCheckboxOptions(updatedOptions);
  };

  const {
    isFetching: isFetchingConfig,
    data: programChannelConfig,
    isError,
    error
  } = useQuery({
    queryKey: ['order', 'therapy', therapyId, 'program-channel-config'],
    queryFn: async () =>
      OrderService.getProgramAndChannelConfig(therapyId, {
        channelType: therapChannelType
      }),
    enabled: !!therapyId,
    refetchOnWindowFocus: false
  });

  const {
    isFetching: isFetchingAccount,
    data: accountList = {},
    refetch: fetchAccountsByProgramAndChannel
  } = useQuery({
    queryKey: [
      'order',
      'therapy',
      therapyId,
      'program-channel-config-accounts',
      selectedChannel,
      selectedProgram
    ],
    queryFn: async () =>
      OrderService.getSoldToAccounts(
        therapyId,
        serializeParams({
          ...(selectedChannel === CHANNEL_TYPE.BUY_AND_BILL
            ? { program: selectedProgram }
            : {}),
          channelType: selectedChannel,
          therapyChannelType: therapChannelType
        })
      ),
    enabled:
      Boolean(selectedChannel === CHANNEL_TYPE.SPECIALTY_PHARMA) ||
      Boolean(selectedProgram),
    refetchOnWindowFocus: false
  });

  React.useEffect(() => {
    if (selectedChannel === CHANNEL_TYPE.SPECIALTY_PHARMA || selectedProgram)
      fetchAccountsByProgramAndChannel();
  }, [selectedChannel, selectedProgram]);

  const handleAccountChange = (selectedAccount) => {
    setAlertMsg(false);
    setAccount(selectedAccount);
  };

  const handleOnSubmit = () => {
    if (selectedChannel === CHANNEL_TYPE.SPECIALTY_PHARMA && !account) {
      setAlertMsg(true);
      return;
    } else if (
      (!account || !selectedProgram) &&
      selectedChannel === CHANNEL_TYPE.BUY_AND_BILL
    ) {
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
  const getProgramDisabled = (program, selectedChannel) =>
    !programs.includes(program) ||
    !channels.includes(CHANNEL_TYPE.BUY_AND_BILL) ||
    selectedChannel === CHANNEL_TYPE.SPECIALTY_PHARMA;

  const { programs = [], channels = [] } = programChannelConfig;

  const channelList = [
    { label: t('labels.BUY_AND_BILL'), value: CHANNEL_TYPE.BUY_AND_BILL },
    {
      label: t('labels.SPECIALITY_PHARMA'),
      value: CHANNEL_TYPE.SPECIALTY_PHARMA
    }
  ].map((channel) => ({
    ...channel,
    isDisabled: !channels.includes(channel.value)
  }));

  const programList = PROGRAM_LIST.map((program) => ({
    label: program,
    value: program,
    isDisabled: getProgramDisabled(program, selectedChannel)
  }));

  return (
    <FloatingDrawer
      open={openDrawer}
      anchor="right"
      onClose={onClose}
      heading={t('labels.needAssistanceSelectingAccount')}
      width={'520px'}
      controls={
        <div className="controls">
          <Button
            label={t('captions.btnCancel')}
            onClick={onClose}
            variant="secondary"
            size="md"
            aria-label={t('captions.btnCancel')}
          />
          <Button
            label={t('captions.btnApply')}
            onClick={() => handleOnSubmit(account)}
            variant="primary"
            size="md"
            aria-label={t('captions.btnSelect')}
          />
        </div>
      }>
      <div className={styles.wrapper}>
        {alertMsg && (
          <div className={styles.errorMessage}>
            <Alert
              onClose={handleAlertClose}
              showTitle
              title={t('messages.required_Details')}
              type="error"
            />
          </div>
        )}

        <div className={styles.drawerContent}>
          <div className={styles.topSect}>
            <div className="MCP-CardContainer">
              <div className={styles.selectionBlock}>
                <p className={styles.caption}>
                  {t('labels.orderAssistance.selectChannel')}
                </p>
                <RadioGroup
                  direction="row"
                  id="order-channel-options"
                  items={channelList}
                  onChangeValue={(value) => {
                    setAlertMsg(false);
                    setChannel(value);
                    handleCheckboxChange();
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
                  items={programList}
                  onChangeValue={(value) => {
                    setAlertMsg(false);
                    setProgram(value);
                    handleCheckboxChange();
                  }}
                  value={selectedProgram}
                  radioBtnWidth="auto"
                />
              </div>
            </div>
            {selectedProgram === '340B' &&
              selectedChannel === CHANNEL_TYPE.BUY_AND_BILL && (
                <CheckboxGroup
                  id={'default'}
                  items={checkboxOptions.map((item) => ({
                    ...item,
                    onChange: () => handleSelectChange(item.value)
                  }))}
                  itemCustomStyles={captionStyle}
                />
              )}
            {(selectedProgram !== '340B' ||
              (selectedProgram === '340B' &&
                checkboxOptions[0]?.isChecked)) && (
              <AccountCard
                options={accountList.content}
                onChange={handleAccountChange}
                isFetching={isFetchingAccount}
              />
            )}
          </div>
        </div>
      </div>
    </FloatingDrawer>
  );
};

export default AccountSelectionUserGuide;
