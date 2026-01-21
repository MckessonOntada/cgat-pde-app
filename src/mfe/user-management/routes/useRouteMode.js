import { useLocation, useParams } from 'react-router-dom';

function useRouteMode({ editSegment = 'edit', paramKey = 'id' } = {}) {
  const routeParams = useParams();
  const { pathname, search } = useLocation();

  const isEdit = Boolean(routeParams[paramKey]) && pathname.split('/').includes(editSegment);

  const queryParams = Object.fromEntries(new URLSearchParams(search));

  return {
    isEdit,
    id: routeParams[paramKey],
    params: queryParams
  };
}

export default useRouteMode;
