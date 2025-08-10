import React, { useState } from 'react';
import { Heading } from '@mckesson/mcp-component-library';
import mainLayoutStyles from '@src/assets/styles/MainLayout.module.scss';
import PrimaryHeader from '@src/components/header/PrimaryHeader';
import style from './Footer.module.scss';
import { ReactComponent as McKessonLogo } from '@src/assets/svg/InspiroLink.svg';
import { ReactComponent as Down } from '@src/assets/svg/arrow-down-1.svg';
import { ReactComponent as Right } from '@src/assets/svg/arrow-right-1.svg';
import { ReactComponent as Expend } from '@src/assets/svg/expend.svg';
import { ReactComponent as Collapse } from '@src/assets/svg/collapse.svg';
import { IconButton } from '@mckesson/mcp-component-library';
const data = [
  {
    question: 'What are the features InspiroLink portal offers?',
    answer:
      'The InspiroLink portal offers capabilities like multi-channel procurement, invoicing and payment. The portal is built to be friendly with both mobile and iPad.'
  },
  {
    question: 'How can I contact support?',
    answer: 'Please contact your McKesson customer success executive.'
  }
];
function Faq() {
  const [openIndexes, setOpenIndexes] = useState([]);

  const toggleItem = (index) => {
    setOpenIndexes((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };
  const expandAll = () => setOpenIndexes(data.map((_, i) => i));
  const collapseAll = () => setOpenIndexes([]);
  return (
    <div className={mainLayoutStyles.appContainer}>
      <PrimaryHeader />
      <div className={`${mainLayoutStyles['app-wrapper']}`}>
        <div className={`${mainLayoutStyles.home} max-container`}>
          <div className="MCP-module-wrapper">
            <div className="MCP-panel-container">
              <div className={style.contantHeading}>
                <McKessonLogo aria-hidden="true" focusable="false" title={'company.logoAltText'} />
                <Heading as="h1">FAQ’s</Heading>
              </div>
              <div className={style.faqSection}>
                <Heading as="h3">About Portal</Heading>
                <div>
                  <div className={style.buttonGroup}>
                    <IconButton label={'Expand all'} size="lg" iconButton={false} iconPosition="left" textButton={true} Icon={Expend} onClick={expandAll} />
                    <IconButton label={'Collapse'} size="lg" iconButton={false} iconPosition="left" textButton={true} Icon={Collapse} onClick={collapseAll} />
                  </div>

                  {data.map((item, index) => (
                    <div key={index} className={style.faqItem}>
                      <div className={style.heading} onClick={() => toggleItem(index)}>
                        <span>
                          {openIndexes.includes(index) ? (
                            <Down aria-hidden="true" focusable="false" title={'down'} />
                          ) : (
                            <Right aria-hidden="true" focusable="false" title={'right'} />
                          )}
                        </span>
                        <span>{item.question}</span>
                      </div>
                      {openIndexes.includes(index) && <div className={style.content}>{item.answer}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Faq;
