import React, { useContext, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import style from './assets/Footer.module.scss';
import { Heading } from '@mckesson/mcp-component-library';
import QuestionnaireService from '@src/api/commonService/QuestionnaireService';
import { useQuery } from 'react-query';
import { FooterContext } from '@src/components/footer/FooterContext';
import { ReactComponent as McKessonLogo } from '@src/assets/image/InspiroLinkWhite.svg';
import { useOktaAuth } from '@okta/okta-react';
import { prepareSessionTransfer } from '@src/util/SessionTransferUtils';

const Footer = () => {
  const { t } = useTranslate();
  const { controlRef } = useContext(FooterContext);

  const isMobileView = window.innerWidth <= 576;

  const { data: footerData } = useQuery({
    queryKey: ['globalFooterLinks'],
    queryFn: () => QuestionnaireService.getGlobalConfigLinks()
  });
  const footerRef = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        controlRef.current.classList.add(!entry.isIntersecting ? 'styleStickey' : 'styleNonStickey');
        controlRef.current.classList.remove(!entry.isIntersecting ? 'styleNonStickey' : 'styleStickey');
      },
      {
        root: null,
        threshold: 0.1
      }
    );

    if (isMobileView) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  const { authState } = useOktaAuth() || {};
  const isAuthenticated = authState?.isAuthenticated;

  return (
    <footer className={style.footer} ref={footerRef}>
      <div className={`max-container ${style.footerWrapper}`}>
        <div className={style.footerContent}>
          {footerData &&
            footerData?.footerSection?.map((section, index) => (
              <div key={index}>
                <Heading as="h2">{t(section.heading)}</Heading>
                {section.links.map((link, linkIndex) => {
                  const isContact = link.url === '/contact' || link.url === '/contact/';
                  const targetUrl = isContact && isAuthenticated ? '/contact-us' : link.url;
                  return (
                    <a
                      key={linkIndex}
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.preventDefault();
                        const transferId = prepareSessionTransfer();
                        const finalUrl = targetUrl + (targetUrl.includes('?') ? '&' : '?') + 'sessionTransferId=' + transferId;
                        window.open(finalUrl, '_blank');
                      }}>
                      {t(link.text)}
                    </a>
                  );
                })}
              </div>
            ))}
        </div>
        <div className={style.footerBase}>
          <div className={style.branding}>
            <McKessonLogo aria-hidden="true" focusable="false" title={t('company.logoAltText')} />
          </div>
          <p>
            <span>{t('footer.copyright.1', { year: new Date().getFullYear() })}</span>
            {t('footer.copyright.2')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
