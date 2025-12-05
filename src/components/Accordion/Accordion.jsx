import React, { useState, createContext, useContext, useId } from 'react';
import './Accordion.scss';

const AccordionContext = createContext();
function useAccordion() {
  const ctx = useContext(AccordionContext);
  return ctx;
}

export default function Accordion({ children, multiple = false, defaultValue = null, value, onChange }) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentVal = isControlled ? value : internalValue;

  const toggleItem = (key) => {
    if (multiple) {
      const arr = Array.isArray(currentVal) ? [...currentVal] : [];
      const index = arr.indexOf(key);
      index >= 0 ? arr.splice(index, 1) : arr.push(key);
      isControlled ? onChange?.(arr) : setInternalValue(arr);
    } else {
      const next = currentVal === key ? null : key;
      isControlled ? onChange?.(next) : setInternalValue(next);
    }
  };

  return (
    <AccordionContext.Provider value={{ value: currentVal, toggleItem, multiple }}>
      <div className="accordion-container">{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({ itemKey, children }) {
  return <div className="accordion-item">{React.Children.map(children, (child) => React.cloneElement(child, { itemKey }))}</div>;
}

export function AccordionHeader({ children, itemKey }) {
  const { value, toggleItem } = useAccordion();
  const isOpen = Array.isArray(value) ? value.includes(itemKey) : value === itemKey;
  const id = useId();

  return (
    <div className="accordion-header" role="button" tabIndex={0} aria-expanded={isOpen} aria-controls={`${id}-panel`} onClick={() => toggleItem(itemKey)}>
      <svg className={`accordion-icon ${isOpen ? 'open' : ''}`} width="20" height="20" viewBox="0 0 24 24">
        <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{children}</span>
    </div>
  );
}

export function AccordionPanel({ children, itemKey }) {
  const { value } = useAccordion();
  const isOpen = Array.isArray(value) ? value.includes(itemKey) : value === itemKey;
  const id = useId();

  return (
    <div id={`${id}-panel`} className={`accordion-panel ${isOpen ? 'open' : ''}`} role="region">
      {children}
    </div>
  );
}
