import { debugIds, ID } from '@src/constants/id';

export const scrollToTopUtil = (containerId) => {
  const element = document.getElementById(containerId || debugIds(ID.HOME));
  if (element) {
    window.requestAnimationFrame(() => {
      element.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  } else {
    console.warn('Element not found');
  }
};
