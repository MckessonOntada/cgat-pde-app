import { useTranslate } from '@src/translations/useTranslation';
import React from 'react';

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
    const first = user?.name?.firstName?.[0]?.toUpperCase() || '';
    const last = user?.name?.lastName?.[0]?.toUpperCase() || '';
    return first + last;
  });

  return (
    initials.length > 0 && (
      <div className="collaborator">
        <p>{t('labels.collaborators')}</p>
        <div className="collaborator-initials">
          {initials.map((init, idx) => (
            <span key={idx}>{init}</span>
          ))}
        </div>
      </div>
    )
  );
};

export default Collaborator;
