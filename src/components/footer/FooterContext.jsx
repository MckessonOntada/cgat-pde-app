import React, { createContext, useRef, useEffect, useState } from 'react';

export const FooterContext = createContext({
  controlRef: null,
  isFooterVisible: false
});

export const FooterProvider = ({ children }) => {
  const controlRef = useRef(null);
  const [isFooterVisible, setIsFooterVisible] = useState({});

  return (
    <FooterContext.Provider
      value={{controlRef, isFooterVisible, setIsFooterVisible }}>
      {children}
    </FooterContext.Provider>
  );
};
