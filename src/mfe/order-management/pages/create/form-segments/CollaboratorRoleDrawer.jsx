import { Tooltip, Heading, Pills, Loader } from '@mckesson/mcp-component-library';
import FloatingDrawer from '@src/components/floating-drawer';
import ModuleHeader from '@src/components/module-header';
import { useTranslate } from '@src/translations/useTranslation';
import React from 'react';
import style from '../CreateOrder.module.scss';

export const CollaboratorRoleDrawer = ({ open, onClose, stageCards, getInitials, currentStage, isLoading }) => {
  const { t } = useTranslate();

  function cardStateClass(card) {
    if (currentStage === card.id) return style.cardCurrent;
    if (currentStage > card.id) return style.cardCompleted;
    return '';
  }

  function renderCollaboratorTooltip(card) {
    if (!card.collaborators || card.collaborators.length === 0) {
      return null;
    }

    const { collaborators, initialsColor } = card;

    if (collaborators.length === 1 || collaborators.length === 2) {
      return collaborators.map((collab, index) => (
        <Tooltip key={index} body={collab}>
          <span style={{ backgroundColor: initialsColor }}>{getInitials(collab)}</span>
        </Tooltip>
      ));
    }

    return (
      <>
        <Tooltip body={collaborators[0]}>
          <span style={{ backgroundColor: initialsColor }}>{getInitials(collaborators[0])}</span>
        </Tooltip>
        <Tooltip
          body={
            <span
              dangerouslySetInnerHTML={{
                __html: collaborators.join(' <b>|</b> ')
              }}
            />
          }>
          <span style={{ backgroundColor: initialsColor }}>{`+${collaborators.length - 1}`}</span>
        </Tooltip>
      </>
    );
  }

  function getLabels(card) {
    const labels = Object.entries(card.labels || {}).map(([role, value], idx) => {
      const tooltipBody = Array.isArray(value) ? (
        <div className="user-list-tooltip">
          <strong>{t('label.userList')}</strong>
          <ul className="user-list">
            {value.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      ) : (
        value || t('label.userNotAssigned')
      );

      return {
        id: idx + 1,
        labelText: (
          <Tooltip body={tooltipBody}>
            <span>{role}</span>
          </Tooltip>
        )
      };
    });

    return labels;
  }

  return (
    <FloatingDrawer open={open} anchor="right" onClose={onClose} heading={t('label.whoCanDoWhat')}>
      <div className="details-main-wrapper">
        <div className={style.stagesCards}>
          <div className="styled-heading rolesHeading">
            <Heading as="h4">{t('label.rolesListingBySteps')}</Heading>
          </div>
          {isLoading ? (
            <Loader variant="circular" />
          ) : (
            stageCards.map((card) =>
              card.id ? (
                <div key={card.id} className={`${style.card} ${cardStateClass(card)}`}>
                  <ModuleHeader
                    heading={
                      <div className="styled-heading">
                        <Heading as="h4">{card.name}</Heading>
                      </div>
                    }
                    controls={
                      <div className="collaborator-initials">
                        {card.collaborators?.length > 0 && <p>Collaborators:</p>}
                        {renderCollaboratorTooltip(card)}
                      </div>
                    }
                  />
                  <div className={style.pillsContainer}>
                    <Pills id={card.name?.toLowerCase().replace(/\s+/g, '-')} labels={getLabels(card)} name={name} size="sm" variant="secondary" />
                  </div>
                </div>
              ) : null
            )
          )}
        </div>
      </div>
    </FloatingDrawer>
  );
};
