import { ReactComponent as BinRedIcon } from '@src/assets/svg/bin-red.svg';
import React from 'react';
import { Heading, Button } from '@mckesson/mcp-component-library';
import style from './style.module.scss';
import { useTranslate } from '@src/translations/useTranslation';

const Summary = ({ linkedMaterial = {}, onLink, onUnlink }) => {
  const { t } = useTranslate();

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
              {Object.values(linkedMaterial).map((material) => {
                return material.linkedProducts.map((product) => {
                  return (
                    <div key={`${material.id}-${product.id}`} className={style['item']}>
                      <p>{`${material.materialDescription}-${product.materialDescription}`}</p>
                      <div className="styled-icon-button error-button">
                        <Button
                          Icon={BinRedIcon}
                          size="md"
                          className="IonButton-module"
                          variant="tertiary"
                          color="error"
                          type="button"
                          onClick={() => onUnlink(material.id, product.id)}></Button>
                      </div>
                    </div>
                  );
                });
              })}
            </div>
          </div>
          <div className="controls">
            <Button size="sm" className={style['list-controls']} variant="secondary" onClick={onLink}>
              {t('crosswalk.btnLinkMaterials')}
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Summary;
