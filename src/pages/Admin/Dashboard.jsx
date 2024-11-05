import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@mckesson/mcp-component-library';
import './Admin.scss'; 
import CARDS_DATA from './AdminCards';
import { useTranslate  } from '../../translations/useTranslation';

const Dashboard = () => {
  const { t } = useTranslate();
  return (
    <div className="container">
      <h1>Dashboard</h1>
      <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {CARDS_DATA.map((card, index) => (
          <Card
            bodyContent={
              <div>
                <p className="font-bold-title-s line-height">
                  <Link to={card.path} key={index} className="link-style">  
                    {t(`adminDashboard.card.${card.label}`)}
                  </Link>
                </p>
                <p>{t(`adminDashboard.card.${card.details}`)}</p>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
};
export default Dashboard;
