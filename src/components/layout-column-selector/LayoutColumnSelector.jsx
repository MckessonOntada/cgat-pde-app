import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Button, CheckboxGroup, IconButton } from '@mckesson/mcp-component-library';
import { ReactComponent as LayoutIcon } from '@src/assets/svg/layout.svg';
import { useTranslate } from '@src/translations/useTranslation';
import styles from './LayoutColumnSelector.module.scss';

const LayoutColumnSelector = ({ columns = [], onApply }) => {
  const { t } = useTranslate();
  const [isOpen, setIsOpen] = useState(false);
  const [checkedKeys, setCheckedKeys] = useState(() => columns.filter((c) => c.defaultChecked).map((c) => c.key));
  const [panelStyle, setPanelStyle] = useState({});
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  const columnsKey = columns.map((c) => `${c.key}:${c.defaultChecked}`).join(',');

  useEffect(() => {
    setCheckedKeys(columns.filter((c) => c.defaultChecked).map((c) => c.key));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnsKey]);

  useEffect(() => {
    if (!isOpen) {
      setCheckedKeys(columns.filter((c) => c.defaultChecked).map((c) => c.key));
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target) && panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleScroll = () => setIsOpen(false);
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPanelStyle({
        top: rect.bottom + 6,
        right: window.innerWidth - rect.right
      });
    }
    setIsOpen((v) => !v);
  };

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
    <div ref={triggerRef} className={styles.wrapper}>
      <IconButton
        size="lg"
        iconButton={false}
        textButton={true}
        Icon={LayoutIcon}
        label={t('labels.layout.buttonLabel')}
        onClick={handleToggle}
        className={`${styles.layoutTrigger} ${isOpen ? styles.triggerActive : ''}`}
      />

      {isOpen &&
        ReactDOM.createPortal(
          <div ref={panelRef} className={styles.panel} style={panelStyle}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>{t('labels.layout.panelTitle')}</span>
              <span className={styles.panelSubtitle}>{t('labels.layout.panelSubtitle')}</span>
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
                {t('labels.layout.clearAll')}
              </Button>
              <Button variant="primary" size="md" onClick={handleApply}>
                {t('labels.layout.apply')}
              </Button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default LayoutColumnSelector;
