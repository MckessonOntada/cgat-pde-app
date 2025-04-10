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
  const uniqueHeadings = [...new Set(CARDS.map((card) => card.heading))];
  return (
    <div className="MCP-module-wrapper">
      <Breadcrumbs items={translatedBreadcrumbs} />
      <div className="MCP-module-body">
        <Heading as="h1">{t('dashboard.card.system_configuration')}</Heading>
        {uniqueHeadings.map((heading, idx) => (
          <>
            {/* <Heading as="h2">{t(heading)}</Heading> */}
            <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 dashboard-card-wrapper">
              {CARDS.filter((card) => card.heading === heading).map(
                (card, index) => {
                  const Icon = card.icon;
                  return (
                    <Link
                      id={`${card.label}-${card.index}`}
                      className={'dashboard-card'}
                      to={card.path}
                      key={index}>
                      <Icon />
                      <p className="card-heading">
                        {t(`dashboard.card.${card.label}`)}
                      </p>
                      <p>{t(`dashboard.card.${card.details}`)}</p>
                    </Link>
                  );
                }
              )}
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
