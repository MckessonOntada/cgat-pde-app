import { ReactComponent as BinRedIcon } from '@src/assets/svg/bin-red.svg';
import React from 'react';
import { Heading, Button } from '@mckesson/mcp-component-library';
import style from './style.module.scss';

const Summary = ({ items = [{ name: 'Abc' }], onRemove }) => {
  return (
    <div className={style['bucket-list-wrapper']}>
      <div className={style['list-header']}>
        <Heading as="h3">Summary</Heading>
      </div>
      <div className={style['list']}>
        {items.map((item) => {
          return (
            <div className={style['item']}>
              <p>{item.name}</p>
              <div className="styled-icon-button">
                <Button
                  Icon={BinRedIcon}
                  size="md"
                  class="IonButton-module"
                  variant="tertiary"
                  color="error"
                  type="button"
                  onClick={() => {}}></Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Summary;
