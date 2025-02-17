import { useReactToPrint } from 'react-to-print';
/**
 * Custom hook to handle print functionality
 * @param {Object} contentRef - The ref of the content to be printed
 * @param {string} pageStyle - The custom styles for the printed page
 * @param {Object} rest - Any additional props for customization
 * @returns {Function} - A function that triggers the print
 */
export const useCustomPrint = (contentRef, pageStyle = '', ...rest) => {
  const defaultPageStyle = `
    @page {
        size: A4;
    }
   .order-stepper-wrapper {
        display: none  !important;
    }
    button{
        display: none !important;
    }
  `;

  return useReactToPrint({
    contentRef,
    pageStyle: defaultPageStyle + pageStyle,
    ...rest, 
  });
};