import { Card } from '@mckesson/mcp-component-library';
import React from 'react';
import { ADMIN_PATHS } from '../../routes/constants';
import { Link } from 'react-router-dom';
import './Admin.scss';
import cardData from './__mock__';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t } = useTranslation();
  return (
    <div className="container">
      <h1>Dashboard</h1>
      <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {cardData.map((card, index) => (
          <Card
            bodyContent={
              <div>
                <p className="font-bold-title-s line-height">
                  <Link to={card.path} key={index} className="link-style">
                    {' '}
                    {t(`dashboard.${card.label}`)}{' '}
                  </Link>
                </p>
                <p>{t(`dashboard.${card.details}`)}</p>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
};
export default Dashboard;
