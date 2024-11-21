import { useState } from 'react';

const useSessionFeatures = () => {
  const [selectedOrganization, setSelectedOrganization] = useState(() => {
    // Retrieve data from sessionStorage on initial load
    const storedOrg = sessionStorage.getItem('selectedOrganization');
    return storedOrg ? JSON.parse(storedOrg) : null; // Parse the stored string to an object
  });

  // Function to set the organization data
  const setOrganization = (org) => {
    setSelectedOrganization(org);
    sessionStorage.setItem('selectedOrganization', JSON.stringify(org));
  };

  return {
    organization: {
      selectedOrganization,
      setOrganization
    }
  };
};

export default useSessionFeatures;
