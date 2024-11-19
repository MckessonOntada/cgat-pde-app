import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { CustomDataTable } from '@mckesson/mcp-component-library';
import { useOrders } from '../../context';
import { useTranslate } from '@src/translations/useTranslation';
import { createColumns } from './Columns';

const OrderDataTable = ({ type = 'normal', pagination = true }) => {
    const { t } = useTranslate();
    const {
        dataState: data,
        pageConfig,
        setPageConfig,
        setCurrentPage,
    } = useOrders();

    const columns = createColumns(t);

    useEffect(() => {
        if (data && Array.isArray(data)) {
            setPageConfig({
                total: data.length,
                pageSize: 8,
                pages: Math.ceil(data.length / 8),
                currentPage: 1,
            });
        }
    }, [data, setPageConfig]);

    const handleOnPageChange = (_event, pageIndex) => {
        setCurrentPage(pageIndex);
    };

    const { currentPage, pageSize } = pageConfig;
    const batchEnd = currentPage * pageSize;
    const batchStart = batchEnd - pageSize;
    const batch = data.slice(batchStart, batchEnd);

    return (
        <CustomDataTable
            type={type}
            columns={columns}
            data={batch}
            handleChangePage={handleOnPageChange}
            pagination={pagination}
            currentPage={currentPage}
            totalPageCount={pageConfig.pages}
            totalRecords={pageConfig.total}
            recordsPerPage={pageSize}
            aria-label={t('table.ariaLabel.orderList')}
        />
    );
};

OrderDataTable.propTypes = {
    type: PropTypes.string,
    pagination: PropTypes.bool,
};

export default OrderDataTable;
