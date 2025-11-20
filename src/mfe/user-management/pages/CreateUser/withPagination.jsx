import React from 'react';

const withPagination = (WrappedComponent) => {
  const HOC = ({ data = [], ...props }) => {
    const [pagination, setPagination] = React.useState({
      totalElements: data.length,
      pageSize: 8,
      totalPages: Math.ceil(data.length / 8),
      pageNo: 1
    });

    React.useEffect(() => {
      setPagination({
        totalElements: data.length,
        pageSize: 8,
        totalPages: Math.ceil(data.length / 8),
        pageNo: 1
      });
    }, [data]);

    const changePage = React.useCallback((pageNo) => {
      setPagination((p) => ({
        ...p,
        pageNo
      }));
    }, []);

    const paginatedData = React.useMemo(() => {
      const start = (pagination.pageNo - 1) * pagination.pageSize;
      const end = start + pagination.pageSize;
      return data.slice(start, end);
    }, [data, pagination]);

    const refreshPagination = React.useCallback(() => {
      setPagination((p) => ({
        ...p,
        totalElements: data.length,
        totalPages: Math.ceil(data.length / p.pageSize)
      }));
    }, [data]);

    return <WrappedComponent {...props} data={paginatedData} pagination={pagination} changePage={changePage} refreshPagination={refreshPagination} />;
  };

  return HOC;
};

export default withPagination;
