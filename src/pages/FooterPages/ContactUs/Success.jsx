import React from 'react';
import { Heading } from '@mckesson/mcp-component-library';
import mainLayoutStyles from '@src/assets/styles/MainLayout.module.scss';
import PrimaryHeader from '@src/components/header/PrimaryHeader';
import style from '../Footer.module.scss';
import { ReactComponent as McKessonLogo } from '@src/assets/svg/InspiroLink.svg';
import { ReactComponent as SuccessIcon } from '@src/assets/svg/Success2.svg';
import { useTranslate } from '@src/translations/useTranslation';

function Success() {
  const { t } = useTranslate();
  return (
    <div className={mainLayoutStyles.appContainer}>
      <PrimaryHeader />
      <div className={`${mainLayoutStyles['app-wrapper']}`}>
        <div className={`${mainLayoutStyles.home} max-container`}>
          <div className="MCP-module-wrapper">
            <div className="MCP-panel-container">
              <div className={style.headingSuccess}>
                <McKessonLogo aria-hidden="true" focusable="false" title={'company logo'} />
                <SuccessIcon aria-hidden="true" focusable="false" title={'Success'} />
                <div>
                  <Heading as="h1">{t('footer.Thanks')}</Heading>
                  <p>{t('footer.ThanksDescription')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Success;
