import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@mckesson/mcp-component-library';
import styles from './Admin.module.scss';
import CARDS_DATA from './AdminCards';
import { useTranslate } from '../../translations/useTranslation';
import Typography from '../../components/Typography';

const Dashboard = () => {
  const { t } = useTranslate();
  return (
    <div className={styles.container}>
      <Typography variant={"h3"}>Admin</Typography>
      <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {CARDS_DATA.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link to={card.path} key={index}>
              <div id={`${card.label}-${card.index}`} className={styles.card}>
                <Icon />
                <Typography variant="h4">{t(`adminDashboard.card.${card.label}`)}</Typography>
                <Typography variant="body">{t(`adminDashboard.card.${card.details}`)}</Typography>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
export default Dashboard;
