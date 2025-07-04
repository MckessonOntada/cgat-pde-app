import React from 'react';
import { useTranslate } from '@src/translations/useTranslation';
import UploadFile from '@src/components/uploadFile/UploadFile';
import { Button } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import ContextMenu from '@src/mfe/core-config/system-admin/manage-sp-catalog/pages/context-menu';
import SPCrosswalkService from '@src/api/commonService/SPCrosswalkService';
import { handleDownload, validateFile } from '@src/components/uploadFile/uploadUtils';
import { useNavigate } from 'react-router-dom';
import CommonUtils, { downloadFile } from '@src/util/CommonUtils';
import { errorStatusCodes } from '@src/util/ApiUtils';

const DOWNLOAD_CONTEXT_OPTIONS = {
  DOWNLOAD_TEMPLATE: 'Download Template',
  DOWNLOAD_SP_PRODUCT_INFO: 'Download SP Product Info',
  DOWNLOAD_MATERIAL_INFO: 'Download Material Info',
  DOWNLOAD_INSTRUCTION_INFO: 'Download Instruction File'
};

const Upload = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const [notification, setNotification] = React.useState(null);
  const handleOnUpload = (values) => {
    setNotification(null);
    const { file } = values;
    if (!file) {
      setNotification({
        type: 'error',
        description: t('providers.errorMessage.fileUploadRequired')
      });
      return;
    }

    const formData = new FormData();
    formData.append('crossWalkData', file);

    SPCrosswalkService.uploadSPCrosswalk(formData)
      .then((response) => {
        if (response.status == 200) {
          setNotification({
            type: 'success',
            description: t('fileUpload.crosswalk.success')
          });
        } else if (response.status === 206) {
          const downloadErrorFile = () => {
            const blob = new Blob([response.data], {
              type: 'text/csv;charset=utf-8;'
            });
            downloadFile(blob, 'SP_Crosswalk_Upload_Log');
          };
          setNotification({
            type: 'info',
            description: (
              <div className="alert-controls">
                <p>{t('fileUpload.crosswalk.partialSuccess')}</p>
                <div>
                  <Button variant="secondary" color="success" onClick={downloadErrorFile}>
                    Download Report
                  </Button>
                </div>
              </div>
            ),
            isSticky: true
          });
        }
      })
      .catch((error) => {
        const { response: errorResponse = {} } = error;
        console.log('error', error);
        setNotification({
          type: 'error',
          description: t('errors.default'),
          isSticky: true
        });
      });
  };

  const handleOnDownload = (option) => {
    switch (option) {
      case DOWNLOAD_CONTEXT_OPTIONS.DOWNLOAD_TEMPLATE: {
        handleDownload('/templates/upload_sp_crosswalk_template.csv', 'upload_sp_crosswalk_template.csv');
        break;
      }
      case DOWNLOAD_CONTEXT_OPTIONS.DOWNLOAD_SP_PRODUCT_INFO: {
        SPCrosswalkService.downloadAssetTemplate('SPECIALITY_PHARMA').then((response) => {
          CommonUtils.downloadFile(new Blob([response.data], { type: 'text/csv;charset=utf-8;' }), 'Product Info');
        });
        break;
      }
      case DOWNLOAD_CONTEXT_OPTIONS.DOWNLOAD_MATERIAL_INFO: {
        SPCrosswalkService.downloadAssetTemplate('BUY_AND_BILL').then((response) => {
          CommonUtils.downloadFile(new Blob([response.data], { type: 'text/csv;charset=utf-8;' }), 'Material Info');
        });
        break;
      }
      case DOWNLOAD_CONTEXT_OPTIONS.DOWNLOAD_INSTRUCTION_INFO: {
        handleDownload('/templates/Material_crosswalk_instruction.txt', 'Material_crosswalk_instruction.txt');
        break;
      }
      default:
        return;
    }
  };

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button
          className="back-button-control"
          variant="tertiary"
          Icon={() => <IconArrowLeft />}
          onClick={() => navigate('/system-admin/config/crosswalk')}
          size="md">
          {t('label.backSpCrosswalk')}
        </Button>
      </div>
      <UploadFile
        primaryHeading={t('controls.uploadMaterialCrosswalk')}
        controlHeading={t('heading.uploadMaterialCrosswalkListCSV')}
        infoHeader={t('label.uploadCrosswalk.info')}
        isLoading={false}
        messages={[notification]}
        customDownload={
          <ContextMenu items={Object.values(DOWNLOAD_CONTEXT_OPTIONS)} onSelect={handleOnDownload}>
            <Button size="md" variant={'secondary'} className="context-menu__button">
              {t('controls.downloadCSVTemplate')}
            </Button>
          </ContextMenu>
        }
        onCloseAlert={() => setNotification(null)}
        upload={{
          caption: t('controls.uploadMaterialCrosswalk'),
          fn: handleOnUpload
        }}
        onFileSelection={(file) => validateFile(t, file, ['text/csv'])}
        prefixChildren={true}></UploadFile>
    </div>
  );
};

export default Upload;
