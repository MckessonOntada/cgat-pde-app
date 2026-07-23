/**
 * Utility to transfer sessionStorage values across tabs when opening a new tab.
 */

/**
 * Serializes all keys in sessionStorage and saves them in localStorage under a unique ID.
 * @returns {string|null} The unique transfer ID, or null if it fails.
 */
export const prepareSessionTransfer = () => {
  try {
    const sessionData = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        sessionData[key] = sessionStorage.getItem(key);
      }
    }
    const transferId = Date.now() + '_' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem(`transfer_session_${transferId}`, JSON.stringify(sessionData));
    return transferId;
  } catch (error) {
    console.error('Failed to prepare session transfer data:', error);
    return null;
  }
};

/**
 * Checks for a sessionTransferId in the query parameter, restores the sessionStorage
 * data from localStorage, cleans up the localStorage entry, and removes the query parameter from the URL.
 */
export const restoreSessionTransfer = () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const transferId = urlParams.get('sessionTransferId');
    if (transferId) {
      const dataStr = localStorage.getItem(`transfer_session_${transferId}`);
      if (dataStr) {
        const sessionData = JSON.parse(dataStr);
        Object.entries(sessionData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            sessionStorage.setItem(key, value);
          }
        });
        localStorage.removeItem(`transfer_session_${transferId}`);
      }
      const url = new URL(window.location.href);
      url.searchParams.delete('sessionTransferId');
      window.history.replaceState({}, '', url.pathname + url.search + url.hash);
    }
  } catch (error) {
    console.error('Failed to restore session transfer data:', error);
  }
};
