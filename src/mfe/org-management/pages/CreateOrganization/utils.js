import * as Yup from 'yup';

export const INITIAL_VALUES = {
    first_name: '',
    middle_name: '',
    last_name: '',
    address_1: '',
    address_2: '',
    city: '',
    zip: '',
    state: '',
    email: '',
    phoneInput: '',
    fax: ''
  };
  
export const getValidationSchema = (t) => {
    return Yup.object({
        first_name: Yup.string().required(
          t('orgManagement.create_org.validation.first_name_required')
        ),
        middle_name: Yup.string(),
        last_name: Yup.string().required(t('orgManagement.create_org.validation.last_name_required')),
        address_1: Yup.string().required(t('orgManagement.create_org.validation.address_1_required')),
        address_2: Yup.string(),
        city: Yup.string().required(t('orgManagement.create_org.validation.city_required')),
        zip: Yup.string().required(t('orgManagement.create_org.validation.zip_required')),
        state: Yup.string().required(t('orgManagement.create_org.validation.state_required')),
        email: Yup.string()
          .email(t('orgManagement.create_org.validation.invalid_email'))
          .required(t('orgManagement.create_org.validation.email_required')),
        phoneInput: Yup.string()
          .matches(/^[0-9]{10}$/, t('orgManagement.create_org.validation.phone_no_required'))
          .required(t('orgManagement.create_org.validation.phone_no_required')),
        fax: Yup.string().required(t('orgManagement.create_org.validation.fax_required'))
      });
}
