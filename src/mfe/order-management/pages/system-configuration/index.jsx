import React from 'react';
import { BREADCRUMB_ITEMS, CARDS } from './constants.js';
import { Link } from 'react-router-dom';
import { Heading } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation.js';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs.jsx';

export function SystemConfiguration(props) {
  const { t } = useTranslate();
  const translatedBreadcrumbs = BREADCRUMB_ITEMS.map((item) => ({
    ...item,
    label: t(`dashboard.card.${item.label}`)
  }));
  return (
    <div className="MCP-module-wrapper">
      <Breadcrumbs className="module-breadcrumb" items={translatedBreadcrumbs} />
      <Heading as="h2">{t('dashboard.card.system_configuration')}</Heading>
      <div className={''}>
        <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          {CARDS.map((card, index) => {
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
    </div>
  );
}
