import React, { useEffect } from 'react';
import styles from './assets/styles/ConfigureMaterials.module.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { Loader, Heading, Button, RadioGroup, Label, Required } from '@mckesson/mcp-component-library';
import { ReactComponent as IconClose } from '@src/assets/svg/closeIcon.svg';
import useSnackbar from '@src/hooks/useSnackbar';

function ConfigureMaterials({ onClose }) {
  const { t } = useTranslate();
  const { showSnackbar } = useSnackbar();

  const formFields = [
    {
      caption: t('manageMaterial.drawer.configuration.body.patientInfoRequired'),
      id: 'patientInfoRequired',
      items: [
        { isDisabled: false, label: t('manageMaterial.drawer.configuration.body.patientInfoRequired.yes'), value: 'yes' },
        { isDisabled: false, label: t('manageMaterial.drawer.configuration.body.patientInfoRequired.no'), value: 'no' }
      ],
      value: '', // default value
      required: true,
      onChangeValue: () => {}
    },
    {
      caption: t('manageMaterial.drawer.configuration.body.coiIdRequired'),
      id: 'coiIdRequired',
      items: [
        { isDisabled: false, label: t('manageMaterial.drawer.configuration.body.coiIdRequired.yes'), value: 'yes' },
        { isDisabled: false, label: t('manageMaterial.drawer.configuration.body.coiIdRequired.no'), value: 'no' }
      ],
      value: '', // default value
      required: true,
      onChangeValue: () => {}
    }
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Heading as="h2">{t('manageMaterial.drawer.configuration.heading')}</Heading>
        <button onClick={onClose}>
          <IconClose />
        </button>
      </div>
      <div className={styles.body}>
        <div className={styles.formControls}>
          {formFields.map((field, index) => (
            <div className={styles.formField} key={index}>
              <div className={styles.caption}>
                <Label className={styles.label}>{field.caption}</Label>
                <Required />
              </div>
              <RadioGroup
                direction="row"
                id={field.id}
                items={field.items}
                onChangeValue={field.onChangeValue}
                radioBtnWidth="auto"
                value={field.value}
                size="lg"
              />
            </div>
          ))}
        </div>
        <div className={styles.controls}>
          <Button label={t('manageMaterial.drawer.controls.cancel')} onClick={onClose} variant="secondary" size="md" aria-label={t('manageMaterial.drawer.controls.cancel')} />
          <Button label={t('manageMaterial.drawer.controls.apply')} onClick={() => {}} variant="primary" size="md" aria-label={t('manageMaterial.drawer.controls.apply')} />
        </div>
      </div>
      {/* )} */}
    </div>
  );
}

export default ConfigureMaterials;
