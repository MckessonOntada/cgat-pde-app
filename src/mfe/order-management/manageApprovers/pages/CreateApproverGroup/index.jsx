import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field, useFormikContext } from 'formik';
import { Button, Heading, Alert, Required, SearchableDropdown, Dropdown, Pills } from '@mckesson/mcp-component-library';
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

import {
  ALPHABETIC_WITH_SPECIAL,
  ALPHABETIC_WITH_SPACE,
  ADDRESS_REGEX,
  ZIP_REGEX,
  PHONE_REGEX,
  FAX_REGEX
} from '@src/components/form/ValidationRegExp';
import DiscardChangesModal from '@src/mfe/org-management/pages/role/manage/DiscardChangesModel';
import Components from '@src/components/form/Components';
import Attributes from './Attribute';
import { useApprover } from '../../context/ApproverContext';

const CreateApproverGroup = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = location.state || null;
  const { refreshData, usersData } = useApprover();
  const [localUserData, setLocalUsersData] = useState(usersData || []);

  useEffect(() => {
    if (usersData) {
      setLocalUsersData(usersData);
    }
  }, [usersData]);

  console.log('locauserData', localUserData);
  const handleGoBack = () => {
    navigate(RoutePaths.pathApproverManagement);
  };

  const initialValues = {
    // name: '',
    // rules: {
    //   price: 0,
    //   accounts: [{ accountId: '', accountName: '' }],
    //   therapies: [{ therapyId: '', therapyName: '' }],
    //   roles: [{ roleId: '', roleName: '' }],
    //   users: [{ userId: '', userName: '' }]
    // },
    // approverUsers: [],
    // approverUsers_augmented: [],
    // attributes: [{ attributeType: 'Price', value: '' }]
    name: '',
    rules: [{ attributeType: 'Price', value: '' }],
    approverUsers: []
  };

  // const validationSchema = Yup.object({
  //   name: Yup.string().required('Name is required'),
  //   attributes: Yup.array()
  //     .of(
  //       Yup.object({
  //         attributeType: Yup.string()
  //           .required('Attribute type is required')
  //           .oneOf(['Price', 'Account', 'Catalog', 'User'], 'Invalid attribute type'),
  //         value: Yup.string()
  //           .required('Value is required')
  //           .test('dynamic-validation', 'Invalid value for the selected attribute type', function (value) {
  //             const { attributeType } = this.parent; // Access the current object's parent
  //             if (attributeType === 'Price') {
  //               return Yup.number().min(0, 'Price must be greater than or equal to 0').isValidSync(value);
  //             }
  //             if (['Account', 'Catalog', 'User'].includes(attributeType)) {
  //               return value !== '';
  //             }
  //             return true;
  //           })
  //       })
  //     )
  //     .min(1, 'At least one attribute is required')
  //     .optional(),
  //   approverUsers: Yup.array().of(Yup.string().required('Approver user is required')).min(1, 'At least one approver user must be selected')
  // });

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    rules: Yup.array()
      .of(
        Yup.object({
          attributeType: Yup.string()
            .required('Attribute type is required')
            .oneOf(['Price', 'Account', 'Catalog', 'User'], 'Invalid attribute type'),
          value: Yup.mixed()
            .required('Value is required')
            .test('dynamic-validation', 'Invalid value for the selected attribute type', function (value) {
              const { attributeType } = this.parent;

              if (Array.isArray(value)) {
                // If array is empty, make it required
                if (value.length === 0) {
                  return this.createError({ message: 'Array cannot be empty' });
                }
                // If array has at least one value, validation passes
                return true;
              }

              if (attributeType === 'Price') {
                return Yup.number().min(0, 'Price must be greater than or equal to 0').isValidSync(value);
              }

              if (['Account', 'Catelog', 'User'].includes(attributeType)) {
                return value !== '';
              }

              return true;
            })
        })
      )
      .required('Required'),
    approverUsers: Yup.array().required('Approver Users is required').min(1, 'At least one approver user must be selected')
  });

  const handleSubmit = (values) => {
    const payload = {
      isActive: true
    };

    mutate(
      { payload },
      {
        onSuccess: (response) => {
          console.log('  created/updated successfully:', response);
        },
        onError: (error) => {
          const errorKey = handleApiError(error);
          const actionType = isPending ? 'Approve' : isEdit ? 'Update' : 'Create';
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
  const handleCancel = () => {};

  const handleNavigate = () => {};

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleGoBack} size="md">
          {t('approvergroup.header.backmessage')}
        </Button>
      </div>

      <ModuleHeader heading={<Heading as="h1">{t('approvergroup.create_approvergroup')}</Heading>} />

      {/* {isAlertVisible && <Alert description={alert.message} onClose={handleAlertClose} type={alert.type} duration={10000} />} */}

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
                      <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-start">
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
                          size="lg"
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
