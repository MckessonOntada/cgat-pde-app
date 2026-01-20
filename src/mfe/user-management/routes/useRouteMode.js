import { useLocation, useParams } from 'react-router-dom';

function useRouteMode({ editSegment = 'edit', paramKey = 'id' } = {}) {
  const params = useParams();
  const { pathname } = useLocation();

  const isEdit = Boolean(params[paramKey]) && pathname.split('/').includes(editSegment);

  return {
    isEdit,
    id: params[paramKey]
  };
}

export default useRouteMode;
