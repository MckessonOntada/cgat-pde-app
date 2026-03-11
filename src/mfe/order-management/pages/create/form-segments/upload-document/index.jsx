import React from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import useOrder from '../../../orders/useOrder';
import PageHeader from '@src/components/pageHeader';
import { ReactComponent as SpinnerIcon } from '@src/assets/svg/spinner.svg';
import UploadFile from '@src/components/uploadFile/UploadFile';
import { Heading } from '@mckesson/mcp-component-library';
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
import Alert from '@src/components/cgat-alert/Alert';
import { validateFile } from '@src/components/uploadFile/uploadUtils';
import { ALLOWED_FILE_TYPE, ALLOWED_FILE_TYPE_TEXT } from '../additional-details/constants';
import { useWidgetContext } from '@src/context/WidgetContext';

const COMMENT_MAX_LENGTH = 5000;

function UploadOrderDocument() {
  const { orderId } = useParams();
  const location = useLocation();
  const locationState = location?.state ?? {};
  const navigate = useNavigate();
  const { t } = useTranslate();
  const [showTherapyDetails, setShowTherapyDetails] = React.useState(false);
  const [comment, setComment] = React.useState('');
  const [alert, setAlert] = React.useState(null);
  const { state, setValue } = useWidgetContext();
  const { orderDetails = {} } = state;
  const [validationMessage, setValidationMessage] = React.useState(null);
  const channelType = orderDetails.channelType;
  const allowedFileTypes = channelType === CHANNEL_TYPE.SPECIALTY_PHARMA ? ALLOWED_FILE_TYPE.filter((type) => type === 'application/pdf') : ALLOWED_FILE_TYPE;
  const allowedFileTypeText = channelType === CHANNEL_TYPE.SPECIALTY_PHARMA ? 'PDF' : ALLOWED_FILE_TYPE_TEXT;

  React.useEffect(() => {
    if (orderDetails.status === ORDER_STATUS.REVIEW) navigate(`${RoutePaths.pathOrderManagement}`, { replace: true });
  }, [orderDetails]);

  const handleOnUpload = (values = {}) => {
    const { file } = values;
    if (!file) {
      setValidationMessage({
        type: 'error',
        description: t('message.selectDocumentToUpload'),
        onClose: () => setValidationMessage(null)
      });
      return;
    }
    setValidationMessage(null);

    const payload = {
      orderId,
      file,
      channelType
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
          const prevSearch = locationState.__prevSearch || '';
          navigate(`${RoutePaths.pathOrderManagement}${prevSearch}`, {
            state: {
              alert: {
                from: 'UPLOAD_ORDER_DOCUMENT',
                type: 'success',
                description: t('message.documentUploadSuccess', { orderId: orderDetails.backendOrderId })
              }
            }
          });
        })
        .catch((error) => {
          const description = CommonUtils.getUploadErrorMessage(error, t);

          setAlert({
            type: 'error',
            description
          });
        });
    });
  };

  const handleOnCancel = () => {
    const prevSearch = locationState?.__prevSearch || '';
    navigate(`${RoutePaths.pathOrderManagement}${prevSearch}`);
  };

  if (
    orderDetails.id &&
    (orderDetails.status !== ORDER_STATUS.SUBMITTED || ![CHANNEL_TYPE.BUY_AND_BILL, CHANNEL_TYPE.SPECIALTY_PHARMA].includes(orderDetails.channelType))
  ) {
    const prevSearch = locationState?.__prevSearch || '';
    navigate(`${RoutePaths.pathOrderManagement}${prevSearch}`);
  }

  const isSpOrder = orderDetails.channelType !== CHANNEL_TYPE.SPECIALTY_PHARMA;
  return (
    <div className="MCP-module-wrapper">
      <PageHeader heading={'Upload Documents'} />
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      <div className="MCP-CardContainer">
        <ModuleHeader className={styles['panel-header']} heading={<Heading as="h3">{t('labels.orderDetails')}</Heading>} />

        <div>
          <div className={`grid grid-gap-12 sm:grid-gap-32 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3`}>
            {isSpOrder && <DetailSegment key={'order_id'} label={t('labels.orderId')} value={orderDetails.backendOrderId} />}
            <DetailSegment
              key={'therapy_name'}
              label="Therapy"
              value={
                isSpOrder ? (
                  <Link onClick={() => setShowTherapyDetails(true)} className="MCP-table-link">
                    {orderDetails.therapy?.materialDescription}
                  </Link>
                ) : (
                  orderDetails.therapy?.materialDescription
                )
              }
            />
            {orderDetails.therapy?.channelType === CHANNEL_TYPE.BUY_AND_BILL && (
              <div className="price-wrapper">
                <DetailSegment
                  label={t('labels.orderCost')}
                  value={
                    <span className="dollarSign">
                      <span>$</span>
                      {CommonUtils.formatNumberWithoutSymbol(orderDetails.paporder ? 0 : orderDetails.orderCost)}
                    </span>
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="MCP-module-body">
        <div className="">
          <UploadFile
            isLoading={false}
            messages={[validationMessage]}
            onCloseAlert={() => setValidationMessage(null)}
            upload={{
              caption: t('controls.updateDocument'),
              fn: handleOnUpload
            }}
            cancel={{
              fn: handleOnCancel
            }}
            isRequired={true}
            uploadLabel={'labels.upload.document'}
            suffixChildren={true}
            fileTypeText={allowedFileTypeText}
            onFileSelection={(file) => validateFile(t, file, allowedFileTypes)}>
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
          therapyData={TherapyDetailsConstantsForBB(false)}
          onClose={() => setShowTherapyDetails(false)}
          showFooter={false}
          isMaterialConfiguration={false}
          useUserService={true}
          heading={t('labels.therapyDetails')}
          notify={({ type, message }) => setAlert({ type, description: message })}
        />
      )}
    </div>
  );
}

export default UploadOrderDocument;
