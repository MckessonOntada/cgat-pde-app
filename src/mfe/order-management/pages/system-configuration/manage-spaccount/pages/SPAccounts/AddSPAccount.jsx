import React, { useState, useEffect } from 'react';
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
import DiscardChangesModal from '@src/mfe/org-management/pages/role/manage/DiscardChangesModel';
import { routeConstants } from '../../routes/constants';
import { SPAccountData } from '../../mockData/SPAccountData';

const AddSPAccount = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { spAccountId } = useParams();
  const { selectedOrganization } = useOrgAccountSelectionContext();
  const location = useLocation();
  const [isDirty, setIsDirty] = React.useState(false);
  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);

  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    if (spAccountId) {
      const match = SPAccountData.find((item) => item.id === spAccountId);
      setSelectedAccount(match);
    }
  }, [spAccountId]);

  const goBack = () => {
    navigate('/orders/system-configuration/manage-spaccount');
  };

  const handleSubmit = (values) => {
    if (!!spAccountId) {
      navigate(`../${routeConstants.VIEW_SPACCOUNT.replace(':spAccountId', spAccountId)}`, { state: { isSuccess: true } });
    } else {
      navigate('/orders/system-configuration/manage-spaccount', { state: { isSuccess: true } });
    }
  };

  const handleCancel = () => {
    if (!!spAccountId) {
      isDirty ? setModalSuccessCallback('details') : navigate(`../${routeConstants.VIEW_SPACCOUNT.replace(':spAccountId', spAccountId)}`);
    } else {
      isDirty ? setModalSuccessCallback('list') : navigate('/orders/system-configuration/manage-spaccount');
    }
  };

  const handleNavigate = () => {
    if (modalSuccessCallback === 'list') {
      navigate('/orders/system-configuration/manage-spaccount');
    } else if (modalSuccessCallback === 'details') {
      navigate(`../${routeConstants.VIEW_SPACCOUNT.replace(':spAccountId', spAccountId)}`);
    }
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
          heading={
            <Heading as="h1">{t(spAccountId ? 'manageSPAccount.heading.editSPAccount' : 'manageSPAccount.heading.addSPAccount')}</Heading>
          }
          controls={<Heading as="h2">{`${t('manageSPAccount.heading.organization')} - ${selectedOrganization?.name}`}</Heading>}
        />

        <Formik
          initialValues={initialValuesforSPAccount(selectedAccount)}
          validationSchema={validationSchemaforSPAccount(t)}
          enableReinitialize
          onSubmit={(values, actions) => {
            handleSubmit(values);
          }}>
          {({ values, isValid, dirty }) => {
            useEffect(() => {
              setIsDirty(dirty);
            }, [dirty]);
            return (
              <Form>
                <div className="MCP-panel-container">
                  <SPAccountFormSegment />
                </div>
                <div className={'buttonGroup'}>
                  <Button variant="secondary" type="button" onClick={handleCancel} size={'md'}>
                    {t('manageSPAccount.button.cancel')}
                  </Button>

                  <Button type="submit" size={'md'}>
                    {t(spAccountId ? 'manageSPAccount.button.save' : 'manageSPAccount.button.create')}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
        <DiscardChangesModal
          heading={t('messages.confirmation.discard')}
          description={t('messages.confirmation.cancel')}
          isOpen={Boolean(modalSuccessCallback)}
          onClose={() => setModalSuccessCallback(null)}
          onConfirm={handleNavigate}
        />
      </div>
    </div>
  );
};

export default AddSPAccount;
