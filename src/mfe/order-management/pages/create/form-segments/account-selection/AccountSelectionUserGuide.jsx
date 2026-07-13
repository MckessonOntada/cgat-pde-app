import React, { useState } from 'react';
import styles from './AccountSelectionUserGuide.module.scss';
import { RadioGroup, Button, Loader, Heading, CheckboxGroup } from '@mckesson/mcp-component-library';
import AccountCard from './AccountCard';
import { useTranslate } from '@src/translations/useTranslation';
import { useQuery } from 'react-query';
import OrderService from '@src/api/commonService/OrderService';
import { serializeParams } from '@src/util/ApiUtils';
import FloatingDrawer from '@src/components/floating-drawer';
import { CHANNEL_TYPE, INFO_340B, PROGRAM_LIST } from '../Constants';
import InfoModel from '@src/components/InfoModel/indix';
import Alert from '@src/components/cgat-alert/Alert';

const AccountSelectionUserGuide = ({ trade = {}, onClose, onSubmit, openDrawer, channelType = CHANNEL_TYPE.BUY_AND_BILL }) => {
  const { t } = useTranslate();
  const [selectedProgram, setProgram] = useState('');
  const [selectedChannel, setChannel] = useState('');
  const [account, setAccount] = useState(null);
  const [alert, setAlert] = useState(null);
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

  const { isFetching: isFetchingConfig, data: programChannelConfig } = useQuery({
    queryKey: ['order', 'therapy', trade.tradName, 'program-channel-config'],
    queryFn: async () =>
      OrderService.getProgramAndChannelConfig(trade.ndc, {
        channelType: channelType
      }),
    onError: (error) => {
      setAlert({
        description: t('error.default'),
        type: 'error'
      });
    },
    enabled: Boolean(trade.ndc),
    refetchOnWindowFocus: false
  });

  const {
    isFetching: isFetchingAccount,
    data: accountList = {},
    refetch: fetchAccountsByProgramAndChannel
  } = useQuery({
    queryKey: ['order', 'therapy', trade.tradeName, 'program-channel-config-accounts', selectedChannel, selectedProgram],
    queryFn: async () =>
      OrderService.getSoldToAccounts(
        trade.ndc,
        serializeParams({
          ...(selectedChannel === CHANNEL_TYPE.BUY_AND_BILL ? { program: selectedProgram } : {}),
          channelType: selectedChannel,
          ndcChannelType: channelType
        })
      ),
    onError: (error) => {
      setAlert({
        description: t('error.default'),
        type: 'error'
      });
    },
    enabled: Boolean(selectedChannel === CHANNEL_TYPE.SPECIALTY_PHARMA) || Boolean(selectedProgram),
    refetchOnWindowFocus: false
  });

  React.useEffect(() => {
    if (selectedChannel === CHANNEL_TYPE.SPECIALTY_PHARMA || selectedProgram) fetchAccountsByProgramAndChannel();
  }, [selectedChannel, selectedProgram]);

  const handleAccountChange = (selectedAccount) => {
    setAlert(null);
    setAccount(selectedAccount);
  };

  const handleOnSubmit = () => {
    if (
      !selectedChannel ||
      (selectedChannel === CHANNEL_TYPE.SPECIALTY_PHARMA && !account) ||
      (selectedChannel === CHANNEL_TYPE.BUY_AND_BILL && (!account || !selectedProgram))
    ) {
      setAlert({
        type: 'error',
        description: t('messages.required_Details')
      });
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

    onSubmit(transformedAccount, { program: selectedProgram, channelType: selectedChannel });
    onClose();
  };

  const getProgramDisabled = (program, selectedChannel) =>
    !programs.includes(program) || !channels.includes(CHANNEL_TYPE.BUY_AND_BILL) || selectedChannel === CHANNEL_TYPE.SPECIALTY_PHARMA;

  const { programs = [], channels = [] } = programChannelConfig || {};

  const channelList = [
    { label: t('labels.BUY_AND_BILL'), value: CHANNEL_TYPE.BUY_AND_BILL },
    {
      label: t('labels.SPECIALITY_PHARMACY'),
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
    setAlert(null);
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
        const desc = (
          <>
            {t('order.account.selection.eligibility.patient.info', {
              boldText_entity: <strong>{t('order.account.340B_covered_entity')}</strong>,
              boldText_patient: <strong>{t('order.account.340B_covered_patient')}</strong>
            })}
          </>
        );
        return (
          <InfoModel title={t('order.account.selection.340b.info.header')}>
            <div className={`MCP-modal-body ${styles.display340B}`}>{desc}</div>
          </InfoModel>
        );
      case 'GOV':
        return (
          <InfoModel title={t('order.account.selection.gov.info.header')}>
            <div className="MCP-modal-body">{t('order.account.selection.gov.info')}</div>
          </InfoModel>
        );
      case 'GPO':
        return (
          <InfoModel title={t('order.account.selection.gpo.info.header')}>
            <div className="MCP-modal-body">{t('order.account.selection.gpo.info')}</div>
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
      heading={t('labels.selectProcurementOptions')}
      width={'520px'}
      controls={
        <div className="controls">
          <Button
            disabled={isFetchingConfig}
            label={t('captions.btnCancel')}
            onClick={onClose}
            variant="secondary"
            size="md"
            aria-label={t('captions.btnCancel')}
          />
          <Button
            disabled={isFetchingConfig}
            label={t('captions.btnApply')}
            onClick={() => handleOnSubmit(account)}
            variant="primary"
            size="md"
            aria-label={t('captions.btnSelect')}
          />
        </div>
      }>
      {isFetchingConfig ? (
        <Loader variant="circular" />
      ) : (
        <div className="MCP-module-wrapper">
          {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
          <div className={styles.wrapper}>
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
                        setAlert(null);
                        setChannel(value);
                        handleCheckboxChange();
                      }}
                      value={selectedChannel}
                      radioBtnWidth="auto"
                      size="lg"
                    />
                  </div>
                </div>

                {selectedChannel === CHANNEL_TYPE.BUY_AND_BILL && (
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
                )}
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
        </div>
      )}
    </FloatingDrawer>
  );
};

export default AccountSelectionUserGuide;
