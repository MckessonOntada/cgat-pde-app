import React from 'react';
import cardList from './CardConfig';
import styles from '../dashboard/Dashboard.module.scss';
import usePermission from '@src/hooks/usePermissions';
import { useTranslate } from '@src/translations/useTranslation';
import { Heading } from '@mckesson/mcp-component-library';
import { Link } from 'react-router-dom';

function AdminLayout() {
  const { hasPermission } = usePermission();
  const { t } = useTranslate();

  const allowedCards = React.useMemo(() => {
    let cards = cardList.filter((card) => {
      return hasPermission(card.permissions);
    });
    return cards;
  }, []);
  return (
    <div className={styles.container}>
      {/* <Heading as="h1">{isSystemAdminView ? 'System Admin' : }</Heading> */}

      <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {allowedCards.map((card, index) => {
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
}

export default AdminLayout;
