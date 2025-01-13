import React from 'react';
import styles from './CommentPanel.module.scss';
import { Button, Heading } from '@mckesson/mcp-component-library';
import { ReactComponent as IconClose } from '@src/assets/svg/closeIcon.svg';
import { useTranslate } from '@src/translations/useTranslation';
import Components from '@src/components/form/Components';
import { Formik, Field, Form } from 'formik';

const initialValues = {
  rejectionReason: ''
};

const CommentPanel = ({ onClose, onSubmit }) => {
  const { t } = useTranslate();
  const firstField = React.useRef(null);

  React.useEffect(() => {
    if (firstField.current) {
      firstField.current.focus();
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.drawerContent}>
        <div className={styles.topSect}>
          <div className={styles.header}>
            <Heading as="h4">{t('captions.lblRejectOrder')}</Heading>
            <button onClick={onClose} aria-label={t('captions.close')}>
              <IconClose />
            </button>
          </div>

          <div>
            <Heading as="h4">{t('captions.reasonForRejection')}</Heading>
            <Formik initialValues={initialValues} enableReinitialize onSubmit={(values, actions) => {}}>
              {({ values, isValid, dirty }) => {
                React.useEffect(() => {}, [dirty]);

                return (
                  <Form>
                    <Field
                      ref={firstField}
                      name="rejectionReason"
                      fieldlabel={t('captions.lblReason')}
                      placeholder=" "
                      isRequired
                      component={Components['textarea']}
                      maxLength={50}
                      maxCharHelperText="Maximum 1,000 Characters"
                    />
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>

        <div className={styles.controls}>
          <Button label={t('captions.btnCancel')} onClick={onClose} variant="secondary" size="md" />
          <Button label={t('captions.btnRejectOrder')} onClick={() => {}} variant="primary" size="md" />
        </div>
      </div>
    </div>
  );
};

export default CommentPanel;
