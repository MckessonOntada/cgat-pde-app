import Alert from '@src/components/cgat-alert/Alert';
import { renderModal } from '@src/util/ModalUtil';
import React, { useState } from 'react';
import { CHANNEL_TYPE, NOTIFY_ALERT, NOTIFY_USER_EVENT_TYPE } from './Constants';
import { useTranslate } from '@src/translations/useTranslation';
import { Link } from 'react-router-dom';
import { useMutation } from 'react-query';
import CommonUtils from '@src/util/CommonUtils';
import OrderService from '@src/api/commonService/OrderService';
import { Tooltip } from '@mckesson/mcp-component-library';

export function showSaveAsDraftConfirm({ t, onOk, onCancel, onContinue }) {
  return renderModal({
    title: t('messages.header.alert'),
    bodyContent: (
      <div className="MCP-modal-body">
        <p>{t('attestation.warning')}</p>
      </div>
    ),
    footerActions: {
      cancel: {
        label: t('captions.btnCancel'),
        action: () => onCancel?.()
      },
      confirm: {
        label: t('button.caption.saveAsDraft'),
        action: () => onOk()
      },
      continue: {
        label: t('captions.btnSaveAndContinue'),
        action: () => onContinue()
      }
    }
  });
}

export function showEditAlert(title, message, cancelBtnLabel) {
  renderModal({
    title,
    bodyContent: (
      <div className="MCP-modal-body">
        <p>{message}</p>
      </div>
    ),
    footerActions: {
      cancel: {
        label: cancelBtnLabel
      }
    }
  });
}

export const NotifyAlert = ({ stage, OnEdit = false, orderId, setAlert, patientDetailsRequired = false }) => {
  const [userNotified, setUserNotified] = useState(false);
  const { t } = useTranslate();
  const messages = NOTIFY_ALERT(t, patientDetailsRequired);
  const message = OnEdit ? t('labels.summaryEditMessage') : messages[stage];
  const eventType = NOTIFY_USER_EVENT_TYPE(t)[stage];

  const { mutate: notifyUser } = useMutation(async ({ orderId, eventType }) => await OrderService.notifyUser(orderId, eventType), {
    onSuccess: () => {
      setUserNotified(true);
    },
    onError: (error) => {
      const statusCode = error?.response?.status;
      let description = t('error.default');
      if (!(statusCode >= 400 && statusCode < 600)) {
        description = CommonUtils.getAxiosErrorMessage(error);
      }
      setAlert({
        description,
        type: 'error'
      });
    }
  });

  const strMessage = OnEdit ? (
    message
  ) : (
    <div className="info-alert-message">
      {message}{' '}
      {userNotified ? (
        <span>
          <Tooltip body={t('messages.notifyUser')}>{t('control.notifyUser')}</Tooltip>
        </span>
      ) : (
        <Link onClick={() => notifyUser({ orderId, eventType })}>{t('control.notifyUser')}</Link>
      )}
    </div>
  );

  return <Alert className="alert-container-print" type={OnEdit ? 'error' : 'info'} description={strMessage} showCloseIcon={false} />;
};

export const isValidToSaveAsDraft = (values, errors, touched, setTouched, setErrors) => {
  let allValid = true;
  const newTouched = { ...touched };
  const newErrors = { ...errors };

  const traverse = (valObj, errObj, touchObj, errAcc) => {
    Object.keys(valObj).forEach((key) => {
      const value = valObj[key];
      const error = errObj?.[key];

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        if (!touchObj[key] || typeof touchObj[key] !== 'object') touchObj[key] = {};
        if (!errAcc[key] || typeof errAcc[key] !== 'object') errAcc[key] = {};
        traverse(value, error || {}, touchObj[key], errAcc[key]);
      } else {
        if (value !== undefined && value !== '' && value !== null) {
          if (error) allValid = false;
        } else {
          touchObj[key] = false;
          errAcc[key] = '';
        }
      }
    });
  };

  traverse(values, errors, newTouched, newErrors);
  setTouched(newTouched);
  setErrors(newErrors);

  return allValid;
};
export const getManufacturer = (details) =>
  details?.channelType === CHANNEL_TYPE.BUY_AND_BILL ? details?.therapyConfig?.config?.manufacturerName : details?.spTherapyConfig?.config?.manufacturerName;

