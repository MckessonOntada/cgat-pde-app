import React from "react";
import { Link } from "react-router-dom";
import { useTranslate } from '@src/translations/useTranslation';
import style from './assets/footer.module.scss';
import { Heading } from '@mckesson/mcp-component-library';
import useSessionFeatures from "@src/hooks/useSessionFeatures";
import CommonDataService from "@src/api/commonService/CommonDataService";
import AuthUtils from "@src/util/AuthUtils";
import { ReactComponent as AppLogo } from '@src/assets/image/app-logo.svg';

const Footer = () => {
  const { t } = useTranslate();
  const {
    organization: { selectedOrganization }
  } = useSessionFeatures();
  const isSystemAdminView = AuthUtils.isSystemAdminView();

  const { data: organizationLogo } = CommonDataService.useOrganizationLogo(selectedOrganization.logoUrl, selectedOrganization.id);
  return (
    <footer className={style.footer}>
      <div className={` max-container ${style.footerWrapper}`}>
        <div className={style.footerContent}>
          <div>
            <Heading as="h2">{t('footer.terms')}</Heading>
            <Link to="https://qa.ontadahealth.com/privacy-notice" target="_blank">
              {t('footer.privacy')}
            </Link>
            <Link to="https://qa.ontadahealth.com/terms-of-use" target="_blank">
              {t('forgot.terms.agreement')}
            </Link>
            <Link to="https://privacyportal.onetrust.com/webform/599133ba-bafa-4e24-8173-6e59b6c96dab/f081c4ff-0e3b-4d07-a79f-30effc0fc255" target="_blank">
              {t('footer.info')}
            </Link>
          </div>
          <div>
            <Heading as="h2">{t('footer.help')}</Heading>
            <Link to={'https://patientportal.help.ontada.com/kb/en/'} target="_blank">{t('footer.help.content')}</Link>
          </div>
          <div>
            <Heading as="h2">{t('footer.contant')}</Heading>
            <Link to={'tel:1-855-887-6788'} target="_blank">{t('footer.contant.no')}</Link>
          </div>
        </div>
        <div className={style.footerBase}>
          <div className={style.branding}>
            {isSystemAdminView ? (
              <AppLogo aria-hidden="true" focusable="false" title="PDE Logo" />
            ) : (
              <Link className={`${style.customheader}`}>
                {organizationLogo && (
                  <div className={`${style.logoContainer}`}>
                    <img src={organizationLogo || ''} />
                  </div>
                )}
                <h2>{selectedOrganization.name}</h2>
              </Link>
            )}
          </div>
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
