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
import SPCrosswalkService from '@src/api/commonService/SPCrosswalkService';
import useTimedArray from '@src/mfe/order-management/pages/create/form-segments/summary/useTimedArray';
import Summary from './Summary';
import { useGenericContext } from '../../config/GenericContext';
import Alert from '@src/components/cgat-alert/Alert';
import TherapyDetailsWithTabs from '@src/components/therapyDetails/TherapyDetailsWithTabs';
import CommonUtils from '@src/util/CommonUtils';

const CreateCrosswalk = () => {
  const navigate = useNavigate();
  const { t } = useTranslate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const material = searchParams.get('material');
  const trade = searchParams.get('trade');
  const therapy = searchParams.get('therapy');
  const dispatch = useDispatch();
  const [selectedMaterial, setSelectedMaterial] = React.useState(null);
  const [selectedProducts, setSelectedProducts] = React.useState([]);
  const [linkedItems, setLinkedItems] = React.useState({});
  const { items: notifications, add: addNotification, remove: removeNotification, removeAll: removeAllNotification } = useTimedArray(10000);

  const handleOnSubmit = () => {
    const payload = Object.values(linkedItems).map((material) => ({
      bnbNdc: material.ndc,
      spProductIds: material.linkedProducts.map((item) => item.materialNumber)
    }));

    SPCrosswalkService.createCrosswalk(payload)
      .then((response) => {
        if (response.status === 200) {
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
        const statusCode = error?.response?.status;
        let description = t('error.default');
        if (statusCode === 419) description = CommonUtils.getAxiosErrorMessage(error);

        addNotification({
          type: 'error',
          description,
          isSticky: true
        });
      });
  };

  const confirmLinkMaterials = () => {
    removeAllNotification();
    if (Object.keys(linkedItems).length === 0) {
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

  const handleOnClose = () => {
    searchParams.delete('trade');
    searchParams.delete('channelType');
    searchParams.delete('therapy');
    navigate({
      pathname: location.pathname,
      search: searchParams.toString() ? `?${searchParams.toString()}` : ''
    });
  };

  const handleOnLinkMaterial = () => {
    let updatedLinkedItems;

    if (linkedItems[selectedMaterial.id]) {
      const updatedMaterial = {
        ...selectedMaterial,
        linkedProducts: [...linkedItems[selectedMaterial.id].linkedProducts, ...selectedProducts]
      };
      updatedLinkedItems = {
        ...linkedItems,
        [selectedMaterial.id]: updatedMaterial
      };
    } else {
      const updatedMaterial = {
        ...selectedMaterial,
        linkedProducts: selectedProducts
      };
      updatedLinkedItems = {
        ...linkedItems,
        [selectedMaterial.id]: updatedMaterial
      };
    }

    setLinkedItems(updatedLinkedItems);
    setSelectedMaterial(null);
    setSelectedProducts([]);
  };

  const handleOnUnLinkMaterial = (materialId, productId) => {
    const material = linkedItems[materialId];

    if (!material) return;

    const updatedLinkedProducts = material.linkedProducts.filter((product) => product.id !== productId);

    if (updatedLinkedProducts.length === 0) {
      const { [materialId]: _, ...remainingItems } = linkedItems;
      setLinkedItems(remainingItems);
    } else {
      const updatedMaterial = {
        ...material,
        linkedProducts: updatedLinkedProducts
      };

      const updatedLinkedItems = {
        ...linkedItems,
        [materialId]: updatedMaterial
      };

      setLinkedItems(updatedLinkedItems);
    }
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
              <Materials material={selectedMaterial} onSelect={setSelectedMaterial} />
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
              fetchFn={async (args) => {
                const response = await MaterialService.getMaterialList(args);
                if (response.content && CommonUtils.isNonEmptyArray(response.content)) {
                  response.content = response.content.map((item) => item.therapies?.[0]).filter(Boolean);
                }
                return response;
              }}>
              <Products linkedItems={linkedItems} products={selectedProducts} onSelect={setSelectedProducts} />
            </TableProvider>
            <Summary linkedMaterial={linkedItems} onUnlink={handleOnUnLinkMaterial} onLink={handleOnLinkMaterial} />
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
            therapy={therapy || trade}
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
