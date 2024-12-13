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
    name: '',
    rules: {
      price: 0,
      accounts: [{ accountId: '', accountName: '' }],
      therapies: [{ therapyId: '', therapyName: '' }],
      roles: [{ roleId: '', roleName: '' }],
      users: [{ userId: '', userName: '' }]
    },
    approverUsers: [],
    approverUsers_augmented: [],
    attributes: [{ attributeType: 'Price', value: '' }]
  };

  //const initialValues = { groupName: '', attributes: [{ attributeType: 'Price', value: '' }], userSearch: '', attribute1: [] };

  // const initialValues = {
  //   name: '',
  //   rules: {
  //     price: 0,
  //     accounts: [],
  //     therapies: [],
  //     roles: [],
  //     users: []
  //   },

  //   approverUsers: [{}]
  // };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    attributes: Yup.array()
      .of(
        Yup.object({
          attributeType: Yup.string()
            .required('Attribute type is required')
            .oneOf(['Price', 'Account', 'Catelog', 'User'], 'Invalid attribute type'),
          value: Yup.string()
            .required('Value is required')
            .test('dynamic-validation', 'Invalid value for the selected attribute type', function (value) {
              const { attributeType } = this.parent;
              alert(attributeType);
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
      .min(1, 'At least one attribute is required')
      .optional(),
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
  const createLabelData = (userID) => [
    {
      id: userID.value,
      labelText: userID.name
    }
  ];

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
          React.useEffect(() => {
            if (!usersData) return;

            const updatedLocalUsersData = usersData.map((user) => ({
              ...user,
              isChecked: values.approverUsers.includes(user.value) // Mark checked based on Formik values
            }));

            // // Only update localUsersData if it has changed
            // if (JSON.stringify(updatedLocalUsersData) !== JSON.stringify(localUserData)) {
            //   setLocalUsersData(updatedLocalUsersData);
            // }
          }, [values.approverUsers]);

          const onRemoveUser = (itemToRemove) => {
            const updatedUsers = values.approverUsers.filter((userId) => userId !== itemToRemove.value);
            const updatedAugmentedUsers = values.approverUsers_augmented.filter((user) => user.value !== itemToRemove.value);

            setFieldValue('approverUsers', updatedUsers);
            setFieldValue('approverUsers_augmented', updatedAugmentedUsers);

            const updatedOptions = localUserData.map((option) => {
              if (option.value === itemToRemove.value) {
                return { ...option, isChecked: false };
              }
              return option;
            });

            setLocalUsersData(updatedOptions);
          };
          //   console.log('localuser', localUsersData);
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
                        {values.approverUsers_augmented?.map((item) => (
                          <Pills
                            id={item.id}
                            key={item.id}
                            labels={createLabelData(item)}
                            variant="secondary"
                            size="lg"
                            hasDeleteIcon={true}
                            onDelete={() => onRemoveUser(item)}
                          />
                        ))}
                      </div>
                      <div className="grid grid-gap-24 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
                        <Field
                          id="approverUsers"
                          name="approverUsers"
                          fieldlabel={t('approvergroup.selectuser')}
                          placeholder=" "
                          component={Components['multiSelectDropdown']}
                          isRequired
                          options={localUserData || []}
                          value={[...values.approverUsers]}

                          //key={dropdownKey}
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
