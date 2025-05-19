import { CONFIG_MODULE_ROUTES } from '../constants';
import { routesConfig } from '../../../order-management/routes/constants';

export const ROUTE_CONFIG = {
  DASHBOARD: '/',
  ADD_QUESTIONNAIRE: 'add',
  EDIT_QUESTIONNAIRE: 'edit',
  VIEW_QUESTIONNAIRE: 'view',
  MAP_QUESTIONNAIRE: 'map-questionnaire',
  CONFIG_PREVIEW: 'preview'
};

export const PREVIEW_URL = `/system-admin/${CONFIG_MODULE_ROUTES.MANAGE_QUESTIONNAIRE}/${ROUTE_CONFIG.CONFIG_PREVIEW}`;
