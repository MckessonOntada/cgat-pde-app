import React, { useState } from 'react';
import styles from './AccountSelectionUserGuide.module.scss';
import { RadioGroup, Button, Loader, Heading, Alert, CheckboxGroup } from '@mckesson/mcp-component-library';
import { ReactComponent as IconClose } from '@src/assets/svg/cross.svg';
import AccountCard from './AccountCard';
import { useTranslate } from '@src/translations/useTranslation';
import { useQuery } from 'react-query';
import OrderService from '@src/api/commonService/OrderService';
import { serializeParams } from '@src/util/ApiUtils';
import FloatingDrawer from '@src/components/floating-drawer';
import { CHANNEL_TYPE, INFO_340B, PROGRAM_LIST } from '../Constants';
import InfoModel from '@src/components/InfoModel/indix';

const AccountSelectionUserGuide = ({ therapyId, onClose, onSubmit, openDrawer, channelType = CHANNEL_TYPE.BUY_AND_BILL }) => {
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
        channelType: channelType
      }),
    enabled: !!therapyId,
    refetchOnWindowFocus: false
  });

  const {
    isFetching: isFetchingAccount,
    data: accountList = {},
    refetch: fetchAccountsByProgramAndChannel
  } = useQuery({
    queryKey: ['order', 'therapy', therapyId, 'program-channel-config-accounts', selectedChannel, selectedProgram],
    queryFn: async () =>
      OrderService.getSoldToAccounts(
        therapyId,
        serializeParams({
          ...(selectedChannel === CHANNEL_TYPE.BUY_AND_BILL ? { program: selectedProgram } : {}),
          channelType: selectedChannel,
          therapyChannelType: channelType
        })
      ),
    enabled: Boolean(selectedChannel === CHANNEL_TYPE.SPECIALTY_PHARMA) || Boolean(selectedProgram),
    refetchOnWindowFocus: false
  });

  React.useEffect(() => {
    if (selectedChannel === CHANNEL_TYPE.SPECIALTY_PHARMA || selectedProgram) fetchAccountsByProgramAndChannel();
  }, [selectedChannel, selectedProgram]);

  const handleAccountChange = (selectedAccount) => {
    setAlertMsg(false);
    setAccount(selectedAccount);
  };

  const handleOnSubmit = () => {
    if (
      !selectedChannel ||
      (selectedChannel === CHANNEL_TYPE.SPECIALTY_PHARMA && !account) ||
      (selectedChannel === CHANNEL_TYPE.BUY_AND_BILL && (!account || !selectedProgram))
    ) {
      setAlertMsg(true);
      return;
    }

    const transformedAccount = {
      ...account,
      address: {
        email: account.email || null,
        telephone: account.telephone || null,
        houseNumber: account.houseNumber || null,
        street: account.street || null,
        street2: account.street2 || null,
        street3: account.street3 || null,
        city: account.city || null,
        district: account.district || null,
        state: account.state || null,
        zipCode: account.zipCode || null,
        country: account.country || null
      }
    };

    onSubmit(transformedAccount);
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
    !programs.includes(program) || !channels.includes(CHANNEL_TYPE.BUY_AND_BILL) || selectedChannel === CHANNEL_TYPE.SPECIALTY_PHARMA;

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
  const handleChange = (event) => {
    setAlertMsg(false);
    setProgram(event.target.value);
    handleCheckboxChange();
  };
  const infoModel = (item) => {
    switch (item) {
      case 'WAC':
        return (
          <InfoModel title={t('order.account.selection.wac.info.header')}>
            <div className="MCP-modal-body">{t('order.account.selection.wac.info')}</div>
          </InfoModel>
        );
      case '340B':
        return (
          <InfoModel title={t('order.account.selection.340b.info.header')}>
            <div className="MCP-modal-body">
              {INFO_340B.map((section, index) => (
                <div key={index}>
                  <div className="styled-heading">
                    <Heading as="h4">{t(section.title)}</Heading>
                  </div>
                  {section.info && <p>{t(section.info)}</p>}
                  <ol className="details-info">
                    {section.requirements.map((detail, idx) => (
                      <li className="details-li" key={idx}>
                        <div className="details-key">{t(detail)}</div>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </InfoModel>
        );
      case 'GOV':
        return (
          <InfoModel title={t('order.account.selection.gov.info.header')}>
            <div className="MCP-modal-body">{t('order.account.selection.gov.info')}</div>
          </InfoModel>
        );
      default:
        return '';
    }
  };
  return (
    <FloatingDrawer
      open={openDrawer}
      anchor="right"
      onClose={onClose}
      heading={t('labels.needAssistanceSelectingAccount')}
      width={'520px'}
      controls={
        <div className="controls">
          <Button label={t('captions.btnCancel')} onClick={onClose} variant="secondary" size="md" aria-label={t('captions.btnCancel')} />
          <Button label={t('captions.btnApply')} onClick={() => handleOnSubmit(account)} variant="primary" size="md" aria-label={t('captions.btnSelect')} />
        </div>
      }>
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
                  items={channelList}
                  onChangeValue={(value) => {
                    setAlertMsg(false);
                    setChannel(value);
                    handleCheckboxChange();
                  }}
                  value={selectedChannel}
                  radioBtnWidth="auto"
                  size="lg"
                />
              </div>
            </div>

            <div className="MCP-CardContainer">
              <div className={styles.selectionBlock}>
                <p>{t('labels.orderAssistance.selectProgram')}</p>
                <div className="radio-btn-group">
                  {programList.map((item, index) => (
                    <div key={`radio-option-${index}`} className="radio-info-group">
                      <label key={item.value} className="custom-radio">
                        <input type="radio" name="priceType" value={item.value} disabled={item.isDisabled} onChange={handleChange} />
                        <span class="checkmark"></span>
                        {item.label}
                      </label>
                      {infoModel(item.label)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {selectedProgram === '340B' && selectedChannel === CHANNEL_TYPE.BUY_AND_BILL && (
              <div className="MCP-modal-body">
                <p>{t('order.account.selection.340b.checkboxHeading')}</p>
                <ol className="details-info">
                  <li className="details-li">
                    <div className="details-key">{t('order.account.selection.340b.checkboxinfo1')}</div>
                  </li>
                  <li className="details-li">
                    <div className="details-key">{t('order.account.selection.340b.checkboxinfo2')}</div>
                  </li>
                </ol>
                <CheckboxGroup
                  id={'default'}
                  items={checkboxOptions.map((item) => ({
                    ...item,
                    onChange: () => handleSelectChange(item.value)
                  }))}
                  // itemCustomStyles={captionStyle}
                />
              </div>
            )}
            {(selectedProgram !== '340B' || (selectedProgram === '340B' && checkboxOptions[0]?.isChecked)) && (
              <AccountCard options={accountList.content} onChange={handleAccountChange} isFetching={isFetchingAccount} />
            )}
          </div>
        </div>
      </div>
    </FloatingDrawer>
  );
};

export default AccountSelectionUserGuide;
