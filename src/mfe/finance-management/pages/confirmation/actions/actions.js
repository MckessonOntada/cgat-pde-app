import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import useAlert from '@src/hooks/useAlert';
import { PATHS } from '@src/mfe/finance-management/routes';
import CommonUtils from '@src/util/CommonUtils';
import { useMutation } from 'react-query';

export const useExportStatementPDF = (exportType) => {
  const { showAlert } = useAlert();
  const alertContainerId = 'summary-alert-container';
  return useMutation(
    async (data) => {
      const { url, payload, type } = data;
      return await HttpResourceService.callRest(
        url,
        httpVerb.POST,
        payload,
        undefined,
        false,
        false,
        'blob' // Set responseType to 'blob'
      );
    },
    {
      onSuccess: (response, variables) => {
        const { type, confirmationNumber, t } = variables;
        if (response && response.data) {
          const contentDisposition = response.headers['content-disposition'] || response.headers['Content-Disposition'];
          let fileName = (confirmationNumber ? confirmationNumber : 'Pending bill') + '.' + type;

          if (contentDisposition && contentDisposition.indexOf('filename=') !== -1) {
            let matches = contentDisposition.match(/filename="([^"]+)"/); // Check for quoted filename

            if (!matches) {
              matches = contentDisposition.match(/filename=([^;]+)/); // Fallback: no quotes
            }

            if (matches && matches[1]) {
              fileName = matches[1];
            }
          } else {
            // If contentDisposition is null or does not contain filename, append string to filename
            if (exportType === PATHS.paymentHistory) {
              fileName = 'PaymentHistoryDetails_' + fileName;
            } else if (exportType === PATHS.pendingPayments) {
              fileName = 'PendingPaymentDetails_' + fileName;
            }
          }

          const blob = new Blob([response.data], { type: 'application/' + type });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();

          showAlert({
            description: `${fileName} exported successful`,
            type: 'success',
            anchorEl: alertContainerId
          });
        }
      },
      onError: (error) => {
        if (error && error.response && error.response.data) {
          showAlert({
            description: t('errors.default'),
            type: 'error',
            anchorEl: alertContainerId
          });
        }
      }
    }
  );
};
