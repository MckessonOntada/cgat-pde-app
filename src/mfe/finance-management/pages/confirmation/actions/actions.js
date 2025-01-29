import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import useSnackbar from '@src/hooks/useSnackbar';
import CommonUtils from '@src/util/CommonUtils';
import { useMutation } from 'react-query';

export const useExportStatementPDF = () => {
  const { showSnackbar } = useSnackbar();
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
            const matches = contentDisposition.match(/filename="([^"]+)"/);
            if (matches && matches[1]) {
              fileName = matches[1];
            }
          }

          const blob = new Blob([response.data], { type: 'application/' + type });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();

          showSnackbar({
            description: `${fileName} exported successful`,
            type: 'success'
          });
        }
      },
      onError: (error) => {
        if (error && error.response && error.response.data) {
          showSnackbar({
            description: CommonUtils.isNonEmptyString(error.response.data.message)
              ? error.response.data.message
              : `Error While exporting excel`,
            type: 'error'
          });
        }
      }
    }
  );
};
