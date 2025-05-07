import React from 'react';
import { Button, Heading } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useTranslate } from '@src/translations/useTranslation';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@src/components/pageHeader';
import style from './style.module.scss';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { TableProvider } from '@src/mfe/core-config/manage-providers/context/TableContext';
import MaterialService from '@src/api/commonService/MaterialService';
import Materials from './Materials';
import Products from './Products';
import { ChannelType } from '@src/mfe/order-management/pages/system-configuration/manage-spaccount/util';
import { CHANNEL_TYPE } from '@src/mfe/order-management/pages/create/form-segments/Constants';
import Summary from './Summary';
import { useDispatch } from 'react-redux';
import { closeModal, openModal } from '@src/store/reducer/modalReducer';

const INITIAL_STATE = {
  material: '',
  spProduct: ''
};

const VALIDATION_SCHEMA = Yup.object().shape({
  material: Yup.string().nullable(),
  spProduct: Yup.string().nullable()
});

const CreateCrosswalk = () => {
  const navigate = useNavigate();
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const [formState, setForState] = React.useState(INITIAL_STATE);
  const [schema, setSchema] = React.useState(VALIDATION_SCHEMA);
  const [material, setMaterial] = React.useState(null);
  const [spProduct, setSpProduct] = React.useState(null);

  const handleOnSubmit = () => {};
  const handleOnLinkMaterial = () => {};
  const confirmLinkMaterials = () => {
    const state = {
      title: 'Confirmation',
      body: (
        <div className="MCP-modal-body">
          <p>Are you sure you want to submit?</p>
        </div>
      ),
      footer: (
        <div className="controls">
          <Button
            size="md"
            variant="secondary"
            onClick={() => dispatch(closeModal())}>
            {t('button.caption.no')}
          </Button>
          <Button
            size="md"
            variant="primary"
            onClick={() => {
              handleOnConfirmation(id);
              dispatch(closeModal());
            }}>
            {t('button.caption.yes')}
          </Button>
        </div>
      )
    };
    dispatch(openModal(state));
  };

  return (
    <div className="MCP-module-wrapper" id="create-crosswalk">
      <div>
        <Button
          className="back-button-control"
          variant="tertiary"
          Icon={() => <IconArrowLeft />}
          onClick={() => navigate('/admin/crosswalk')}
          size="md">
          {t('label.backToMaterialCrosswalk')}
        </Button>
      </div>
      <div className="MCP-module-body">
        <PageHeader
          heading={t('label.createCrosswalk')}
          subheading={t('label.createCrosswalkSubtitle')}
        />
        <Formik
          initialValues={formState}
          validationSchema={schema}
          enableReinitialize={true}
          onSubmit={handleOnSubmit}>
          <Form>
            <div className="MCP-CardContainer">
              <div className={style['create-crosswalk-container']}>
                <div className={style['listing']}>
                  <div className={style['col']}>
                    <div className="MCP-module-body">
                      <div className="MCP-CardContainer"></div>
                      <Heading as="h3">{t('label.materialListing')}</Heading>
                    </div>
                  </div>
                  <div className={style['col']}>
                    <div className="MCP-module-body">
                      <div className="MCP-CardContainer"></div>
                      <Heading as="h3">{t('label.spProductListing')}</Heading>
                    </div>
                  </div>
                </div>
                <div className="MCP-module-body"></div>
              </div>
              <div className={style['create-crosswalk-container']}>
                <div className={style['listing']}>
                  <div className={style['col']}>
                    <TableProvider fetchFn={MaterialService.getMaterialList}>
                      <Materials />
                    </TableProvider>
                  </div>
                  <div className={style['col']}>
                    <TableProvider
                      defaultFilters={{
                        channelTypes: CHANNEL_TYPE.SPECIALTY_PHARMA
                      }}
                      fetchFn={MaterialService.getMaterialList}>
                      <Products />
                    </TableProvider>
                  </div>
                </div>
                <div className={`MCP-module-body ${style['summary-wrapper']}`}>
                  <Summary />
                  <div className="controls">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={handleOnLinkMaterial}>
                      Link Materials
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </Formik>
        <div className="controls">
          <Button size="md" variant="secondary">
            Cancel
          </Button>
          <Button onClick={confirmLinkMaterials} size="md" variant="primary">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateCrosswalk;
