import React, { useEffect } from 'react';
import { Heading } from '@mckesson/mcp-component-library';
import mainLayoutStyles from '@src/assets/styles/MainLayout.module.scss';
import PrimaryHeader from '@src/components/header/PrimaryHeader';
import style from './Footer.module.scss';
import { ReactComponent as McKessonLogo } from '@src/assets/svg/InspiroLink.svg';
import { Link } from 'react-router-dom';
import Footer from '@src/components/footer';

const PrivacyNoticePage = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://privacyportal-cdn.onetrust.com/privacy-notice-scripts/otnotice-1.0.min.js';
    script.id = 'otprivacy-notice-script';
    script.type = 'text/javascript';
    script.charset = 'UTF-8';
    script.setAttribute(
      'settings',
      'eyJjYWxsYmFja1VybCI6Imh0dHBzOi8vcHJpdmFjeXBvcnRhbC5vbmV0cnVzdC5jb20vcmVxdWVzdC92MS9wcml2YWN5Tm90aWNlcy9zdGF0cy92aWV3cyIsImNvbnRlbnRBcGlVcmwiOiJodHRwczovL3ByaXZhY3lwb3J0YWwub25ldHJ1c3QuY29tL3JlcXVlc3QvdjEvZW50ZXJwcmlzZXBvbGljeS9kaWdpdGFscG9saWN5L2NvbnRlbnQiLCJtZXRhZGF0YUFwaVVybCI6Imh0dHBzOi8vcHJpdmFjeXBvcnRhbC5vbmV0cnVzdC5jb20vcmVxdWVzdC92MS9lbnRlcnByaXNlcG9saWN5L2RpZ2l0YWxwb2xpY3kvbWV0YS1kYXRhIn0='
    );

    script.onload = () => {
      if (window.OneTrust && window.OneTrust.NoticeApi) {
        window.OneTrust.NoticeApi.Initialized.then(function () {
          window.OneTrust.NoticeApi.LoadNotices([
            'https://privacyportal-cdn.onetrust.com/storage-container/599133ba-bafa-4e24-8173-6e59b6c96dab/privacy-notices/27fd4ba1-cbda-4840-85ed-f0c59eda18a7/published/privacynotice.json'
          ]);
        });
      }
    };
    const MainContent = document.getElementById('MainContent');
    MainContent.appendChild(script);
  }, []);

  return (
    <div className={mainLayoutStyles.appContainer}>
      <PrimaryHeader />
      <div className={`${mainLayoutStyles['app-wrapper']}`}>
        <div className={`${mainLayoutStyles.home} max-container`}>
          <div className="MCP-module-wrapper" id={'MainContent'}>
            <div className="MCP-panel-container">
              <div className={style.contantHeading}>
                <McKessonLogo aria-hidden="true" focusable="false" title={'company.logoAltText'} />
                <Heading as="h1">
                  Supplemental Privacy Notice
                  <br />
                  for State Specific Privacy Laws
                </Heading>
              </div>
              <div className={style.contentWrapper}>
                <div id="otnotice-27fd4ba1-cbda-4840-85ed-f0c59eda18a7" className="otnotice"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default PrivacyNoticePage;
