import React, { useState } from 'react';
import { Heading } from '@mckesson/mcp-component-library';
import mainLayoutStyles from '@src/assets/styles/MainLayout.module.scss';
import PrimaryHeader from '@src/components/header/PrimaryHeader';
import style from './Footer.module.scss';
import { ReactComponent as McKessonLogo } from '@src/assets/svg/InspiroLink.svg';
import Down from '@src/assets/svg/arrow-down-small.svg';
import Right from '@src/assets/svg/arrow-right-small.svg';
import { ReactComponent as Expend } from '@src/assets/svg/expend.svg';
import { ReactComponent as Collapse } from '@src/assets/svg/collapse.svg';
import { IconButton, Button } from '@mckesson/mcp-component-library';
import data from './FaqList.js';
import { restoreSessionTransfer } from '@src/util/SessionTransferUtils';
import HlsPlayer from '@src/components/HlsPlayer';

function Faq() {
  restoreSessionTransfer();
  const [openIndexes, setOpenIndexes] = useState([]);
  const [activeSection, seActiveSection] = useState(0);
  const faqData = React.useMemo(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      return [data[0], data[7]];
    }
    return data;
  }, []);
  const toggleItem = (index) => {
    setOpenIndexes((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };
  const activeSectionData = activeSection !== null ? faqData[activeSection] : null;
  const expandAll = () => setOpenIndexes(activeSectionData.question.map((q, qIdx) => qIdx));
  const collapseAll = () => setOpenIndexes([]);
  const handleOnSectionChange = (sIdx) => {
    seActiveSection(sIdx);
    setOpenIndexes([]);
  };
  return (
    <div className={mainLayoutStyles.appContainer}>
      <PrimaryHeader />
      <div className={`${mainLayoutStyles['app-wrapper']}`}>
        <div className={`${mainLayoutStyles.home} max-container`}>
          <div className="MCP-module-wrapper">
            <div className={style.grid}>
              <McKessonLogo aria-hidden="true" focusable="false" title={'company.logoAltText'} />
              <div className={style.contantHeading}>
                <Heading as="h1">Frequently Asked Questions</Heading>
              </div>
            </div>
            <div className={style.grid}>
              <div className={style['faq-index']}>
                <div className={style['faq-indexes']}>
                  {faqData.map((section, sIdx) => (
                    <button
                      key={sIdx}
                      className={`${style['faq-index-item']} ${sIdx === activeSection ? style['active'] : ''}`}
                      onClick={() => handleOnSectionChange(sIdx)}>
                      <span>{section.title}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className={style['faq-content']}>
                <div className={`${style.faqSection} MCP-panel-container`}>
                  {activeSectionData && (
                    <div key={activeSectionData.title}>
                      <div className={style['faq-section']}>
                        <Heading as="h3">{activeSectionData.title}</Heading>
                        <div>
                          <div className={style.buttonGroup}>
                            <IconButton
                              label={'Expand all'}
                              size="lg"
                              iconButton={false}
                              iconPosition="left"
                              textButton={true}
                              Icon={Expend}
                              onClick={expandAll}
                            />
                            <IconButton
                              label={'Collapse all'}
                              size="lg"
                              iconButton={false}
                              iconPosition="left"
                              textButton={true}
                              Icon={Collapse}
                              onClick={collapseAll}
                            />
                          </div>
                        </div>
                      </div>

                      {activeSectionData.question.map((q, index) => {
                        return (
                          <div className={style.faqItem} key={index}>
                            <div className={style.heading} onClick={() => toggleItem(index)}>
                              <span>
                                {openIndexes.includes(index) ? (
                                  <Button variant="tertiary" type="button">
                                    <img src={Down} alt="toggle-icon" />
                                  </Button>
                                ) : (
                                  <Button variant="tertiary" type="button">
                                    <img src={Right} alt="toggle-icon" />
                                  </Button>
                                )}
                              </span>
                              <span>{q.questionTitle}</span>
                            </div>

                            {openIndexes.includes(index) && (
                              q.video ? (
                                <div key={index} className={`${style.content} ${style.videoContent}`}>
                                  <HlsPlayer videoId={q.video.id} />
                                </div>
                              ) : (
                                <div key={index} className={style.content}>
                                  <AnswerRenderer segments={q.answerSegment} />
                                </div>
                              )
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const AnswerRenderer = ({ segments }) => {
  return (
    <div className={style['faq-content-list']}>
      {segments.map((seg, i) => {
        if (seg.type === 'p') {
          return <p key={i}>{seg.content}</p>;
        }

        if (seg.type === 'ul') {
          return (
            <ul key={i}>
              {seg.content.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          );
        }

        return null;
      })}
    </div>
  );
};

export default Faq;
