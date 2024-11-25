import { useMemo, useState } from 'react';
import { SESSION_CONST } from '../constants/SessionConstants';

const useSessionFeatures = () => {
  const [selectedOrganization, setSelectedOrganization] = useState(() => {
    // Retrieve data from sessionStorage on initial load
    const storedOrg = sessionStorage.getItem('selectedOrganization');
    return storedOrg ? storedOrg : null; // Parse the stored string to an object
  });

  // Function to set the organization data
  const setOrganization = (org) => {
    setSelectedOrganization(org);
    sessionStorage.setItem('selectedOrganization', org);
    sessionStorage.setItem(SESSION_CONST.SELECTED_PRACTICE_ID, org?.id)
  };

  return useMemo(() => ({
    organization: {
      selectedOrganization,
      setOrganization,
      isSelectedOrg: !!selectedOrganization
    }
  }),[selectedOrganization, setOrganization]);
};

export default useSessionFeatures;
