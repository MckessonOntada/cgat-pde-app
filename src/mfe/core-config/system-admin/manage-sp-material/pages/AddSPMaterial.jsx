import DiscardChangesModal from '@src/mfe/org-management/pages/role/manage/DiscardChangesModel';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Field, Formik, Form } from 'formik';
import { Button, Heading } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '@src/components/module-header';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { initialValues, validationSchema } from './util';
import Components from '@src/components/form/Components';

const AddSPMaterial = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { spMaterialId } = useParams();
  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);

  const handleNavigate = () => {
    if (modalSuccessCallback === 'list') {
      navigate('/core-config/manage-sp-material');
    }
  };
  const handleCancel = () => {
    navigate('/core-config/manage-sp-material');
  };

  const handleSubmit = (values) => {
    navigate('/core-config/manage-sp-material', { state: { isSuccess: true } });
  };

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button
          className="back-button-control"
          variant="tertiary"
          Icon={() => <IconArrowLeft />}
          onClick={() => navigate('/core-config/manage-sp-material')}
          size="md">
          {t('manageSPMaterial.BacktoPage')}
        </Button>
      </div>
      <ModuleHeader
        heading={<Heading as="h1">{t(spMaterialId ? 'manageSPMaterial.heading.editSPMaterial' : 'manageSPMaterial.heading.addSPMaterial')}</Heading>}
      />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={(values, actions) => {
          handleSubmit(values);
          actions.setSubmitting(false);
        }}>
        {({ values, isValid, dirty }) => {
          return (
            <Form>
              <div className="MCP-panel-container">
                <div className="MCP-module-wrapper">
                  <div className="MCP-module-body form-container">
                    <div className="headingBox firstHeading">
                      <Heading as="h3">{t('manageSPMaterial.heading.materialDetails')}</Heading>
                    </div>
                    <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-baseline">
                      <Field
                        id="spProductID"
                        name="spProductID"
                        label={t('manageSPMaterial.table.spproductId')}
                        placeholder=" "
                        isRequired
                        component={Components['input']}
                        maxLength={50}
                      />
                      <Field
                        id="productName"
                        name="productName"
                        label={t('manageSPMaterial.table.productname')}
                        placeholder=" "
                        component={Components['input']}
                        maxLength={100}
                      />
                      <Field name="ndc" label={t('manageSPMaterial.table.ndc')} placeholder=" " isRequired component={Components['input']} maxLength={50} />
                    </div>
                    <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-baseline">
                      <Field
                        name="siteName"
                        label={t('manageSPMaterial.table.sitename')}
                        placeholder=" "
                        isRequired
                        component={Components['input']}
                        maxLength={50}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="buttonGroup">
                <Button variant="secondary" type="button" onClick={handleCancel} size="md">
                  {t('manageSPMaterial.button.cancel')}
                </Button>

                <Button type="submit" size="md">
                  {t(spMaterialId ? 'manageSPMaterial.button.saveandupdate' : 'manageSPMaterial.button.create')}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
      <DiscardChangesModal
        heading="Discard Changes"
        description="You have changed user details. Do you still want to go back? Your changes will be discarded!"
        isOpen={Boolean(modalSuccessCallback)}
        onClose={() => setModalSuccessCallback(null)}
        onConfirm={handleNavigate}
      />
    </div>
  );
};

export default AddSPMaterial;