export function removePrefixSuffix(regexStr) {
  const prefixRemoved = regexStr.replace(/^\^([^(\[\{]+)(?=[({[])/, '^');
  const suffixRemoved = prefixRemoved.replace(/([^)\]\}]+)\$$/, '$');
  return suffixRemoved;
}
export function updatePatientValues(values, fieldConfigs) {
  if (!values?.patient) return values;

  fieldConfigs.forEach((config) => {
    const field = config.fieldName;
    const value = values.patient[field];

    if (value === undefined || value === null || value === '') return;

    const regex = config.properties?.fieldFormat?.validationRegex;
    if (!regex) return;

    const prefix = config.properties?.fieldFormat?.validationFormat?.match(/prefix\('([^']*)'\)/)?.[1] ?? '';
    const suffix = config.properties?.fieldFormat?.validationFormat?.match(/suffix\('([^']*)'\)/)?.[1] ?? '';

    if (prefix || suffix) {
      values.patient[field] = `${prefix}${value}${suffix}`;
    } else {
      return values;
    }

    if (!prefix && !suffix) return;

    values.patient[field] = `${prefix}${value}${suffix}`;
  });

  return values;
}

export function updateAdditionalDetailsValues(values, fieldConfigs) {
  fieldConfigs.forEach((config) => {
    const field = config.fieldName;
    const value = values[field];

    if (value === undefined || value === null || value === '') return;

    const regex = config.properties?.fieldFormat?.validationRegex;
    if (!regex) return;

    const prefix = config.properties?.fieldFormat?.validationFormat?.match(/prefix\('([^']*)'\)/)?.[1] ?? '';
    const suffix = config.properties?.fieldFormat?.validationFormat?.match(/suffix\('([^']*)'\)/)?.[1] ?? '';

    if (prefix || suffix) {
      values[field] = `${prefix}${value}${suffix}`;
    } else {
      return values;
    }

    if (!prefix && !suffix) return;

    values[field] = `${prefix}${value}${suffix}`;
  });

  return values;
}

export function getValueWIthoutPrefixAndSuffix(values, fieldConfigs) {
  if (!values) return values;

  fieldConfigs.forEach((config) => {
    const field = config.fieldName;
    const value = values[field];

    if (value === undefined || value === null || value === '') return;

    const regex = config.properties?.fieldFormat?.validationRegex;
    if (!regex) return;

    const prefix = config.properties?.fieldFormat?.validationFormat?.match(/prefix\('([^']*)'\)/)?.[1] ?? '';
    const suffix = config.properties?.fieldFormat?.validationFormat?.match(/suffix\('([^']*)'\)/)?.[1] ?? '';

    let newValue = value;

    if (prefix && newValue.startsWith(prefix)) {
      newValue = newValue.slice(prefix.length);
    }

    if (suffix && newValue.endsWith(suffix)) {
      newValue = newValue.slice(0, newValue.length - suffix.length);
    }

    values[field] = newValue;
  });

  return values;
}

export const removeFieldPrefixSuffix = (value, fieldName, orderDetails) => {
  if (!value) return '';

  const config =
    orderDetails.channelType === CHANNEL_TYPE.SPECIALTY_PHARMA ? orderDetails.spTherapyConfig?.config?.fields : orderDetails.therapyConfig?.config?.fields;

  const regexFormat = config?.find((f) => f.fieldName === fieldName)?.properties?.fieldFormat?.validationFormat;

  const prefix = regexFormat?.match(/prefix\('([^']*)'\)/)?.[1] ?? '';
  const suffix = regexFormat?.match(/suffix\('([^']*)'\)/)?.[1] ?? '';

  let cleanedValue = value;

  if (prefix && cleanedValue.startsWith(prefix)) {
    cleanedValue = cleanedValue.slice(prefix.length);
  }

  if (suffix && cleanedValue.endsWith(suffix)) {
    cleanedValue = cleanedValue.slice(0, -suffix.length);
  }

  return cleanedValue;
};

function denormalizeInsurance(insurance, isMedical = true) {
  if (!insurance) return null;

  const { medicalCardFront, medicalCardBack, pharmacyCardFront, pharmacyCardBack, ...rest } = insurance;
  const result = {
    ...rest
  };

  if (isMedical) {
    result.medicalCardFront =
      typeof medicalCardFront === 'string' ? { ...CommonUtils.getFileNameAndType(medicalCardFront), url: medicalCardFront } : medicalCardFront;
    result.medicalCardBack =
      typeof medicalCardBack === 'string' ? { ...CommonUtils.getFileNameAndType(medicalCardBack), url: medicalCardBack } : medicalCardBack;
  } else {
    result.pharmacyCardFront =
      typeof pharmacyCardFront === 'string' ? { ...CommonUtils.getFileNameAndType(pharmacyCardFront), url: pharmacyCardFront } : pharmacyCardFront;
    result.pharmacyCardBack =
      typeof pharmacyCardBack === 'string' ? { ...CommonUtils.getFileNameAndType(pharmacyCardBack), url: pharmacyCardBack } : pharmacyCardBack;
  }

  return result;
}

export const normalizeOrderResponse = (response) => {
  if (!response) return {};
  Object.entries(response).forEach((entry) => {
    const [key, value] = entry;
    if (value === null) {
      response[key] = undefined;
    }
  });
  response.isPapOrder = response.paporder;
  const { accountDetails, provider, payerDetails, therapy = {}, spTherapyConfig } = response;
  if (accountDetails?.soldToAccount?.channelType) {
    response.channelType = accountDetails.soldToAccount.channelType;
  }
  if (provider) {
    provider.id = +provider.id;
  }
  if (therapy?.materialNumber) therapy.displayMaterialNumber = CommonUtils.removeLeadingZeros(therapy.materialNumber);
  if (payerDetails) {
    [
      ['primaryMedicalInsurance', true],
      ['secondaryMedicalInsurance', true],
      ['primaryPharmacyInsurance', false],
      ['secondaryPharmacyInsurance', false]
    ].forEach(([key, isMedical]) => {
      response.payerDetails[key] = denormalizeInsurance(response.payerDetails[key], isMedical);
    });
  }
  if (therapy.strength && therapy.dosage) {
    spTherapyConfig.strength = `${therapy.strength} ${therapy.dosage}`;
  }

  return response;
};

export function getOrderStepCaption(isSaving, isUpdating) {
  if (isSaving && !isUpdating) return 'Saving';
  if (!isSaving && isUpdating) return 'Updating';
  return 'captions.btnSaveAndContinue';
}
