import React, { useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { Button, Heading, AutoSuggestDropdown, Label, Required, TextError, Alert } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { UserDetailsFormSegment } from '@src/mfe/user-management/pages/CreateUser';
import Components from '@src/components/form/Components';
import ModuleHeader from '@src/components/module-header';
import './index.scss';
import mainLayoutStyles from '@src/assets/styles/MainLayout.module.scss';
import AppRoutes from '@src/routes/AppRoutes';
import { useNavigate } from 'react-router-dom';
import PrimaryHeader from '@src/components/header/PrimaryHeader';
import { useMutation, useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import CommonDataService from '../../api/commonService/CommonDataService';
import {
  ADDRESS_REGEX,
  ALPHABETIC_WITH_SPACE,
  ALPHABETIC_WITH_SPECIAL,
  FAX_REGEX,
  PHONE_REGEX,
  ZIP_REGEX,
  ALPHABETIC_WITH_SPECIAL_AND_ACCENTED
} from '@src/components/form/ValidationRegExp';
import MultiSelectDropdown from '@src/components/form/MultiSelectDropdown';
import { handleApiError } from '@src/util/ApiUtils';

const SignUp = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alert, setAlert] = useState(null);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  useEffect(() => {
    if (isAlertVisible) {
      const timer = setTimeout(() => {
        setIsAlertVisible(false);
      }, 10000);

      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [isAlertVisible]);

  const handleAlertClose = () => {
    setIsAlertVisible(false);
  };

  const { mutate, isLoading, isError, data } = useMutation(async ({ payload }) => {
    const res = await HttpResourceService.callRest(`${ApiRoutes.POST_SIGNUP_USER}`, httpVerb.POST, payload);
    return res.data;
  });

  const [requestParams, setRequestParams] = useState({ pageNo: 0, pageSize: 20, sortBy: 'name', sortOrder: 'asc', status: ['active'] });

  const {
    isLoading: loadingOrg,
    data: organizationList,
    isError: isGetOrganizationError,
    refetch
  } = useQuery({
    queryKey: ['organizationListPublic'],
    queryFn: async () => {
      const res = await CommonDataService.getOrganizationListAsPublic(requestParams);
      const { content } = res;
      let _data = [...[], ...content];
      if (selectedOrganization) {
        let findOrg = _data.find((item) => item.value == selectedOrganization.value);
        !findOrg && _data.unshift(selectedOrganization);
      }
      return _data;
    },
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    const getData = setTimeout(() => {
      refetch(requestParams);
    }, 500);
    return () => clearTimeout(getData);
  }, [requestParams]);

  const initialValues = {
    name: {
      firstName: '',
      middleName: '',
      lastName: ''
    },
    contact: {
      email: '',
      countryCode: '91',
      phone: '',
      fax: ''
    },
    address: {
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: ''
    },
    practiceId: '',
    comment: ''
  };

  const validationSchema = Yup.object({
    name: Yup.object({
      firstName: Yup.string()
        .matches(ALPHABETIC_WITH_SPECIAL_AND_ACCENTED, t('userManagement.create_user.validation.first_name')) // Only alphabets
        .min(2, t('userManagement.create_user.validation.first_name_min_max'))
        .required(t('userManagement.create_user.validation.first_name_required')),
      middleName: Yup.string()
        .matches(ALPHABETIC_WITH_SPECIAL_AND_ACCENTED, t('userManagement.create_user.validation.middle_name'))
        .min(2, t('userManagement.create_user.validation.middle_name_min_max'))
        .nullable(),
      lastName: Yup.string()
        .matches(ALPHABETIC_WITH_SPECIAL_AND_ACCENTED, t('userManagement.create_user.validation.last_name')) // Only alphabets
        .min(2, t('userManagement.create_user.validation.last_name_min_max'))
        .required(t('userManagement.create_user.validation.last_name_required'))
    }),

    contact: Yup.object({
      email: Yup.string()
        .email(t('userManagement.create_user.validation.invalid_email'))
        .required(t('userManagement.create_user.validation.email_required')),
      phone: Yup.string()
        .matches(PHONE_REGEX, t('userManagement.create_user.validation.phone_no')) // 10 digits only
        .required(t('userManagement.create_user.validation.phone_no_required')),
      fax: Yup.string().matches(FAX_REGEX, t('userManagement.create_user.validation.fax'))
    }),

    address: Yup.object({
      address1: Yup.string()
        .matches(ADDRESS_REGEX, t('userManagement.create_user.validation.address_1')) // Alphanumeric and special characters
        .min(2, t('userManagement.create_user.validation.address_1'))
        .required(t('userManagement.create_user.validation.address_1_required')),
      address2: Yup.string().matches(ADDRESS_REGEX, t('userManagement.create_user.validation.address_1')), // Optional field
      city: Yup.string()
        .matches(ALPHABETIC_WITH_SPACE, t('userManagement.create_user.validation.city')) // Only alphabets
        .min(2, t('userManagement.create_user.validation.city_min_max'))
        .required(t('userManagement.create_user.validation.city_required')),
      state: Yup.string().required(t('userManagement.create_user.validation.state_required')),
      zip: Yup.string()
        .matches(ZIP_REGEX, t('userManagement.create_user.validation.zip')) // Only digits
        .required(t('userManagement.create_user.validation.zip_required'))
    }),
    practiceId: Yup.number().required(t('form.organization_required')).nullable()
  });

  const handleSubmit = (values) => {
    console.log(JSON.stringify(values, null, 2));
    const payload = {
      ...values,
      isActive: true
    };

    mutate(
      {
        payload
      },
      {
        onSuccess: (response) => {
          console.log('User request created/updated successfully:', response);
          navigate(`../${AppRoutes.pathSignin}`);
        },
        onError: (error) => {
          const errorKey = handleApiError(error);
          setAlert({ type: 'error', message: t(errorKey) });
          setIsAlertVisible(true);
        }
      }
    );
  };

  const onSearchOrganization = (event) => {
    const payload = { ...requestParams, query: event };
    setRequestParams(payload);
  };

  const onChangeOrganization = (selectedOrg, setFieldValue) => {
    let _selected = organizationList.find((ele) => ele.value == selectedOrg);
    setSelectedOrganization(_selected);
    setFieldValue('practiceId', _selected.id);
  };

  return (
    <div className={mainLayoutStyles.appContainer}>
      <PrimaryHeader />
      <div className={`${mainLayoutStyles['app-wrapper']}`}>
        <div className={`${mainLayoutStyles.home} max-container`}>
          <div className="MCP-module-wrapper">
            <ModuleHeader heading={<Heading as="h1">{t('forms.headings.newUserRegistration')}</Heading>} />
            {isAlertVisible && <Alert description={alert.message} onClose={handleAlertClose} type={alert.type} duration={10000} />}
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              enableReinitialize
              onSubmit={(values, actions) => {
                handleSubmit(values);
                actions.setSubmitting(false);
              }}>
              {({ values, errors, touched, setFieldValue, setFieldTouched }) => (
                <Form>
                  <div className="MCP-panel-container">
                    <UserDetailsFormSegment />
                    <div>
                      <Heading as="h3">{t('forms.headings.organization_details')}</Heading>
                    </div>
                    <div className="form-segment">
                      <div className="line-height">
                        <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 ">
                          <MultiSelectDropdown
                            id={'select-org-search'}
                            label={t('forms.labels.organization')}
                            isRequired={true}
                            isMultiSelect={false}
                            placeholder={t('forms.labels.organization')}
                            onChange={(event) => onChangeOrganization(event, setFieldValue)}
                            options={organizationList || []}
                            variant={'async'}
                            onSearch={(event) => onSearchOrganization(event)}
                            recordsCountToEnableSearch={5}
                            size="lg"
                            isSortEnable={false}
                            value={selectedOrganization?.value || ''}
                          />
                        </div>
                        {errors.practiceId && touched.practiceId && !values.practiceId && <TextError errorMessage={errors.practiceId} />}
                      </div>
                      <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                        <Field
                          name="comment"
                          fieldlabel={t('forms.labels.comment')}
                          placeholder=" "
                          component={Components['textarea']}
                          maxCharHelperText={t('forms.placeholder.max_5000_chars')}
                          maxCharLimit={5000}
                        />
                      </div>
                    </div>{' '}
                  </div>
                  <div className={'buttonGroup'}>
                    <Button size="md" variant="secondary" type="button" onClick={() => navigate('/')}>
                      {t('forms.buttons.cancel')}
                    </Button>
                    <Button type="submit" variant="primary" size="md">
                      {t('forms.buttons.createaccount')}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
