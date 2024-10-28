import { ReactComponent as McKessonLogo } from './../../../assets/images/mckesson-logo-colored.svg';
import { useTranslation } from 'react-i18next';
import './assets/style.scss';

const Banner = () => {
    const { t } = useTranslation();

    return (
        <header className="session" role="banner">
            <div className="branding" aria-labelledby="company-logo-heading">
                <div className="branding-logo">
                    <McKessonLogo aria-hidden="true" focusable="false" title={t('company.logoAltText')} />
                </div>
                <h1 id="company-logo-heading" className="company-logo-heading">
                    {t('banner.mainHeading', 'Advancing')}<br />
                    {t('banner.subHeading', 'Health Outcomes for All')}
                </h1>
                <p>{t('banner.subHeadline')}</p>
            </div>
        </header>
    );
};

export default Banner;
