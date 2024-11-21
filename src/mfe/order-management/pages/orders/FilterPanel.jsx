import React from 'react';
import styles from './Orders.module.scss';
import ToggleUI from '@src/components/toggleui';
import { AutoSuggestSearch, Button, Divider, SearchableDropdown } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as ArrowRight } from '@src/assets/image/arrow_right.svg';
import { ReactComponent as ArrowDown } from '@src/assets/image/arrow_down.svg';
import { useOrders } from '../../context';

const ROLES = [
    { label: "Admin", value: "Admin" },
    { label: "Supervisor", value: "Supervisor" },
    { label: "SuperAdmin", value: "SuperAdmin" },
];

const STATUS = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
];

const FilterPanel = ({ onApplyFilters }) => {
    const { t } = useTranslate();
    const [isExpanded, setIsExpanded] = React.useState(false);
    const { filterState, applyFilters, clearFilters } = useOrders();
    const [filters, setFilters] = React.useState({...filterState});
    
    const handleOnExpandClick = () => {
        setIsExpanded((prevState) => !prevState);
    };

    const handleOnStatusChange = (value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            status: value
        }));
    };

    const handleOnQueryChange = (value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            searchQuery: value
        }));
    };

    const handleOnApplyFilters = () => {
        applyFilters(filters)
        setFilters({})
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.filterPanel}>
                <div className={styles.filterHeader}>
                    <div className={styles.flex}>
                        <button
                            className={styles.iconButton}
                            onClick={handleOnExpandClick}
                            aria-expanded={isExpanded}
                            aria-label={isExpanded
                                ? t('controls.ariaLabels.collapseFilters')
                                : t('controls.ariaLabels.expandFilters')}
                        >
                            {isExpanded ? <ArrowDown /> : <ArrowRight />}
                        </button>
                        <div className="autoSuggestSearch-container">
                            <AutoSuggestSearch
                                label=" "
                                value={filterState.searchQuery}
                                onChangeInput={handleOnQueryChange}
                                outline
                                placeHolder={t('controls.placeholders.autoSearch')}
                                aria-label={t('controls.ariaLabels.searchOrders')}
                            />
                        </div>
                    </div>
                    <div>
                        <Button
                            size="md"
                            variant="secondary"
                            onClick={handleOnApplyFilters}
                        >Apply Filters</Button>
                    </div>
                </div>

                <ToggleUI in={isExpanded}>
                    <div className={styles.filterOptionsWrapper}>
                        <Divider />
                        <div className={`${styles.customSearchableDropdown} grid grid-gap-24 grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3`}>
                            <SearchableDropdown
                                id="order-management-status"
                                isSuccess
                                value={filters.status}
                                label={t('captions.status')}
                                name="status"
                                isRequired={false}
                                onChange={handleOnStatusChange}
                                options={STATUS}
                                clearAllSelectedValues={() => { }}
                                aria-labelledby={t("controls.ariaLabels.orderManagementStatue")}
                            />

                            <div className={styles.filterAction}>
                                <Button
                                    type="button"
                                    label={t('captions.clearFilters')}
                                    textButton
                                    onClick={clearFilters}
                                    aria-label={t('captions.clearFilters')}
                                />
                            </div>
                        </div>
                    </div>
                </ToggleUI>
            </div>
        </div>
    );
};

export default FilterPanel;
