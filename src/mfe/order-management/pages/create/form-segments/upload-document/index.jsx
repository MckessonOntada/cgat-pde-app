import React from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
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
import TherapyDetails from '@src/components/therapyDetails/TherapyDetails';
import { TherapyDetailsConstantsForBB } from '../therapy-selection/assets/constants/TherapyDetailsConstants';
import { ORDER_STATUS } from '../../../orders/config';
import { CHANNEL_TYPE } from '../Constants';

const COMMENT_MAX_LENGTH = 5000;
function UploadOrderDocument() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslate();
  const [showTherapyDetails, setShowTherapyDetails] = React.useState(false);
  const [comment, setComment] = React.useState('');
  const [alert, setAlert] = React.useState(null);
  const { data: orderDetails = {}, isFetching: isFetchingOrderDetails } =
    useOrder(orderId);
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

  if (
    orderDetails.id &&
    (orderDetails.status !== ORDER_STATUS.SUBMITTED ||
      ![CHANNEL_TYPE.BUY_AND_BILL, CHANNEL_TYPE.SPECIALTY_PHARMA].includes(
        orderDetails.channelType
      ))
  ) {
    navigate('/orders');
  }
  return (
    <div className="MCP-module-wrapper">
      <PageHeader heading={'Upload Documents'} />
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      <div className="MCP-CardContainer">
        <ModuleHeader
          className={styles['panel-header']}
          heading={<Heading as="h3">{t('labels.orderDetails')}</Heading>}
        />

        {isFetchingOrderDetails ? (
          <div className="spinner-wrapper md">
            <SpinnerIcon />
          </div>
        ) : (
          <div>
            <div
              className={`grid grid-gap-12 sm:grid-gap-32 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3`}>
              <DetailSegment
                key={'sap_id'}
                label="SAP ID"
                value={orderDetails.id}
              />
              <DetailSegment
                key={'therapy_name'}
                label="Therapy"
                value={
                  <Link
                    onClick={() => setShowTherapyDetails(true)}
                    className="MCP-table-link">
                    {orderDetails.therapy?.materialDescription}
                  </Link>
                }
              />
              <div className="price-wrapper">
                <DetailSegment
                  label={t('labels.orderCost')}
                  value={
                    orderDetails.orderCost ? (
                      <span className="dollarSign ">
                        <span>$</span>
                        {orderDetails.orderCost}
                      </span>
                    ) : (
                      '-'
                    )
                  }
                />
              </div>
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
      {showTherapyDetails && orderDetails.id && (
        <TherapyDetails
          therapyId={orderDetails.therapy.materialNumber}
          therapyData={TherapyDetailsConstantsForBB}
          onClose={() => setShowTherapyDetails(false)}
          showFooter={false}
          isMaterialConfiguration={true}
          useMaterialService={true}
          heading={t('labels.therapyDetails')}
        />
      )}
    </div>
  );
}

export default UploadOrderDocument;
