import React from 'react';
import styles from './Orders.module.scss';
import { CustomDataTable, Dropdown } from '@mckesson/mcp-component-library';

const OrderDataTable = ({ title, type = 'normal', columns, data, pagination = true }) => {
    const [pageConfig, setPageConfig] = React.useState({
        total: 0,
        pageSize: 8,
        pages: 0,
        currentPage: 0,
    });
    React.useEffect(() => {
        if (data && Array.isArray(data)) {
            setPageConfig({
                total: data.length,
                pageSize: 8,
                pages: Math.ceil(data.length),
                currentPage: 1,
            })
        }
    }, []);
    const handleOnPageSizeChange = (value) => {
        setPageConfig({
            ...pageConfig,
            pageSize: value
        })
    }
    return (
        <div
            className={styles.dataTableWrapper}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}
        >
            <p className={styles.title}>{title}</p>
            <CustomDataTable
                type={type}
                columns={columns}
                data={data}
                // onSortIconClick={handleSortClick}
                // handleChangePage={(e, newPage) => onPageChange(newPage)}
                // selectableRows={selectableRows}
                pagination={pagination}
                currentPage={pageConfig.currentPage}
                totalPageCount={pageConfig.pages}
                totalRocords={pageConfig.total}
                recordsPerPage={pageConfig.pageSize}
                paginationRecordsPerPageMessage={
                    <Dropdown
                        label="Page Size"
                        name="page-size-input"
                        onChange={handleOnPageSizeChange}
                        options={[8,16,32,64,128].map(s=>({label:s.toString(), value: s}))}
                        placeholder="select age"
                        tooltipText=""
                        value={pageConfig.pageSize}
                    />
                }
                paginationTotalRecorsMessage={`${pageConfig.total} results`}
                isStickyPagination={pagination}
            />
        </div>
    )
}

export default OrderDataTable;