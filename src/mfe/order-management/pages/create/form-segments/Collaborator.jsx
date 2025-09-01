import { useTranslate } from '@src/translations/useTranslation';
import React from 'react';
import { Tooltip } from '@mckesson/mcp-component-library';
import { GET_STAGE_DISPLAY_NAME, ORDER_STAGES, STAGE_COLORS } from './Constants';
const Collaborator = ({ collaborators }) => {
  const { t } = useTranslate();
  function buildCollaborators(data) {
    const userMap = {};
    const getInitials = (name) => {
      if (!name) return '';
      return name
        .split(', ')
        .filter(Boolean)
        .map((part) => part[0]?.toUpperCase())
        .join('')
        .slice(0, 2);
    };

    Object.entries(data).forEach(([stage, users]) => {
      users.forEach((user) => {
        const { id, name } = user;

        if (!userMap[id]) {
          userMap[id] = {
            Name: name,
            id,
            initials: getInitials(name),
            collaboratedOn: {},
            color: null
          };
        }

        if (!userMap[id].collaboratedOn[stage]) {
          userMap[id].collaboratedOn[stage] = GET_STAGE_DISPLAY_NAME(stage);
        }
      });
    });

    for (const id in userMap) {
      const stages = userMap[id].collaboratedOn;
      let maxIndex = -1;
      let finalStage = null;

      const stageOrder = Object.keys(ORDER_STAGES);

      Object.keys(stages).forEach((stageKey) => {
        const idx = stageOrder.indexOf(stageKey);
        if (idx > maxIndex) {
          maxIndex = idx;
          finalStage = stageKey;
        }
      });

      userMap[id].color = finalStage ? STAGE_COLORS[finalStage] : null;
    }

    return Object.values(userMap);
  }

  const collaboratorsData = buildCollaborators(collaborators);

  console.log('collaboratorsData:', collaboratorsData);

  return (
    collaboratorsData.length > 0 && (
      <div className="collaborator">
        <p>{t('labels.collaborators')}</p>
        <div className="collaborator-initials">
          {collaboratorsData.map((collab, idx) => (
            <Tooltip
              body={
                <span>
                  <strong>{collab?.Name}</strong> - {Object.values(collab?.collaboratedOn).join(', ')}
                </span>
              }
              key={idx}>
              <span style={{ backgroundColor: collab?.color }}>{collab?.initials}</span>
            </Tooltip>
          ))}
        </div>
      </div>
    )
  );
};

export default Collaborator;
