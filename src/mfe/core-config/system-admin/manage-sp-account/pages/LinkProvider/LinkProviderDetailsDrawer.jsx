import React from 'react';
import { Heading } from '@mckesson/mcp-component-library';
import FloatingDrawer from '@src/components/floating-drawer';
import { useTranslate } from '@src/translations/useTranslation';

const LinkProviderDetailsDrawer = ({ open, onClose, details, title }) => {
  const { t } = useTranslate();
  return (
    <FloatingDrawer
      open={open}
      anchor="right"
      onClose={onClose}
      heading={title}
    >
      <div className="details-main-wrapper">
        <div className="details-body">
          {details?.map((section, index) => (
            <div key={index}>
              <div className="styled-heading">
                <Heading as="h4">{t(section.sectionHeading)}</Heading>
              </div>
              <div className="details-ul">
                {section.sectionData.map((detail, idx) => (
                  <div className="details-li" key={idx}>
                    <div className="details-key">{t(detail.label)}</div>
                    <div className="details-value">{detail.value || '-'}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </FloatingDrawer>
  );
};

export default LinkProviderDetailsDrawer;
