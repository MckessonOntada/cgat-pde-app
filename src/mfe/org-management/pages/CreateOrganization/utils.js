import * as Yup from 'yup';
import {
  ALPHA_NUMERIC_WITH_SPECIAL,
  ALPHABETIC_ONLY,
  ADDRESS_REGEX,
  ZIP_REGEX,
  PHONE_REGEX,
  FAX_REGEX
} from '../../../../components/form/ValidationRegExp';

export const INITIAL_VALUES = {
  org_name: '',
  file: '',
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
      org_name: Yup.string()
        // .required(t('orgManagement.create_org.validation.org_name_required'))
        .matches(
          ALPHA_NUMERIC_WITH_SPECIAL,
          t('orgManagement.create_org.validation.org_name_invalid')
        )
        .max(100, t('orgManagement.create_org.validation.org_name_max')),
  
      first_name: Yup.string()
        // .required(t('orgManagement.create_org.validation.first_name_required'))
        .matches(
          ALPHABETIC_ONLY,
          t('orgManagement.create_org.validation.contact_person_first_name_invalid')
        )
        .max(50, t('orgManagement.create_org.validation.first_name_max')),
  
      middle_name: Yup.string()
        .matches(ALPHABETIC_ONLY, t('orgManagement.create_org.validation.middle_name_invalid'))
        .max(50, t('orgManagement.create_org.validation.middle_name_max')),
  
      last_name: Yup.string()
        // .required(t('orgManagement.create_org.validation.last_name_required'))
        .matches(
          ALPHABETIC_ONLY,
          t('orgManagement.create_org.validation.contact_person_last_name_invalid')
        )
        .max(50, t('orgManagement.create_org.validation.last_name_max')),
  
      address_1: Yup.string()
        // .required(t('orgManagement.create_org.validation.address_1_required'))
        .matches(ADDRESS_REGEX, t('orgManagement.create_org.validation.address_1_invalid'))
        .max(100, t('orgManagement.create_org.validation.address_1_max')),
  
      address_2: Yup.string()
        .matches(ADDRESS_REGEX, t('orgManagement.create_org.validation.address_2_invalid'))
        .max(250, t('orgManagement.create_org.validation.address_2_max')),
  
      city: Yup.string()
        // .required(t('orgManagement.create_org.validation.city_required'))
        .matches(ALPHABETIC_ONLY, t('orgManagement.create_org.validation.city_invalid'))
        .max(100, t('orgManagement.create_org.validation.city_max')),
  
      zip: Yup.string()
        // .required(t('orgManagement.create_org.validation.zip_required'))
        .matches(ZIP_REGEX, t('orgManagement.create_org.validation.zip_invalid')),
  
      state: Yup.string()
        // .required(t('orgManagement.create_org.validation.state_required'))
        .matches(ALPHABETIC_ONLY, t('orgManagement.create_org.validation.state_invalid'))
        .max(100, t('orgManagement.create_org.validation.state_max')),
  
      email: Yup.string()
        .email(t('orgManagement.create_org.validation.invalid_email'))
        // .required(t('orgManagement.create_org.validation.email_required'))
        .max(100, t('orgManagement.create_org.validation.email_max')),
  
      phoneInput: Yup.string()
        .matches(PHONE_REGEX, t('orgManagement.create_org.validation.phone_no_invalid'))
        // .required(t('orgManagement.create_org.validation.phone_no_required'))
        ,
  
      fax: Yup.string()
        .matches(FAX_REGEX, t('orgManagement.create_org.validation.fax_invalid'))
        .max(15, t('orgManagement.create_org.validation.fax_max')),
  
    });
}
