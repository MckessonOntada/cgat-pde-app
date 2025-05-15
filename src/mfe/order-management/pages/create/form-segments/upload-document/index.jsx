import React from 'react';
import OrderHeaderDetails from '../OrderHeaderDetails';
import { useParams } from 'react-router-dom';
import useOrder from '../../../orders/useOrder';
import { useOrderPrice } from '../additional-details/useOrderPrice';
import PageHeader from '@src/components/pageHeader';
import { ReactComponent as SpinnerIcon } from '@src/assets/svg/spinner.svg';
import UploadFile from '@src/components/uploadFile/UploadFile';
import { Field, Form, Formik } from 'formik';
import Components from '@src/components/form/Components';
import { useTranslate } from '@src/translations/useTranslation';
import { validateFile } from '@src/components/uploadFile/uploadUtils';

const COMMENT_MAX_LENGTH = 5000;
function UploadOrderDocument() {
  const { orderId } = useParams();
  const { t } = useTranslate();
  const { data: orderDetails = {}, isFetching: isFetchingOrderDetails } =
    useOrder(orderId);

  const therapyId = orderDetails?.therapy?.materialNumber;
  const soldToAccountId =
    orderDetails?.accountDetails?.soldToAccount?.accountNumber;
  const shipToAccountId =
    orderDetails?.accountDetails?.shipToAccount?.accountNumber;
  const { data: priceDetails } = useOrderPrice({
    therapyId,
    soldToAccountId,
    shipToAccountId
  });
  const handleOnUpload = () => {};
  return (
    <div className="MCP-module-wrapper">
      <div className="MCP-CardContainer">
        <PageHeader heading={'Order Details'} />
        {true ? (
          <div className="spinner-wrapper md">
            <SpinnerIcon />
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div className="MCP-module-body">
        <div className="MCP-CardContainer">
          <Formik
            initialValues={{
              document: '',
              'document-comment': ''
            }}>
            <Form>
              <UploadFile
                primaryHeading={t('controls.uploadProviders')}
                controlHeading={t('heading.uploadProviderListCSV')}
                isLoading={false}
                messages={[]}
                onCloseAlert={() => {}}
                upload={{
                  caption: t('controls.uploadProviders'),
                  fn: handleOnUpload
                }}
                onFileSelection={(file) => validateFile(t, file, ['text/csv'])}
                prefixChildren={true}
              />
              <Field
                name="document-comment"
                fieldlabel={t('label.comment')}
                placeholder=" "
                isRequired
                component={Components['textarea']}
                maxCharHelperText={t('forms.placeholder.max_5000_chars')}
                maxCharLimit={COMMENT_MAX_LENGTH}></Field>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default UploadOrderDocument;
