import { CONFIG_MODULE_ROUTES } from "../pages/system-configuration/constants";
import { routesConfig } from "../routes/constants";

export const ROUTE_CONFIG = {
  DASHBOARD: '/',
  ADD_QUESTIONNAIRE: 'add',
  EDIT_QUESTIONNAIRE: 'edit',
  VIEW_QUESTIONNAIRE: 'view',
  MAP_QUESTIONNAIRE: 'map-questionnaire',
  CONFIG_PREVIEW: 'preview',
};

export const PREVIEW_URL = `/orders/${routesConfig.systemConfiguration}/${CONFIG_MODULE_ROUTES.MANAGE_QUESTIONNAIRE}/${ROUTE_CONFIG.CONFIG_PREVIEW}`;
 