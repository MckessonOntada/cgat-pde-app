import React from 'react';
import styles from './CommentPanel.module.scss';
import { Button, Heading } from '@mckesson/mcp-component-library';
import { ReactComponent as IconClose } from '@src/assets/svg/closeIcon.svg';
import { useTranslate } from '@src/translations/useTranslation';
import Components from '@src/components/form/Components';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { useMutation } from 'react-query';
import OrderService from '@src/api/commonService/OrderService';
import useAlert from '@src/hooks/useAlert';
import { StatusEnum } from '../../../orders/constants';

const INITIAL_VALUES = {
  rejectionReason: ''
};

const COMMENT_MAX_LENGTH = 5000;

const CommentPanel = ({ readOnly, onClose, onSuccess, meta }) => {
  const { t } = useTranslate();
  const firstField = React.useRef(null);
  const serverResponseMessage = 'server-response-reject-order';
  const [initialValues, setInitialValues] = React.useState(INITIAL_VALUES);
  serverResponseMessage;
  const { showAlert } = useAlert();

  const validationSchema = Yup.object({
    rejectionReason: Yup.string()
      .min(2, t('message.errorShortComment'))
      .max(5000, t('message.errorCommentExceedMaxLength').replace('{{length}}', COMMENT_MAX_LENGTH))
      .required(t('message.errorCommentRequiredToRejectOrder'))
  });

  React.useEffect(() => {
    if (firstField.current) {
      firstField.current.focus();
    }
  }, []);

  const { mutate: rejectOrder } = useMutation(
    async ({ orderId, rejectionReason }) => await OrderService.rejectOrder(orderId, rejectionReason),
    {
      onSuccess: (response) => {
        const { status } = response;
        if (status === StatusEnum.REJECTED) {
          onSuccess(response);
        } else {
          showAlert({ description: 'Could not reject order. Please try again later', type: 'error', anchorEl: serverResponseMessage });
        }
      },
      onError: (error) => {
        showAlert({ description: error.message, type: 'error', anchorEl: serverResponseMessage });
      }
    }
  );

  const handleOnSubmit = (values) => {
    const { rejectionReason } = values;
    const { orderId } = meta;
    if (rejectionReason && orderId) {
      rejectOrder({ orderId, rejectionReason });
    }
  };

  const handleOnClose = (event) => {
    event.preventDefault();
    if (onClose) onClose();
  };

  React.useEffect(() => {
    const { rejectionDetails } = meta;
    if (rejectionDetails?.rejectionReason) {
      setInitialValues({
        rejectionReason: rejectionDetails.rejectionReason
      });
    }
  }, [meta]);

  return (
    <Formik initialValues={initialValues} enableReinitialize={true} validationSchema={validationSchema} onSubmit={handleOnSubmit}>
      {({ values }) => {
        return (
          <Form>
            <div className={styles.wrapper}>
              <div className={styles.drawerContent}>
                <div className={styles.topSect}>
                  <div className={styles.header}>
                    <Heading as="h4">{t('captions.lblRejectOrder')}</Heading>
                    <button onClick={handleOnClose}>
                      <IconClose />
                    </button>
                  </div>

                  <div className={styles.form}>
                    <Heading as="h4">{t('captions.reasonForRejection')}</Heading>
                    <div className={styles.serverMessage} id={serverResponseMessage}></div>
                    <Field
                      ref={firstField}
                      name="rejectionReason"
                      fieldlabel={t('captions.lblReason')}
                      placeholder=" "
                      isRequired
                      isReadOnly={readOnly}
                      component={Components['textarea']}
                      maxCharHelperText={t('forms.placeholder.max_5000_chars')}
                      maxCharLimit={COMMENT_MAX_LENGTH}>
                      {values.rejectionReason}
                    </Field>
                  </div>
                </div>

                {!readOnly && (
                  <div className={styles.controls}>
                    <Button onClick={onClose} variant="secondary" size="md">
                      {t('captions.btnCancel')}
                    </Button>
                    <Button type="submit" variant="primary" size="md">
                      {t('captions.btnRejectOrder')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CommentPanel;
