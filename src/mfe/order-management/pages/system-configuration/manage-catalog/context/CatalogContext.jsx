import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';

const RECORDS_PER_PAGE = 8;

const CatalogContext = createContext();

export const useCatalogContext = () => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useOrg must be used within a OrganizationProvider.');
  }
  return context;
};

export const CatalogProvider = ({ children }) => {
  const contextValue = {};
  return <CatalogContext.Provider value={contextValue}>{children}</CatalogContext.Provider>;
};
