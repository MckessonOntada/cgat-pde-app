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
  const [formState, setForState] = React.useState(INITIAL_STATE);
  const [schema, setSchema] = React.useState(VALIDATION_SCHEMA);
  const [material, setMaterial] = React.useState(null);
  const [spProduct, setSpProduct] = React.useState(null);

  const handleOnSubmit = () => {};

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
                      <TableProvider fetchFn={MaterialService.getMaterialList}>
                        <Materials />
                      </TableProvider>
                    </div>
                  </div>
                  <div className={style['col']}>
                    <div className="MCP-module-body">
                      <div className="MCP-CardContainer"></div>
                      <Heading as="h3">{t('label.spProductListing')}</Heading>
                      <TableProvider fetchFn={MaterialService.getMaterialList}>
                        <Materials />
                      </TableProvider>
                    </div>
                  </div>
                </div>
                <div>Summary</div>
              </div>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default CreateCrosswalk;
