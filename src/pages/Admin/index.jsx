import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@mckesson/mcp-component-library';
import styles from './Admin.module.scss';
import CARDS_DATA from './AdminCards';
import { useTranslate } from '../../translations/useTranslation';

const Dashboard = () => {
  const { t } = useTranslate();
  return (
    <div className={styles.container}>
      <h1>Admin</h1>
      <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {CARDS_DATA.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link to={card.path} key={index}>
              <div id={`${card.label}-${card.index}`} className={styles.card}>
                <Icon />
                <p className={styles.title}>{t(`adminDashboard.card.${card.label}`)} </p>
                <p className={styles.subTitle}>{t(`adminDashboard.card.${card.details}`)}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
export default Dashboard;
