import React from "react"; 
import Banner from "./Banner";
import './index.scss';
import LoginForm from "./Login";
import { OktaFooter } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';

const SignIn = () => {
  const { t } = useTranslate();
  return (
    <div className="signincontainer">
      <div className="page-container">
        <div className="header">
          <div className="header-left">
            <Banner />
          </div>
          <div className="header-right">
            <LoginForm />
          </div>
        </div>
        <div className="footer"> 
          <OktaFooter
            copyrightLabel={t('footer.copyright').replace('{{year}}', new Date().getFullYear())}
            dnsmiLabel={t('footer.do_not_sell_myinformation')}
            dnsmiUrl="#"
            pnLabel={t('footer.privacy')}
            pnUrl="#"
            supportNumber={t('footer.contact_at')}
            supportNumberLabel={t('footer.contact')}
            tncLabel={t('footer.terms')}
            tncUrl="#"
          />
        </div>
      </div >
    </div >

  );
};

export default SignIn;