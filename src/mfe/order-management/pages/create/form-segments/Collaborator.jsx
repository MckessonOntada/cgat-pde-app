import { useTranslate } from '@src/translations/useTranslation';
import React from 'react';
import { Tooltip } from '@mckesson/mcp-component-library';
const Collaborator = ({ collaborators }) => {
  const { t } = useTranslate();
  const allUsers = Object.values(collaborators || {})
    .flat()
    .filter(Boolean);

  const uniqueUsers = allUsers.reduce((acc, user) => {
    if (!acc.some((u) => u.id === user.id)) {
      acc.push(user);
    }
    return acc;
  }, []);

  const initials = uniqueUsers.map((user) => {
    const initials = user.name
      .split(/[ ,]+/)
      .filter(Boolean)
      .map((word) => word[0].toUpperCase())
      .join('');
    return {
      initials,
      name: user.name
    };
  });

  return (
    initials.length > 0 && (
      <div className="collaborator">
        <p>{t('labels.collaborators')}</p>
        <div className="collaborator-initials">
          {initials.map((init, idx) => (
            <Tooltip key={idx} body={init.name}>
              <span>{init.initials}</span>
            </Tooltip>
          ))}
        </div>
      </div>
    )
  );
};

export default Collaborator;
