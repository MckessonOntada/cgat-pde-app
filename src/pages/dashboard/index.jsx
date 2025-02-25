import React, { useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heading } from '@mckesson/mcp-component-library';
import styles from './Dashboard.module.scss';
import { SYSTEM_ADMIN_CARDS_DATA, CARDS_DATA } from './DashboardCards';
import { useTranslate } from '@src/translations/useTranslation';
import AuthUtils from '@src/util/AuthUtils';
import usePermission from '@src/hooks/usePermissions';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';

const Dashboard = () => {
  const { t } = useTranslate();
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const isSystemAdmin = AuthUtils.isSystemAdmin();
  const isCustomerCenter = AuthUtils.isCustomerCenter();

  const { hasPermission, hasAnyPermission } = usePermission();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const isExpelled = Boolean(queryParams.get('expelled'));

  React.useEffect(() => {
    let navigateToUrl = '';

    if (hasAnyPermission(Object.values(PERMISSIONS_ENUM.ADMIN_MANAGEMENT))) navigateToUrl = '/admin';
    else if (hasAnyPermission(Object.values(PERMISSIONS_ENUM.ORDER_MANAGEMENT))) navigateToUrl = '/orders';
    else if (hasAnyPermission(Object.values(PERMISSIONS_ENUM.PAYMENT_INVOICING))) navigateToUrl = '/record';

    if (!isSystemAdmin && !isCustomerCenter) {
      if (hasAnyPermission(Object.values(PERMISSIONS_ENUM.ORDER_MANAGEMENT))) navigateToUrl = '/orders';
      else if (hasAnyPermission(Object.values(PERMISSIONS_ENUM.PAYMENT_INVOICING))) navigateToUrl = '/record';
      else if (hasAnyPermission(Object.values(PERMISSIONS_ENUM.ADMIN_MANAGEMENT))) navigateToUrl = '/admin';
    }

    if (!isSystemAdminView && navigateToUrl) navigate(navigateToUrl, { replace: true });
  }, []);

  React.useEffect(() => {
    if (isExpelled) {
      console.log('read updated storage');
      navigate('/');
      window.location.reload();
    }
  }, [isExpelled]);

  // const cards = isSystemAdminView ? SYSTEM_ADMIN_CARDS_DATA : CARDS_DATA;
  const cards = useMemo(() => {
    if (isSystemAdminView) return SYSTEM_ADMIN_CARDS_DATA;
    let _cards = CARDS_DATA.filter((card) => {
      let _hasAccess = hasAnyPermission(card.permissions);
      return _hasAccess;
    });
    return _cards;
  }, [isExpelled]);

  // if (!isSystemAdminView) {
  //   return <></>;
  // }

  return (
    <div className={''}>
      <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link id={`${card.label}-${card.index}`} className={'dashboard-card'} to={card.path} key={index}>
              <Icon />
              <p className="card-heading">{t(`dashboard.card.${card.label}`)}</p>
              <p>{t(`dashboard.card.${card.details}`)}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
export default Dashboard;
