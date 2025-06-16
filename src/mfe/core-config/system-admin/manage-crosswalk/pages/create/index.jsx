import React from 'react';
import { Button } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useTranslate } from '@src/translations/useTranslation';
import { useLocation, useNavigate } from 'react-router-dom';
import PageHeader from '@src/components/pageHeader';
import style from './style.module.scss';
import { TableProvider } from '@src/mfe/core-config/admin/manage-providers/context/TableContext';
import MaterialService from '@src/api/commonService/MaterialService';
import Materials from './Materials';
import Products from './Products';
import { CHANNEL_TYPE } from '@src/mfe/order-management/pages/create/form-segments/Constants';
import { useDispatch } from 'react-redux';
import { closeModal, openModal } from '@src/store/reducer/modalReducer';
import { ConfigConstants, MaterialDetailsConstants } from '@src/mfe/core-config/system-admin/manage-material/assets/constants/MaterialConstants';
import TherapyDetails from '@src/components/therapyDetails/TherapyDetails';
import SPCrosswalkService from '@src/api/commonService/SPCrosswalkService';
import useTimedArray from '@src/mfe/order-management/pages/create/form-segments/summary/useTimedArray';
import Summary from './Summary';
import { useGenericContext } from '../../config/GenericContext';
import { errorStatusCodes } from '@src/util/ApiUtils';
import Alert from '@src/components/cgat-alert/Alert';
import TherapyDetailsWithTabs from '@src/components/therapyDetails/TherapyDetailsWithTabs';

const CreateCrosswalk = () => {
  const navigate = useNavigate();
  const { t } = useTranslate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const material = searchParams.get('material');
  const trade = searchParams.get('trade');
  const { state, reset } = useGenericContext();
  const dispatch = useDispatch();
  const [selectedMaterial, setSelectedMaterial] = React.useState(null);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const { items: notifications, add: addNotification, remove: removeNotification, removeAll: removeAllNotification } = useTimedArray(10000);

  const handleOnSubmit = () => {
    const { material, selectedProducts } = state;
    if (material && selectedProducts.length > 0) {
      const payload = {
        bnbNdc: material.ndc,
        spProductIds: selectedProducts.map((item) => item.materialNumber)
      };

      SPCrosswalkService.createCrosswalk(payload)
        .then((response) => {
          if (response.status === 200) {
            reset();
            navigate('/system-admin/config/crosswalk', {
              state: {
                items: [
                  {
                    description: `${response.data} new crosswalk linked`,
                    type: 'success',
                    isSticky: true
                  }
                ]
              }
            });
          }
        })
        .catch((error) => {
          if (errorStatusCodes.includes(error.status)) {
            addNotification({
              type: 'error',
              description: error.response?.data?.message || error.message,
              isSticky: true
            });
          } else {
            addNotification({
              type: 'error',
              description: error.response?.data?.message || error.message
            });
          }
        });
    }
  };

  const confirmLinkMaterials = () => {
    removeAllNotification();
    const { material, selectedProducts } = state;
    if (!material || !selectedProducts || selectedProducts.length === 0) {
      addNotification({
        type: 'error',
        description: t('crosswalk.create.noSelectionError'),
        isSticky: true
      });
      return;
    }

    const modalState = {
      title: t('crosswalk.submitConfirmationTitle'),
      body: (
        <div className="MCP-modal-body">
          <p>{t('crosswalk.submitConfirmationMessage')}</p>
        </div>
      ),
      footer: (
        <div className="controls">
          <Button size="md" variant="secondary" onClick={() => dispatch(closeModal())}>
            {t('button.caption.no')}
          </Button>
          <Button
            size="md"
            variant="primary"
            onClick={() => {
              handleOnSubmit();
              dispatch(closeModal());
            }}>
            {t('button.caption.yes')}
          </Button>
        </div>
      )
    };
    dispatch(openModal(modalState));
  };

  const handleOnDetailsPanelClose = () => {
    const params = new URLSearchParams(location.search);
    params.delete('material');

    const newSearch = params.toString();
    navigate(`${location.pathname}${newSearch ? `?${newSearch}` : ''}`, {
      replace: true
    });
  };

  React.useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  const handleOnClose = () => {
    searchParams.delete('trade');
    searchParams.delete('channelType');
    navigate({
      pathname: '',
      search: searchParams.toString() ? `?${searchParams.toString()}` : ''
    });
  };

  return (
    <div className="MCP-module-wrapper" id="create-crosswalk">
      <div>
        <Button
          className="back-button-control"
          variant="tertiary"
          Icon={() => <IconArrowLeft />}
          onClick={() => navigate('/system-admin/config/crosswalk')}
          size="md">
          {t('label.backToMaterialCrosswalk')}
        </Button>
      </div>
      <PageHeader heading={t('label.createCrosswalk')} description={t('label.createCrosswalkSubtitle')} />
      <div className="MCP-module-body">
        {notifications && notifications.length > 0 && (
          <div className="MCP-module-body">
            {notifications.map((item, index) => {
              return <Alert key={item.id} description={item.description} onClose={() => removeNotification(item.id)} type={item.type} />;
            })}
          </div>
        )}

        <div className="MCP-CardContainer">
          <div className={style['grid-container']}>
            <TableProvider
              defaultFilters={{
                status: 'active'
              }}
              defaultSort={{
                sortBy: 'trade_name',
                sortOrder: 'ASC'
              }}
              allowedSort={['trade_name']}
              fetchFn={MaterialService.getMaterialList}>
              <Materials material={selectedMaterial} setMaterial={setSelectedMaterial} />
            </TableProvider>
            <TableProvider
              defaultFilters={{
                channelTypes: CHANNEL_TYPE.SPECIALTY_PHARMA,
                showNonCrosswalked: true,
                status: 'active'
              }}
              defaultSort={{
                sortBy: 'trade_name',
                sortOrder: 'ASC'
              }}
              allowedSort={['trade_name']}
              fetchFn={MaterialService.getMaterialList}>
              <Products selection={selectedItems} setSelection={setSelectedItems} />
            </TableProvider>
            <Summary />
          </div>
        </div>
        <div className="controls">
          <Button size="md" variant="secondary" onClick={() => navigate('/system-admin/config/crosswalk')}>
            {t('provider.btnCancel')}
          </Button>
          <Button onClick={confirmLinkMaterials} size="md" variant="primary">
            {t('provider.btnSubmit')}
          </Button>
        </div>

        {(trade || material) && (
          <TherapyDetailsWithTabs
            isMaterialListing={true}
            trade={trade}
            onSelect={() => {}}
            onClose={handleOnClose}
            heading={t('manageMaterial.drawer.details.heading')}
            showFooter={false}
          />
        )}
      </div>
    </div>
  );
};

export default CreateCrosswalk;
