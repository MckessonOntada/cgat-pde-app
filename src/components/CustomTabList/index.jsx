import React, { useRef, useState, useEffect } from 'react';
import './Tabs.scss';
import { ReactComponent as tabRightArrow } from '@src/assets/svg/tab-right-arrow.svg';
import { ReactComponent as tabLeftArrow } from '@src/assets/svg/tab-left-arrow.svg';
import { IconButton } from '@mckesson/mcp-component-library';

export default function Tabs({ options, onTabClick }) {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    checkArrows();
    window.addEventListener('resize', checkArrows);
    return () => window.removeEventListener('resize', checkArrows);
  }, [options]);

  const checkArrows = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 2);
  };

  const scrollTabs = (direction) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: direction === 'left' ? -150 : 150,
        behavior: 'smooth'
      });
    }
  };

  const handleTabClick = (index, tab) => {
    setActiveIndex(index);
    onTabClick && onTabClick(tab);

    const tabElement = containerRef.current.children[index];
    if (tabElement) {
      tabElement.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }

    setTimeout(checkArrows, 300);
  };

  return (
    <div className="tabs-wrapper">
      {showLeftArrow && (
        <IconButton className="scroll-btn left" size="md" iconButton={true} textButton={false} Icon={tabLeftArrow} onClick={() => scrollTabs('left')} />
      )}

      <div className="tabs-container" ref={containerRef} onScroll={checkArrows}>
        {options.map((tab, index) => (
          <div key={tab.id} className={`tab-item ${index === activeIndex ? 'active' : ''}`} onClick={() => handleTabClick(index, tab)}>
            {tab.configName}
          </div>
        ))}
      </div>

      {showRightArrow && (
        <IconButton className="scroll-btn right" size="md" iconButton={true} textButton={false} Icon={tabRightArrow} onClick={() => scrollTabs('right')} />
      )}
    </div>
  );
}
