import { ReactComponent as BinRedIcon } from '@src/assets/svg/bin-red.svg';
import React from 'react';
import { Heading, Button } from '@mckesson/mcp-component-library';
import style from './style.module.scss';
import { useGenericContext } from '../../config/GenericContext';
import { useTranslate } from '@src/translations/useTranslation';

const Summary = () => {
  const { t } = useTranslate();
  const { state, setValue } = useGenericContext();
  const [list, setList] = React.useState(state.selectedProducts || []);

  React.useEffect(() => {
    if (!state.selectedProducts) {
      setList([]);
    }
  }, [state.selectedProducts]);

  const handleOnLinkMaterials = () => {
    setList(state.selectedProducts || []);
  };

  const handleOnRemove = (id) => {
    const { selectedProducts } = state;
    if (selectedProducts) {
      const filteredProducts = selectedProducts.filter(
        (item) => item.id !== id
      );
      setValue('selectedProducts', filteredProducts);
      setList(filteredProducts);
    }
  };
  return (
    <React.Fragment>
      <div className={style['grid-item']}></div>
      <div className={style['grid-item']}>
        <div className="MCP-module-body">
          <div className={style['bucket-list-wrapper']}>
            <div className={style['list-header']}>
              <Heading as="h3">{t('crosswalk.label.summary')}</Heading>
            </div>
            <div className={style['list']}>
              {list.map((item) => {
                return (
                  <div className={style['item']}>
                    <p>{item.materialNumber}</p>
                    <div className="styled-icon-button error-button">
                      <Button
                        Icon={BinRedIcon}
                        size="md"
                        className="IonButton-module"
                        variant="tertiary"
                        color="error"
                        type="button"
                        onClick={() => handleOnRemove(item.id)}></Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="controls">
            <Button
              size="sm"
              className={style['list-controls']}
              variant="secondary"
              onClick={handleOnLinkMaterials}>
              {t('crosswalk.btnLinkMaterials')}
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Summary;
