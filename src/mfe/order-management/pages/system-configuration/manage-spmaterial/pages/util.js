import { ALPHA_NUMERIC, ALPHABETIC_WITH_SPACE, ALPHA_NUMERIC_WITH_SPECIAL, NUMBER_REGEX } from '@src/components/form/ValidationRegExp';
import * as Yup from 'yup';
//TO DO AS Per Json
export const initialValues = {
  spProductID: '',
  productName: '',
  ndc: '',
  siteName: ''
};
//TO DO AS Per Json
export const validationSchema = Yup.object({
  spProductID: Yup.string().required('SP Product ID is required').matches(ALPHA_NUMERIC_WITH_SPECIAL, 'Invalid SP Product Id'),
  productName: Yup.string().required('Product Name is required').matches(ALPHA_NUMERIC_WITH_SPECIAL, 'Invalid Product Name'),
  ndc: Yup.string().matches(NUMBER_REGEX, 'Invalid NDC format').required('NDC is required'),
  siteName: Yup.string().required('Site Name is required').matches(ALPHA_NUMERIC, 'Site Name must be alphanumeric')
});
