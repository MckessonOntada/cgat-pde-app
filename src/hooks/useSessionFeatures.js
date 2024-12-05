import { useMemo, useState } from 'react';
import { SESSION_CONST } from '@src/constants/SessionConstants';
import AuthUtils from '../util/AuthUtils';

const useSessionFeatures = () => {
  const [selectedOrganization, setSelectedOrganization] = useState(() => {
    // Retrieve data from sessionStorage on initial load
    const storedOrg = sessionStorage.getItem('selectedOrganization');
    return storedOrg ? JSON.parse(storedOrg) : {}; // Parse the stored string to an object
  });

  // Function to set the organization data
  const setOrganization = (org) => {
    setSelectedOrganization(org);
    sessionStorage.setItem('selectedOrganization', JSON.stringify(org));
    AuthUtils.setPracticeId(org?.id);
  };

  const removeOrganization = () => {
    setSelectedOrganization(null);
    sessionStorage.removeItem('selectedOrganization');
    AuthUtils.removePracticeId(SESSION_CONST.SELECTED_PRACTICE_ID);
  };

  return useMemo(
    () => ({
      organization: {
        selectedOrganization,
        setOrganization,
        isSelectedOrg: !!selectedOrganization,
        removeOrganization
      }
    }),
    [selectedOrganization, setOrganization]
  );
};

export default useSessionFeatures;
