import React from 'react'; 
import { ReactComponent as McKessonLogo } from '@src/assets/image/McKesson_logo.svg';
import { useTranslate } from '@src/translations/useTranslation';
import './index.scss';

const Banner = () => {
    const { t } = useTranslate();

    return (
        <header className="session" role="banner">
            <div className="branding" aria-labelledby="company-logo-heading">
                <div>
                    <McKessonLogo aria-hidden="true" focusable="false" title={t('company.logoAltText')} />
                </div>
                <div id="company-logo-heading" className="company-logo-heading"> 
                    <div>{t('banner.Heading')}</div>
                    {t('banner.subHeading')}
                </div>
                <p>{t('banner.subHeadline')}</p>
            </div>
        </header>
    );
};

export default Banner;
