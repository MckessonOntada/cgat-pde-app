import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useOrder from '../../../orders/useOrder';
import { useOrderPrice } from '../additional-details/useOrderPrice';
import PageHeader from '@src/components/pageHeader';
import { ReactComponent as SpinnerIcon } from '@src/assets/svg/spinner.svg';
import UploadFile from '@src/components/uploadFile/UploadFile';
import { Heading, Alert } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import Textarea from '@src/components/form/Textarea';
import { RoutePaths } from '@src/routes/constants';
import DetailSegment from '@src/components/DetailSegment';
import styles from './style.module.scss';
import OrderService from '@src/api/commonService/OrderService';
import ModuleHeader from '@src/components/module-header';
import CommonUtils from '@src/util/CommonUtils';

const COMMENT_MAX_LENGTH = 5000;
function UploadOrderDocument() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslate();
  const [comment, setComment] = React.useState('');
  const [alert, setAlert] = React.useState(null);
  const { data: orderDetails = {}, isFetching: isFetchingOrderDetails } = useOrder(orderId);
  const [validationMessage, setValidationMessage] = React.useState(null);

  const handleOnUpload = (values = {}) => {
    const { file } = values;
    if (!file) {
      setValidationMessage({
        type: 'error',
        description: 'Please select document to upload.',
        onClose: () => setValidationMessage(null)
      });
      return;
    }
    setValidationMessage(null);

    const payload = {
      orderId,
      file
    };
    OrderService.uploadDocument(payload).then((response) => {
      const documentDetails = {
        url: response,
        comment: comment,
        name: file.name,
        size: file.size
      };

      const payload = [documentDetails];

      OrderService.uploadOrderDocument(orderId, payload)
        .then((response) => {
          setComment('');
          navigate('/orders', {
            state: {
              activeTab: location.state?.fromTab,
              alert: {
                from: 'UPLOAD_ORDER_DOCUMENT',
                type: 'success',
                description: `Document has been successfully uploaded for Order ID: ${orderId}`
              }
            }
          });
        })
        .catch((error) => {
          const message = CommonUtils.getAxiosErrorMessage(error);
          setValidationMessage({
            type: 'error',
            description: message,
            onClose: () => setValidationMessage(null)
          });
        });
    });
  };

  const handleOnCancel = () => {
    navigate(RoutePaths.pathOrderManagement, {
      state: { activeTab: location?.state?.fromTab }
    });
  };

  return (
    <div className="MCP-module-wrapper">
      <PageHeader heading={'Upload Documents'} />
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      <div className="MCP-CardContainer">
        <ModuleHeader className={styles['panel-header']} heading={<Heading as="h3">{t('labels.orderDetails')}</Heading>} />

        {isFetchingOrderDetails ? (
          <div className="spinner-wrapper md">
            <SpinnerIcon />
          </div>
        ) : (
          <div>
            <div className={`grid grid-gap-12 sm:grid-gap-32 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4`}>
              <DetailSegment key={'sap_id'} label="SAP ID" value={orderDetails.id} />
              <DetailSegment key={'therapy_name'} label="Therapy" value={orderDetails.therapy?.materialDescription} />
              <div></div>
              <DetailSegment
                key={'order_cost'}
                label="Order Cost"
                value={
                  orderDetails.orderCost ? (
                    <div className={styles['price-text']}>
                      <span>$</span>
                      {orderDetails.orderCost}
                    </div>
                  ) : (
                    '-'
                  )
                }
              />
            </div>
          </div>
        )}
      </div>
      <div className="MCP-module-body">
        <div className="">
          <UploadFile
            isLoading={false}
            messages={[validationMessage]}
            onCloseAlert={() => {}}
            upload={{
              caption: t('controls.updateOrder'),
              fn: handleOnUpload
            }}
            cancel={{
              fn: handleOnCancel
            }}
            isRequired={true}
            uploadLabel={'labels.upload.document'}
            suffixChildren={true}>
            <Textarea
              name="document-comment"
              label={t('label.comments')}
              placeholder=" "
              value={comment}
              onChange={setComment}
              maxCharHelperText={t('forms.placeholder.max_5000_chars')}
              maxCharLimit={COMMENT_MAX_LENGTH}
            />
          </UploadFile>
        </div>
      </div>
    </div>
  );
}

export default UploadOrderDocument;
