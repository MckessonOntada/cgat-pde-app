import React, { useRef, useEffect, useState } from 'react';
import './ContextMenu.scss';

const ContextMenu = ({ children, items = [], onSelect }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const triggerRef = useRef();

  const handleClickOutside = (e) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(e.target) &&
      triggerRef.current &&
      !triggerRef.current.contains(e.target)
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleItemClick = (item) => {
    onSelect?.(item);
    setOpen(false);
  };

  return (
    <div className="context-menu">
      <div
        ref={triggerRef}
        onClick={() => setOpen((prev) => !prev)}
        className="context-menu__trigger">
        {children}
      </div>

      {open && (
        <ul className="context-menu__list" ref={menuRef}>
          {items.map((item, index) => (
            <li
              key={index}
              className="context-menu__item"
              onClick={() => handleItemClick(item)}>
              {item.label || item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContextMenu;
