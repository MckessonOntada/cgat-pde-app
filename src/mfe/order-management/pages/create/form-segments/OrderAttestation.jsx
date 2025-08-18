import React, { useCallback } from 'react';
import styles from './OrderStepper.module.scss';
import { CheckboxGroup, TextError } from '@mckesson/mcp-component-library';
import { ORDER_ATTESTATION_MESSAGES } from './Constants';
import { useTranslate } from '@src/translations/useTranslation';

const OrderAttestation = ({ stage, onCheck, isChecked, error, disabled }) => {
  const { t } = useTranslate();
  const handleChange = useCallback(() => {
    if (onCheck) {
      onCheck(!isChecked);
    }
  }, [isChecked]);

  const acknowledgeOption = {
    isDisabled: disabled || false,
    isChecked: isChecked || false,
    label: ORDER_ATTESTATION_MESSAGES(t)[stage],
    value: 'attest',
    onChange: handleChange
  };

  return (
    <div className={styles.attestationWrapper}>
      <CheckboxGroup
        id="order-attestation"
        name="order-agreement"
        items={[acknowledgeOption]}
        size="md"
        error={error}
        errorMessage="Please acknowledge to Save and continue"
      />
    </div>
  );
};

export default OrderAttestation;
