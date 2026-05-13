import React, { useEffect, useRef, useState } from 'react';
import { Button, CheckboxGroup, IconButton } from '@mckesson/mcp-component-library';
import { ReactComponent as LayoutIcon } from '@src/assets/svg/layout.svg';
import styles from './LayoutColumnSelector.module.scss';

const LayoutColumnSelector = ({ columns = [], onApply }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [checkedKeys, setCheckedKeys] = useState(() => columns.filter((c) => c.defaultChecked).map((c) => c.key));
  const wrapperRef = useRef(null);

  // Reset checked state whenever the column list changes (e.g. tab switch)
  useEffect(() => {
    setCheckedKeys(columns.filter((c) => c.defaultChecked).map((c) => c.key));
  }, [columns]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleColumnChange = (key) => (e) => {
    const isChecked = e.target.checked;
    setCheckedKeys((prev) => (isChecked ? [...prev, key] : prev.filter((k) => k !== key)));
  };

  const handleClearAll = () => setCheckedKeys([]);

  const handleApply = () => {
    onApply?.(checkedKeys);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <IconButton
        size="lg"
        iconButton={false}
        textButton={true}
        Icon={LayoutIcon}
        label="Layout"
        onClick={() => setIsOpen((v) => !v)}
        className={`${styles.layoutTrigger} ${isOpen ? styles.triggerActive : ''}`}
      />

      {isOpen && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>Show/Hide Columns</span>
            <span className={styles.panelSubtitle}>Select columns to display</span>
          </div>

          <div className={styles.columnList}>
            {columns.map(({ key, label }) => (
              <div key={key} className={styles.columnItem}>
                <CheckboxGroup
                  id={`layout-col-${key}`}
                  name={`layout-col-${key}`}
                  items={[
                    {
                      label,
                      value: key,
                      isChecked: checkedKeys.includes(key),
                      onChange: handleColumnChange(key)
                    }
                  ]}
                  size="md"
                />
              </div>
            ))}
          </div>

          <div className={styles.panelFooter}>
            <Button variant="tertiary" size="md" className={styles.footerButton} onClick={handleClearAll}>
              CLEAR ALL
            </Button>
            <Button variant="primary" size="md" onClick={handleApply}>
              APPLY
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayoutColumnSelector;
