import { useLocation } from 'react-router-dom';

function useActiveRouteHandle(steps) {
  const { pathname } = useLocation();

  for (let index = 0; index < steps.length; index++) {
    const step = steps[index];

    if (pathname.endsWith(`/${step.path}`) || pathname.includes(`/${step.path}/`)) {
      return {
        activeStep: step.key,
        stepIndex: index
      };
    }
  }

  return {
    activeStep: null,
    stepIndex: -1
  };
}

export default useActiveRouteHandle;
