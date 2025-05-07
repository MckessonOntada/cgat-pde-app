import React, { createContext, useRef, useEffect, useState } from 'react';

export const FooterContext = createContext({
  footerRef: null,
  isFooterVisible: false
});

export const FooterProvider = ({ children }) => {
  const footerRef = useRef(null);
  const [isFooterVisible, setIsFooterVisible] = useState({});

  return (
    <FooterContext.Provider
      value={{ footerRef, isFooterVisible, setIsFooterVisible }}>
      {children}
    </FooterContext.Provider>
  );
};
