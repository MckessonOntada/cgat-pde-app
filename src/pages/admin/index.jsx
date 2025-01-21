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
    <div className={''}>
      {/* <Heading as="h1">{isSystemAdminView ? 'System Admin' : }</Heading> */}

      <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {allowedCards.map((card, index) => {
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
}

export default AdminLayout;
