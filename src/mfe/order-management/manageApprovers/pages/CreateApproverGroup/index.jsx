import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { Button, Heading, Alert, Pills } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { PATHS } from '../../routes/constants';
import ModuleHeader from '@src/components/module-header';
import { useQuery, useMutation } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { handleApiError, serializeParams } from '@src/util/ApiUtils';
import AuthUtils from '@src/util/AuthUtils';
import { RoutePaths } from '@src/routes/constants';
import { ALPHABETIC_WITH_SPECIAL } from '@src/components/form/ValidationRegExp';
import DiscardChangesModal from '@src/mfe/org-management/pages/role/manage/DiscardChangesModel';
import Components from '@src/components/form/Components';
import Attributes from './Attribute';
import { useApprover } from '../../context/ApproverContext';
import { transformAttributesToRules } from './formUtils';
import './index.scss';

const CreateApproverGroup = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = location.state || null;
  const { refreshData, usersData } = useApprover();
  const [localUserData, setLocalUsersData] = useState(usersData || []);
  const practiceId = AuthUtils.getPracticeId();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  useEffect(() => {
    if (usersData) {
      setLocalUsersData(usersData);
    }
  }, [usersData]);

  const handleGoBack = () => {
    navigate(RoutePaths.pathApproverManagement);
  };

  const initialValues = {
    name: '',
    rules: [{ attributeType: 'Price', value: '' }],
    approverUsers: [],
    attributeuseroption: 'user_role' // Default value
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required(t('approvergroup.create.validation.approvergroupname_required'))
      .matches(ALPHABETIC_WITH_SPECIAL, t('approvergroup.create.validation.approvergroupname')) // Only alphabets
      .min(2, t('approvergroup.create.validation.approvergroupname_min_max'))
      .max(50, t('approvergroup.create.validation.approvergroupname_min_max')),
    rules: Yup.array()
      .of(
        Yup.object({
          attributeType: Yup.string()
            .required(t('approvergroup.create.validation.approverattribute_required'))
            .oneOf(['Price', 'Account', 'Catalog', 'User'], t('approvergroup.create.validation.approverattribute_required')),
          value: Yup.mixed()
            .required(t('approvergroup.create.validation.price_required'))
            .test('dynamic-validation', t('approvergroup.create.validation.price'), function (value) {
              const { attributeType } = this.parent;

              if (Array.isArray(value)) {
                if (value.length === 0) {
                  if (attributeType === 'Catalog') {
                    return this.createError({ message: t('approvergroup.create.validation.therapy_required') });
                  } else if (attributeType === 'Account') {
                    return this.createError({ message: t('approvergroup.create.validation.account_required') });
                  } else if (attributeType === 'User') {
                    return this.createError({ message: t('approvergroup.create.validation.user_required') });
                  }
                }
                return true;
              }
              if (attributeType === 'Price') {
                return Yup.number().min(0.001, t('approvergroup.create.validation.price')).isValidSync(value);
              }

              if (['Account', 'Catelog', 'User'].includes(attributeType)) {
                return value !== '';
              }

              return true;
            })
        })
      )
      .required('Required'),
    approverUsers: Yup.array()
      .required(t('approvergroup.create.validation.approveruser_required'))
      .min(1, t('approvergroup.create.validation.approveruser_required'))
  });

  const handleSubmit = (values, practiceId) => {
    console.log('Practice ID before submission: ', practiceId);
    console.log(JSON.stringify(transformAttributesToRules(values, practiceId), null, 2));
    alert(JSON.stringify(transformAttributesToRules(values, practiceId), null, 2));
    navigate(RoutePaths.pathApproverManagement, { state: { isSuccess: true } });

    const payload = {
      isActive: true
    };

    mutate(
      { payload },
      {
        onSuccess: (response) => {
          console.log('  created/updated successfully:', response);
          navigate(RoutePaths.pathApproverManagement, { state: { isSuccess: true } });
        },
        onError: (error) => {
          const errorKey = handleApiError(error);
          setAlert({ type: 'error', message: t(errorKey) });
          setIsAlertVisible(true);
        }
      }
    );
  };

  const createLabelData = (values) => {
    let val = values.approverUsers_augmented?.map(({ name, value }) => ({
      labelText: name,
      id: value
    }));
    return val;
  };
  const handleCancel = () => {
    navigate(RoutePaths.pathApproverManagement);
  };

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleGoBack} size="md">
          {t('approvergroup.header.backmessage')}
        </Button>
      </div>

      <ModuleHeader heading={<Heading as="h1">{t('approvergroup.create_approvergroup')}</Heading>} />

      {isAlertVisible && <Alert description={alert.message} onClose={handleAlertClose} type={alert.type} duration={10000} />}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={(values, actions) => {
          handleSubmit(values);
          actions.setSubmitting(false);
        }}>
        {({ values, setFieldValue, isValid, handleChange, errors, touched }) => {
          const onRemoveUser = (itemToRemove) => {
            const updatedUsers = values.approverUsers.filter((userId) => userId !== itemToRemove);
            const updatedAugmentedUsers = values.approverUsers_augmented.filter((user) => user.value !== itemToRemove);
            setFieldValue('approverUsers', updatedUsers);
            setFieldValue('approverUsers_augmented', updatedAugmentedUsers);

            const updatedOptions = localUserData.map((option) => {
              if (option.value === itemToRemove) {
                return { ...option, isChecked: false };
              }
              return option;
            });

            setLocalUsersData(() => updatedOptions);
          };
          return (
            <Form>
              <div className="MCP-panel-container">
                <Heading as="h2">{t('approvergroup.approvergroupdetails')}</Heading>
                <div className="MCP-module-wrapper">
                  <div className="MCP-module-body form-container">
                    <div>
                      <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                        <Field
                          id="name"
                          name="name"
                          label={t('approvergroup.approvergroupname')}
                          placeholder=" "
                          isRequired
                          component={Components['input']}
                          maxLength={50}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="headingBox">
                        <Heading as="h2">{t('approvergroup.attributes')}</Heading>
                      </div>
                      <div>
                        <Attributes values={values} errors={errors} touched={touched} handleChange={handleChange} />
                      </div>
                    </div>

                    <div>
                      <div className="headingBox">
                        <Heading as="h2">{t('approvergroup.approveuserlist')}</Heading>
                      </div>
                      <div className="pills-container">
                        <Pills
                          id={'pill-id'}
                          key={'pills'}
                          labels={createLabelData(values)}
                          variant="secondary"
                          hasDeleteIcon={true}
                          onDelete={(item) => onRemoveUser(item)}
                        />
                      </div>
                      <div className="grid grid-gap-24 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                        <Field
                          id="approverUsers"
                          name="approverUsers"
                          fieldlabel={t('approvergroup.selectuser')}
                          placeholder=" "
                          component={Components['multiSelectDropdown']}
                          isRequired
                          options={localUserData || []}
                          value={[...values.approverUsers]}
                          getUpdatedOptions={(values) => {
                            setLocalUsersData(() => values);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={'buttonGroup'}>
                <Button variant="secondary" type="button" onClick={handleCancel} size={'md'}>
                  {t(isEdit ? 'approvergroup.button.back' : 'approvergroup.button.cancel')}
                </Button>

                <Button type="submit" size={'md'}>
                  {t(isEdit ? 'approvergroup.button.updategroup' : 'approvergroup.button.creategroup')}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default CreateApproverGroup;
