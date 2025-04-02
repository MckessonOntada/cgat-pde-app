import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as EditPencil } from '@src/assets/image/edit_pencil.svg';
import { Badge, Button, Heading, Switch, Alert, Modal, CheckboxGroup, IconButton, Loader } from '@mckesson/mcp-component-library';
import { Formik, Form } from 'formik';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import ModuleHeader from '@src/components/module-header';
import { useOrgAccountSelectionContext } from '@src/mfe/order-management/components/orgAccountSelection/context/OrgAccountSelectionContext';
import { initialValuesforSPAccount, validationSchemaforSPAccount } from '../../util';
import SPAccountFormSegment from './SPAccountFormSegment';

const AddSPAccount = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { spAccountId } = useParams();
  const { selectedOrganization } = useOrgAccountSelectionContext();
  const location = useLocation();

  const goBack = () => {
    navigate('/orders/system-configuration/manage-spaccount');
  };
  const handleSubmit = (values) => {
    navigate('/orders/system-configuration/manage-spaccount', { state: { isSuccess: true } });
  };

  const handleCancel = () => {
    navigate('/orders/system-configuration/manage-spaccount');
  };

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={goBack} size="md">
          {t('manageSPAccount.BacktoPage')}
        </Button>
      </div>

      <div className="MCP-module-body">
        <ModuleHeader
          heading={<Heading as="h1">{t('manageSPAccount.heading.addSPAccount')}</Heading>}
          controls={<Heading as="h2">{`${t('manageSPAccount.heading.organization')} - ${selectedOrganization?.name}`}</Heading>}
        />

        <Formik
          initialValues={initialValuesforSPAccount}
          validationSchema={validationSchemaforSPAccount(t)}
          enableReinitialize
          onSubmit={(values, actions) => {
            handleSubmit(values);
          }}>
          {({ values, isValid, dirty }) => {
            return (
              <Form>
                <div className="MCP-panel-container">
                  <SPAccountFormSegment />
                </div>
                <div className={'buttonGroup'}>
                  <Button variant="secondary" type="button" onClick={handleCancel} size={'md'}>
                    {t('userManagement.button.back')}
                  </Button>

                  <Button type="submit" size={'md'}>
                    {t('manageSPAccount.button.create')}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default AddSPAccount;
