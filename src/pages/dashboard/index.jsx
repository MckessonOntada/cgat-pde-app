import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heading } from '@mckesson/mcp-component-library';
import styles from './Dashboard.module.scss';
import { SYSTEM_ADMIN_CARDS_DATA, CARDS_DATA } from './DashboardCards';
import { useTranslate } from '@src/translations/useTranslation';
import AuthUtils from '@src/util/AuthUtils';

const Dashboard = () => {
  const { t } = useTranslate();

  const userRole = AuthUtils.getUserRole();
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const userPermissions = AuthUtils.getUserPermissions();

  // const cards = isSystemAdminView ? SYSTEM_ADMIN_CARDS_DATA : CARDS_DATA;
  const cards = useMemo(() => {
    if (isSystemAdminView) return SYSTEM_ADMIN_CARDS_DATA;

    let _cards = CARDS_DATA.filter((card) => {
      let _hasAccess = userPermissions.includes(card.permissions);
      return _hasAccess;
    });
    return _cards;
  }, []);

  return (
    <div className={styles.container}>
      {/* <Heading as="h1">{isSystemAdminView ? 'System Admin' : }</Heading> */}

      <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link to={card.path} key={index}>
              <div id={`${card.label}-${card.index}`} className={styles.card}>
                <Icon />
                <Heading as="h3" color="brand-color-black">
                  {t(`dashboard.card.${card.label}`)}
                </Heading>
                <p className={styles.cardContent}>{t(`dashboard.card.${card.details}`)}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
export default Dashboard;
