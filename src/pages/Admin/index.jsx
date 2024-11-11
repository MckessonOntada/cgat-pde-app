import React from 'react';
import { Link } from 'react-router-dom';
import { Heading } from '@mckesson/mcp-component-library';
import styles from './Admin.module.scss';
import CARDS_DATA from './AdminCards';
import { useTranslate } from '../../translations/useTranslation';

const Dashboard = () => {
  const { t } = useTranslate();
  return (
    <div className={styles.container}>
      <Heading as="h1">Admin</Heading>
      <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {CARDS_DATA.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link to={card.path} key={index}>
              <div id={`${card.label}-${card.index}`} className={styles.card}>
                <Icon />
                <Heading as="h3" color="brand-color-black">
                  {t(`adminDashboard.card.${card.label}`)}
                </Heading>
                <p className={styles.cardContent}>{t(`adminDashboard.card.${card.details}`)}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
export default Dashboard;
